import React, { useState, useEffect, useRef } from 'react';
import AppContext, { Contact, Conversation, defaultContact, defaultUserData, Group, UserData } from './app-context';
import { Plugins } from '@capacitor/core';
import firebase from "../firebase";
import { useTranslation } from 'react-i18next';

const { Storage } = Plugins;

const AppContextProvider: React.FC = (props) => {
    const [userdata, setUserData] = useState<UserData>(defaultUserData as UserData);
    const [contacts, setContacts] = useState<Contact>(defaultContact as Contact);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    // Auth state
    const [user, setUser] = useState(null as firebase.User | null);
    const [loadingAuthState, setLoadingAuthState] = useState(true);

    const didMountRef = useRef(false);
    const { i18n } = useTranslation();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user: any) => {
            setUser(user);
            setLoadingAuthState(false);
            let firebaseUser = user as firebase.User;
            const db = firebase.firestore();
            if (firebaseUser && firebaseUser.uid) {
                db.collection("Users").doc(firebaseUser.uid)
                    .onSnapshot(function (doc) {
                        const updatedProfile = doc.data() as UserData;
                        setUserData(updatedProfile);
                    });

                db.collection("Contacts").where("uidUser", "==", firebaseUser.uid)
                    .onSnapshot(function (doc) {
                        const updatedContact = doc.docs[0].data() as Contact;
                        setContacts(updatedContact);
                    });

                db.collection("Conversations").where("users", "array-contains", firebaseUser.uid).orderBy("lastMessage.sendedAt", "desc")
                    .onSnapshot((res) => {
                        let list : Conversation[] = [];
                        res.docs.forEach((elem) => {
                            list.push(elem.data() as Conversation);
                        })
                        setConversations(list);
                    });

                db.collection("Groups").where("users", "array-contains", firebaseUser.uid).orderBy("lastMessage.sendedAt", "desc")
                    .onSnapshot((res) => {
                        let list : Group[] = [];
                        res.docs.forEach((elem) => {
                            list.push(elem.data() as Group);
                        })
                        setGroups(list);
                    });
            }
        });
    }, []);

    useEffect(() => {
        if (didMountRef.current) {
            Storage.set({ key: 'userdata', value: JSON.stringify(userdata) });
            Storage.set({ key: 'contactList', value: JSON.stringify(contacts) });
            Storage.set({ key: 'conversations', value: JSON.stringify(conversations) });
            Storage.set({ key: 'groups', value: JSON.stringify(groups) });
        } else {
            didMountRef.current = true;
        }
    }, [userdata, contacts, conversations, groups])

    const setupUserData = (user: any) => {
        firebase.firestore().collection('Users').doc(user.user.uid).get()
            .then(doc => {
                const data = doc.data();
                const aled: UserData = {
                    phone: data?.phone,
                    username: data?.username,
                    name: data?.name,
                    lastname: data?.lastname,
                    picture: data?.picture,
                    contact: data?.contact,
                    email: data?.email,
                    birthdate: data?.birthdate,
                    description: data?.description,
                    uid: data?.uid,
                }
                setUserData(aled);
            }).catch((err) => {
                console.log("An error occured : ", err)
            })
    }

    const updateUserData = (user: any) => {
        const db = firebase.firestore();
        const docRef = db.collection('Users').doc(user?.uid);
        db.runTransaction((transaction) => {
            return transaction.get(docRef).then( (doc) => {
                if (!doc.exists) {
                    console.log("Fail to update profile")
                } else {
                    transaction.update(docRef, user)
                }
            })
        })
    }

    const updateOneFieldUserData = (user: any, fieldName: string, value: any) => {
        firebase.firestore().collection('Users').doc(user!.uid).update({
            [fieldName]: value
        });
    }

    const setupContactList = (user: any) => {
        firebase.firestore().collection('Users').doc(user.user.uid).get()
            .then( (userPropsResult) => {
                firebase.firestore().collection('Contacts').doc(userPropsResult.data()?.contact)
                    .onSnapshot(function(doc) {
                        setContacts(doc.data() as Contact)
                    })
            }).catch( (err) => {
                console.log("An error occured : ", err);
            });        
    }

    const addContact = (newContact: string) => {
        const db = firebase.firestore()
        if ( contacts.myPendingList.includes(newContact) || contacts.otPendingList.includes(newContact) ) {
            // Add to my waiting contact list
            const filtered = contacts.otPendingList.filter((value, index, arr) => { return value !== newContact; });
            contacts.contactList.push(newContact);
            db.collection('Contacts').doc(userdata.contact).update({
                contactList: contacts.contactList,
                otPendingList: filtered
            });

            // Add to other contact list
            db.collection('Contacts').where('uidUser', '==', newContact).get()
                .then((res) => {
                    let ctt = res.docs[0].data() as Contact;
                    const cttFiltered = ctt.myPendingList.filter((value, index, arr) => { return value !== userdata.uid; });
                    ctt.contactList.push(userdata.uid);
                    db.collection('Users').where('uid', '==', newContact).get()
                        .then((res) => {
                            db.collection('Contacts').doc(res.docs[0].data().contact).update({
                                contactList: ctt.contactList,
                                myPendingList: cttFiltered
                            })
                        })
                })
        } else {
            // Add to my waiting contact list
            contacts.myPendingList.push(newContact)
            db.collection('Contacts').doc(userdata.contact).update({
                myPendingList: contacts.myPendingList
            });

            // Add to other contact list
            db.collection('Contacts').where('uidUser', '==', newContact).get()
                .then((res) => {
                    let ctt = res.docs[0].data() as Contact;
                    ctt.otPendingList.push(userdata.uid);
                    db.collection('Users').where('uid', '==', newContact).get()
                        .then((res) => {
                            db.collection('Contacts').doc(res.docs[0].data().contact).update({
                                otPendingList: ctt.otPendingList
                            })
                        })
                })
        }
    }

    const refuseInvite = ( inviteId: string ) => {
        const db = firebase.firestore();

        // Remove waiting invite from list
        const cttFiltered = contacts.otPendingList.filter((value, index, arr) => { return value !== inviteId; });
        db.collection('Contacts').doc(userdata.contact).update({
            otPendingList: cttFiltered
        });

        // Remove from other contact list
        db.collection('Contacts').where('uidUser', '==', inviteId).get()
            .then((res) => {
                let ctt = res.docs[0].data() as Contact;
                const cttFiltered = ctt.myPendingList.filter((value, index, arr) => { return value !== userdata.uid; });
                db.collection('Users').where('uid', '==', inviteId).get()
                    .then((res) => {
                        db.collection('Contacts').doc(res.docs[0].data().contact).update({
                            myPendingList: cttFiltered
                        })
                    })
            })
    }

    const delPendingInvite = (inviteId: string) => {
        const db = firebase.firestore();

        // Remove waiting invite from list
        const cttFiltered = contacts.myPendingList.filter((value, index, arr) => { return value !== inviteId; });
        db.collection('Contacts').doc(userdata.contact).update({
            myPendingList: cttFiltered
        });

        // Add to other contact list
        db.collection('Contacts').where('uidUser', '==', inviteId).get()
            .then((res) => {
                let ctt = res.docs[0].data() as Contact;
                const cttFiltered = ctt.otPendingList.filter((value, index, arr) => { return value !== userdata.uid; });
                db.collection('Users').where('uid', '==', inviteId).get()
                    .then((res) => {
                        db.collection('Contacts').doc(res.docs[0].data().contact).update({
                            otPendingList: cttFiltered
                        })
                    })
            })
    }

    const removeContact = (removeContact: string) => {
        const db = firebase.firestore()

        const filtered = contacts.contactList.filter((value, index, arr) => { return value !== removeContact; });
        db.collection('Contacts').doc(userdata.contact).update({
            contactList: filtered
        });

        db.collection('Contacts').where('uidUser', '==', removeContact).get()
                .then((res) => {
                    let ctt = res.docs[0].data() as Contact;
                    const filtered = ctt.contactList.filter((value, index, arr) => { return value !== userdata.uid; });
                    db.collection('Users').where('uid', '==', removeContact).get()
                        .then((res) => {
                            db.collection('Contacts').doc(res.docs[0].data().contact).update({
                                contactList: filtered
                            })
                        })
                })
    }

    const startConv = async (receiverId: string, message: any) => {
        const db = firebase.firestore();
        let exists = false;

        conversations.forEach((conv) => {
            if ((conv.users.length === 2) && (conv.users.includes(receiverId))) {
                db.collection("Messages").add({
                    convId: conv.convId,
                    message: message,
                    sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderId: userdata.uid
                }).then((res) => {
                    const filtered = conversations.filter((value) => { return value.convId === conv.convId; })[0];
                    filtered.messages.push(res.id);
                    db.collection("Messages").doc(res.id).get().then((res2) => {
                        db.collection("Conversations").doc(conv.convId).update({
                            lastMessage: res2.data(),
                            messages: filtered.messages
                        });
                    });
                }).catch((err) => {
                    console.log(err)
                })

                exists = true;
            }
        })

        if (exists) return ;

        db.collection("Conversations").add({
            convId:"",
            lastMessage: {},
            messages: [],
            users: [
                userdata.uid,
                receiverId
            ],
        }).then((convRes) => {
            convRes.update({
                convId: convRes.id
            });

            db.collection("Messages").add({
                convId: convRes.id,
                message: message,
                sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                senderId: userdata.uid
            }).then((msgRes) => {
                db.collection("Messages").doc(msgRes.id).get().then((res) => {
                    db.collection("Conversations").doc(convRes.id).update({
                        lastMessage: res.data(),
                        messages: [res.id]
                    })
                })
            })
        })
    }

    const sendMessage = async (convId: string, message: any) => {
        const db = firebase.firestore();
        db.collection("Messages").add({
            convId: convId,
            message: message,
            sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
            senderId: userdata.uid
        }).then((res) => {
            const filtered = conversations.filter((value) => { return value.convId === convId; })[0];
            filtered.messages.push(res.id);
            db.collection("Messages").doc(res.id).get().then((res2) => {
                db.collection("Conversations").doc(convId).update({
                    lastMessage: res2.data(),
                    messages: filtered.messages
                });
            });
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * @param creatorUser String of users creating the group
     * @param users List of users that will be automatically added to the group at creation
     * @param groupName String containing name of the group, can be empty -> the name will be "creatorName-groupId"
     * @param message String can be empty (no message send at start of the conversation)
     * @description Makes connected user quit the group
     */
    const createGroup = async (creatorUser: string, users: string[], groupName: string, message: string) => {
        const db = firebase.firestore();
        await db.collection("Groups").add({
            groupId: "",
            groupName: "",
            lastMessage: {},
            messages: [],
            users: [
                ...users,
                creatorUser
            ],
            adminUsers: [
                creatorUser,
            ],
            creatorId: creatorUser
        }).then((res) => {
            db.collection("Groups").doc(res.id).update({
                groupId: res.id,
                groupName: groupName ? groupName : `${userdata.username}-${res.id}`
            })

            if (message) {
                db.collection("Messages").add({
                    convId: res.id,
                    message: message,
                    sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderId: userdata.uid
                }).then((msgRes) => {
                    db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                        db.collection("Groups").doc(res.id).update({
                            lastMessage: resMessage.data(),
                            messages: [resMessage.id]
                        })
                    })
                })
            }
        })
    }

    /**
     * @param groupId Id from a group
     * @param users user's id list
     * @description Add users to an existing group
     */
    const addUsers = (groupId: string, users: string[]) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let groupInf = res.data() as Group;
                groupInf.users.push(...users)

                db.collection("Groups").doc(groupId).update({
                    users: groupInf.users
                }).then(() => {
                    db.collection("Messages").add({
                        convId: groupId,
                        message: `${users.join(", ")} joined`,
                        sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        senderId: "system"
                    }).then((msgRes) => {
                        groupInf.messages.push(msgRes.id)
                        db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                            db.collection("Groups").doc(res.id).update({
                                lastMessage: resMessage.data(),
                                messages: groupInf.messages
                            })
                        })
                    })
                })
            })
    }

    /**
     * @param groupId Id from a group
     * @param userId user's id
     * @description Elevate a users to admin in an existing group
     */
    const promotAdmin = (groupId: string, userId: string) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let groupInf = res.data() as Group;
                groupInf.adminUsers.push(userId);

                db.collection("Groups").doc(groupId).update({
                    adminUsers: groupInf.adminUsers,
                }).then(() => {
                    db.collection("Messages").add({
                        convId: groupId,
                        message: `${userId} has been promoted`,
                        sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        senderId: "system"
                    }).then((msgRes) => {
                        groupInf.messages.push(msgRes.id)
                        db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                            db.collection("Groups").doc(res.id).update({
                                lastMessage: resMessage.data(),
                                messages: groupInf.messages
                            })
                        })
                    })
                })
            })
    }

    /**
     * @param groupId Id from a group
     * @param userId user's id
     * @description Demote a users from admin to peon in an existing group
     */
    const demoteAdmin = (groupId: string, userId: string) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let groupInf = res.data() as Group;
                let filtAdmins = groupInf.adminUsers.filter((val) => { return val !== userId });

                db.collection("Groups").doc(groupId).update({
                    adminUsers: filtAdmins,
                }).then(() => {
                    db.collection("Messages").add({
                        convId: groupId,
                        message: `${userId} has been demoted`,
                        sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        senderId: "system"
                    }).then((msgRes) => {
                        groupInf.messages.push(msgRes.id)
                        db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                            db.collection("Groups").doc(res.id).update({
                                lastMessage: resMessage.data(),
                                messages: groupInf.messages
                            })
                        })
                    })
                })
            })
    }

    /**
     * @param groupId Id from a group
     * @param message user's message
     * @description Demote a users from admin to peon in an existing group
     */
    const groupSendMessage = (groupId: string, message: string) => {
        const db = firebase.firestore();

        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let currentGrp = res.data() as Group;
                db.collection("Messages").add({
                    convId: groupId,
                    message: message,
                    sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderId: userdata.uid
                }).then((msgRes) => {
                    currentGrp.messages.push(msgRes.id);
                    db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                        db.collection("Groups").doc(res.id).update({
                            lastMessage: resMessage.data(),
                            messages: currentGrp.messages
                        })
                    })
                })
            })
    }

    /**
     * @param groupId Id from a group
     * @param users user's id list
     * @description Elevate a users to admin in an existing group
     */
    const removeUsers = (groupId: string, users: string[]) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let groupInf = res.data() as Group;
                let filtUsers = groupInf.users.filter((val) => { return !users.includes(val) });
                let filtAdmins = groupInf.adminUsers.filter((val) => { return !users.includes(val) });

                db.collection("Groups").doc(groupId).update({
                    users: filtUsers,
                    adminUsers: filtAdmins
                }).then(() => {
                    db.collection("Messages").add({
                        convId: groupId,
                        message: `${filtUsers.join(", ")} were removed`,
                        sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        senderId: "system"
                    }).then((msgRes) => {
                        groupInf.messages.push(msgRes.id)
                        db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                            db.collection("Groups").doc(res.id).update({
                                lastMessage: resMessage.data(),
                                messages: groupInf.messages
                            })
                        })
                    })
                })
            })
    }

    /**
     * @param groupId
     * @description Makes connected user quit the group
     */
    const quitGroup = (groupId: string) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).get()
            .then((res) => {
                let groupInf = res.data() as Group;
                let filtUsers = groupInf.users.filter((val) => { return val !== userdata.uid });
                let filtAdmins = groupInf.adminUsers.filter((val) => { return val !== userdata.uid });

                db.collection("Groups").doc(groupId).update({
                    users: filtUsers,
                    adminUsers: filtAdmins
                }).then(() => {
                    db.collection("Messages").add({
                        convId: groupId,
                        message: `${userdata.username} has quit`,
                        sendedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        senderId: "system"
                    }).then((msgRes) => {
                        groupInf.messages.push(msgRes.id)
                        db.collection("Messages").doc(msgRes.id).get().then((resMessage) => {
                            db.collection("Groups").doc(res.id).update({
                                lastMessage: resMessage.data(),
                                messages: groupInf.messages
                            })
                        })
                    })
                })
            })
    }

    /**
     * @param groupId
     * @description Makes connected user delete the group and all messages
     */
    const deleteGroup = (groupId: string) => {
        const db = firebase.firestore();
        db.collection("Groups").doc(groupId).delete()
            .then(() => {
                db.collection("Messages").where("convId", "==", groupId).get()
                    .then((res) => {
                        res.forEach((msg) => {
                            msg.ref.delete();
                        })
                    })
            })
            
    }

    const initContext = async () => {
        const userData = await Storage.get({ key: 'userdata' });
        const contactList = await Storage.get({ key: 'contactList' });
        const conversationList = await Storage.get({ key: 'conversations' });
        const groupList = await Storage.get({ key: 'groups' });

        const storedUserData = userData.value ? JSON.parse(userData.value) : defaultUserData;
        const storedContactList = contactList.value ? JSON.parse(contactList.value) : defaultContact;
        const storedConversationList = conversationList.value ? JSON.parse(conversationList.value) : [];
        const storedGroupList = groupList.value ? JSON.parse(groupList.value) : [];
        
        didMountRef.current = false;

        setUserData(storedUserData);
        setContacts(storedContactList);
        setConversations(storedConversationList);
        setGroups(storedGroupList);
    }

    const updateLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
        let newProfile = { ...userdata };
        newProfile.lng = lng;
        updateUserData(newProfile);
    }

    return (
        <AppContext.Provider value={{
            initContext,

            userdata,
            setupUserData,
            updateUserData,
            updateOneFieldUserData,

            contacts,
            setupContactList,
            addContact,
            refuseInvite,
            delPendingInvite,
            removeContact,

            conversations,
            sendMessage,
            startConv,

            groups,
            createGroup,
            addUsers,
            promotAdmin,
            demoteAdmin,
            groupSendMessage,
            removeUsers,
            quitGroup,
            deleteGroup,
            
            user,
            authenticated: user !== null,
            setUser,
            loadingAuthState,

            updateLanguage

        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider