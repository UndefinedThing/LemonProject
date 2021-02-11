import { IonAvatar, IonItem, IonItemSliding, IonLabel, IonList, IonNote } from '@ionic/react'
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import defaultProfile from '../assets/defaultProfile.jpg';
import AppContext, { Conversation, Group } from '../data/app-context';
import firebase from '../firebase';
import { fromDate } from '../helpers/dateHelper';

import { ROUTE_CONVERSATION, ROUTE_GROUP } from '../nav/Routes';
import { useTranslation } from 'react-i18next';

interface oui {
    [key: string]: firebase.firestore.DocumentData;
}

const HomeConversation: React.FC = () => {
    const appCtx = useContext(AppContext);
    const history = useHistory();
    const db = firebase.firestore();
    const [users, setUsers] = useState<oui>({});
    const [listGroups, setListGroups] = useState<Group[]>([]);
    const { t } = useTranslation('general');

    useEffect(() => {
        try {
            db.collection("Conversations").where("users", "array-contains", appCtx.userdata.uid)
                .onSnapshot(async (docs) => {
                    let listUsers: oui = {};
                    for(const doc of docs.docs) {

                        await db.collection('Users').doc(doc.data().users.filter((value: string) => { return value !== appCtx.user?.uid })[0]).get()
                            .then((res) => {
                                listUsers[doc.data().convId] = res.data()!;
                            });
                    }

                    setUsers(listUsers);
                })

            db.collection("Groups").where("users", "array-contains", appCtx.userdata.uid)
                .onSnapshot(async (res) => {
                    let lstGrp: Group[] = [];
                    for(const doc of res.docs) {
                        lstGrp.push(doc.data() as Group)
                    }

                    setListGroups(lstGrp);
                })
        } catch (error) {
            console.log("Error from HomeConversations.tsx : ", error);
        }
    //eslint-disable-next-line
    }, [])

    const handleConvRoute = (convId: string) => {
        history.push(ROUTE_CONVERSATION + convId)
    }

    const handleGroupRoute = (grpId: string) => {
        history.push(ROUTE_GROUP + grpId)
    }

    const convs = () => {
        let oui = [...appCtx.conversations, ...listGroups]
        let ttlList: Object[] = oui.sort((obj1, obj2) => {
            if (obj1.lastMessage.sendedAt > obj2.lastMessage.sendedAt) {
                return -1;
            }
        
            if (obj1.lastMessage.sendedAt < obj2.lastMessage.sendedAt) {
                return 1;
            }
        
            return 0;
        });

        if ( ttlList.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                        {t('Conv.letsStart')}
                    </IonLabel>
                </IonItem>
            )
        } else {
            return ttlList.map((truc, index) => {
                if (truc.hasOwnProperty("convId")) {
                    let conv = truc as Conversation;
                    let user = users[conv.convId];
                    // eslint-disable-next-line array-callback-return
                    if (user === undefined) return;

                    return (
                        <IonItemSliding key={index} onClick={() => handleConvRoute(conv.convId)}>
                            <IonItem routerLink={ROUTE_CONVERSATION}>
                                <IonAvatar slot="start">
                                <img alt='Profile' src={user.picture ? user.picture : defaultProfile} />
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{user.username}</h2>
                                    <p>{conv.lastMessage.message}</p>
                                </IonLabel>
                                <IonLabel>
                                    <em>{ fromDate(conv.lastMessage.sendedAt.seconds) }</em>
                                </IonLabel>
                                <IonNote slot="end" color="primary">{index}</IonNote>
                            </IonItem>
                        </IonItemSliding>
                    )
                } else {
                    let grp = truc as Group;

                    return (
                        <IonItemSliding key={index} onClick={() => handleGroupRoute(grp.groupId)}>
                            <IonItem routerLink={ROUTE_GROUP}>
                                <IonLabel>
                                    <h2>{grp.groupName}</h2>
                                    <p>{grp.lastMessage.message}</p>
                                </IonLabel>
                                <IonLabel>
                                    <em>{ grp.lastMessage.sendedAt ? fromDate(grp.lastMessage.sendedAt.seconds) : "No messages" }</em>
                                </IonLabel>
                                <IonNote slot="end" color="primary">{index}</IonNote>
                            </IonItem>
                        </IonItemSliding>
                    )
                }
            })
            // return appCtx.conversations.map((conv, index) => {
            //     let user = users[conv.convId];
            //     // eslint-disable-next-line array-callback-return
            //     if (user === undefined) return;

            //     return (
            //         <IonItemSliding key={index} onClick={() => handleRoute(conv.convId)}>
            //             <IonItem routerLink={ROUTE_CONVERSATION}>
            //                 <IonAvatar slot="start">
            //                 <img alt='Profile' src={user.picture ? user.picture : defaultProfile} />
            //                 </IonAvatar>
            //                 <IonLabel>
            //                     <h2>{user.username}</h2>
            //                     <p>{conv.lastMessage.message}</p>
            //                 </IonLabel>
            //                 <IonLabel>
            //                     <em>{ fromDate(conv.lastMessage.sendedAt.seconds) }</em>
            //                 </IonLabel>
            //                 <IonNote slot="end" color="primary">{index}</IonNote>
            //             </IonItem>
            //         </IonItemSliding>
            //     )
            // })
        }
    }

    return (
        <>
            <IonList>
                {
                    convs()
                }
            </IonList>
        </>
    )
}


export default HomeConversation