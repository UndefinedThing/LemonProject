import { IonAlert, IonAvatar, IonButton, IonCheckbox, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import AppContext, { Group } from '../../data/app-context';
import firebase from "../../firebase";
import defaultProfile from '../../assets/defaultProfile.jpg';
import { useTranslation } from 'react-i18next';

interface oui {
    [key: string]: firebase.firestore.DocumentData;
}

const GroupInformationItem: React.FC<{action: string, text: string, group: Group}> = (props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const appCtx = useContext(AppContext);
    const [contacts, setContacts] = useState<string[]>([]);
    const [contact, setContact] = useState<string>("");
    const [contactList, setContactList] = useState<firebase.firestore.DocumentData[]>([]);
    const [groupUsers, setGroupUsers] = useState<firebase.firestore.DocumentData[]>([]);

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const { t } = useTranslation('general');

    useEffect(() => {
        setContactList([]);
        appCtx.contacts.contactList.forEach( async (user) => {
            await firebase.firestore().collection("Users").doc(user).get()
                .then((res) => {
                    setContactList((prevState) => {
                        let newList = [...prevState];
                        newList.push(res);
                        return newList;
                    })
                })
        });

        let list: firebase.firestore.DocumentData[] = [];
        props.group.users.forEach( async (usr) => {
            await firebase.firestore().collection("Users").doc(usr).get()
                .then((res) => {
                    list.push(res)
                })
        })
        setGroupUsers(list);
    // eslint-disable-next-line
    }, [appCtx.contacts.contactList])

    const handleCheckBoxes = (id: string) => {
        contacts.includes(id) ?
            setContacts(contacts.filter((val) => { return val !== id })) :
            setContacts((prevState) => {
                prevState.push(id);
                return prevState;
            });
    }

    const fillContacts = () => {
        if ( contactList.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                        {t('Contact.noContact')}
                    </IonLabel>
                </IonItem>
            )
        } else {
            return contactList.map( (value) => {
                return (
                    <IonItem key={value.data().uid}>
                        <IonAvatar slot="start">
                            <img alt='Profile' src={value.data()?.picture ? value.data()?.picture : defaultProfile} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{value.data()?.username}</h2>
                            <p>{value.data()?.email}</p>
                        </IonLabel>
                        <IonCheckbox disabled={props.group.users.includes(value.data().uid)} checked={contacts.includes(value.data().uid)} value={value.data().uid} onIonChange={(e) => handleCheckBoxes(e.detail.value)} />
                    </IonItem>
                )
            })
        }
    }

    const fillGroupUsers = () => {
        if ( groupUsers.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                    {t('Contact.noContact')}
                    </IonLabel>
                </IonItem>
            )
        } else {
            return groupUsers.map( (value) => {
                return (
                    <IonItem key={value.data().uid}>
                        <IonAvatar slot="start">
                            <img alt='Profile' src={value.data()?.picture ? value.data()?.picture : defaultProfile} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{value.data()?.username}</h2>
                            <p>{value.data()?.email}</p>
                        </IonLabel>
                        <IonCheckbox disabled={props.group.creatorId === value.data().uid} checked={contacts.includes(value.data().uid)} value={value.data().uid} onIonChange={(e) => handleCheckBoxes(e.detail.value)} />
                    </IonItem>
                )
            })
        }
    }

    const fillToPromot = () => {
        if ( groupUsers.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                    {t('Contact.noContact')}
                    </IonLabel>
                </IonItem>
            )
        } else {
            return groupUsers.map( (value) => {
                return (
                    <IonItem key={value.data().uid}>
                        <IonAvatar slot="start">
                            <img alt='Profile' src={value.data()?.picture ? value.data()?.picture : defaultProfile} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{value.data()?.username}</h2>
                            <p>{value.data()?.email}</p>
                        </IonLabel>
                        <IonRadio disabled={props.group.creatorId === value.data().uid} value={value.data().uid} />
                    </IonItem>
                )
            })
        }
    }

    const handleAddToGroup = () => {
        if (contacts.length >= 1) {
            appCtx.addUsers(props.group.groupId, contacts);
            setTimeout(() => {
                setContacts([]);
                setShowAlert(false);
                setAlertMessage("");
                setShowModal(false);
            }, 1000)
        } else {
            setAlertMessage("Please select at least 1 user");
            setShowAlert(false);
        }
    }

    const handleRemoveFromGroup = () => {
        if (contacts.length >= 1) {
            appCtx.removeUsers(props.group.groupId, contacts);
            setTimeout(() => {
                setContacts([]);
                setShowAlert(false);
                setAlertMessage("");
                setShowModal(false);
            }, 1000)
        } else {
            setAlertMessage("Please select at least 1 user");
            setShowAlert(false);
        }
    }

    const handlePromot = () => {
        if (contacts.length >= 1) {
            appCtx.promotAdmin(props.group.groupId, contact);
            setTimeout(() => {
                setContacts([]);
                setShowAlert(false);
                setAlertMessage("");
                setShowModal(false);
            }, 1000)
        } else {
            setAlertMessage("Please select someone");
            setShowAlert(false);
        }
    }

    const handleDemote = () => {
        if (contacts.length >= 1) {
            appCtx.demoteAdmin(props.group.groupId, contact);
            setTimeout(() => {
                setContacts([]);
                setShowAlert(false);
                setAlertMessage("");
                setShowModal(false);
            }, 1000)
        } else {
            setAlertMessage("Please select someone");
            setShowAlert(false);
        }
    }

    const whatToDisplay = () => {
        switch (props.action) {
            case "addUser":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                <IonTitle>{t('Group.addUser')}</IonTitle>
                                <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                    setShowModal(false)
                                }}>{t('Conv.return')}</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonList>
                                {
                                    fillContacts()
                                }
                            </IonList>
                        </IonContent>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                            <IonFabButton color="success" onClick={() => handleAddToGroup()}>Ajouter</IonFabButton>
                        </IonFab>
                    </IonModal>
                )
            case "remUser":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                    <IonTitle>{t('Group.removeUser')}</IonTitle>
                                    <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                        setShowModal(false)
                                    }}>{t('Conv.return')}</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            {
                                fillGroupUsers()
                            }
                        </IonContent>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                                <IonFabButton color="danger" onClick={() => handleRemoveFromGroup()}>{t('Group.remove')}</IonFabButton>
                            </IonFab>
                        </IonModal>
                )
            case "eleUser":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                    <IonTitle>{t('Group.elevateUser')}</IonTitle>
                                    <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                        setShowModal(false)
                                    }}>{t('Conv.return')}</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonRadioGroup onIonChange={(e) => setContact(e.detail.value)}>
                                {
                                    fillToPromot()
                                }
                            </IonRadioGroup>
                        </IonContent>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                            <IonFabButton color="success" onClick={() => handlePromot()}>Promot</IonFabButton>
                        </IonFab>
                    </IonModal>
                )
            case "retUser":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                    <IonTitle>{t('Group.retrogadeUser')}</IonTitle>
                                    <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                        setShowModal(false)
                                    }}>{t('Conv.return')}</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonRadioGroup onIonChange={(e) => setContact(e.detail.value)}>
                                {
                                    fillToPromot()
                                }
                            </IonRadioGroup>
                        </IonContent>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                            <IonFabButton color="warning" onClick={() => handleDemote()}>{t('demote')}</IonFabButton>
                        </IonFab>
                    </IonModal>
                )
            case "delConv":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                    <IonTitle>{t('Group.deleteGroup')}</IonTitle>
                                    <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                        setShowModal(false)
                                    }}>{t('Conv.return')}</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                            <IonFabButton color="danger" onClick={() => appCtx.deleteGroup(props.group.groupId)}>Supprimer la conversation</IonFabButton>
                        </IonFab>
                    </IonModal>
                )
            case "quitCon":
                return (
                    <IonModal
                        isOpen={showModal}
                        onDidDismiss={() => {setShowModal(false)}}
                    >
                        <IonHeader translucent>
                            <IonToolbar>
                                    <IonTitle>{t('Group.quitGroup')}</IonTitle>
                                    <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                        setShowModal(false)
                                    }}>Retour</IonButton>
                            </IonToolbar>
                        </IonHeader>
                        <IonFab vertical="bottom" slot="fixed" horizontal="center">
                            <IonFabButton color="danger" onClick={() => appCtx.quitGroup(props.group.groupId)}>{t('Conv.quitConv')}</IonFabButton>
                        </IonFab>
                    </IonModal>
                )
        }
    }

    return (
        <IonItem onClick={() => {setShowModal(true)}}>
            <IonLabel>
                {props.text}
            </IonLabel>
            {
                whatToDisplay()
            }
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => {setShowAlert(false); setAlertMessage("")}}
                header="Something went wrong : "
                backdropDismiss={false}
                message={alertMessage}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Ok',
                        cssClass: 'primary',
                        handler: () => {
                            setShowAlert(false);
                        }
                    }
                ]}
            />
        </IonItem>
    )
}

export default GroupInformationItem