import { IonAlert, IonAvatar, IonButton, IonCheckbox, IonContent, IonFab, IonFabButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../data/app-context';
import defaultProfile from '../../assets/defaultProfile.jpg';
import firebase from '../../firebase';
import { useTranslation } from 'react-i18next';

const GroupModal: React.FC<{ showModal: boolean, setShowModal: (value: boolean) => void }> = (props) => {
    const appCtx = useContext(AppContext);

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const [searchData, setSearchData] = useState<firebase.firestore.DocumentData[]>([]);
    const [contacts, setContacts] = useState<string[]>([]);
    const [messageValue, setMessageValue] = useState<string>("");
    const [groupName, setGroupName] = useState<string>("");
    const { t } = useTranslation('general');

    const placeholderFirstMessage = "Un grand merci à " + appCtx.userdata.username + " pour avoir créée le groupe !"

    useEffect(() => {
        if (!appCtx.userdata.contact) {
            setSearchData([]);
            return;
        }
        firebase.firestore().collection("Contacts").doc(appCtx.userdata.contact)
            .onSnapshot((res) => {
                let contactList: [] = res.data()?.contactList;
                let resList: firebase.firestore.DocumentData[] = [];
                contactList.forEach( async (contact) => {
                    await firebase.firestore().collection('Users').doc(contact).get()
                        .then((res2) => {
                            resList.push(res2);
                        })
                })

                setSearchData(resList);
            })
    //eslint-disable-next-line
    }, [appCtx.contacts])

    const handleCheckBoxes = (id: string) => {
        contacts.includes(id) ?
            setContacts(contacts.filter((val) => { return val !== id })) :
            setContacts((prevState) => {
                prevState.push(id);
                return prevState;
            });
    }

    const handleCreateGroup = () => {
        try {
            if ( contacts.length > 1 ) {
                appCtx.createGroup(appCtx.user!.uid, contacts, groupName, messageValue ? messageValue : placeholderFirstMessage);
                setTimeout(() => {
                    setContacts([]);
                    setMessageValue('');
                    setGroupName('');
                    props.setShowModal(false);
                }, 2000)
            } else if (contacts.length === 1) {
                setAlertMessage("You should start a conversation, not a group :)");
                setShowAlert(true);
            } else {
                setAlertMessage("Please, select friends to create a group");
                setShowAlert(true);
            }
        } catch (error) {
            console.log("Error in start conversation : ", error);
        }
    }

    const fillResults = () => {
        if ( searchData.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                        {t('Conv.noResult')}
                    </IonLabel>
                </IonItem>
            )
        } else {
            return searchData.map((value) => (
                <IonItem key={value.data().uid}>
                    <IonAvatar slot="start">
                        <img alt='Profile' src={value.data()?.picture ? value.data()?.picture : defaultProfile} />
                    </IonAvatar>
                    <IonLabel>
                        <h2>
                            {
                                appCtx.user!.uid === value.data().uid ? value.data()?.username + ' (Moi)' : value.data()?.username
                            }
                        </h2>
                        <p>{value.data()?.email}</p>
                    </IonLabel>
                    
                    <IonCheckbox checked={contacts.includes(value.data().uid)} value={value.data().uid} onIonChange={(e) => handleCheckBoxes(e.detail.value)} />
                </IonItem>
            ))
        }
    }

    return (
        <>
            <IonModal isOpen={props.showModal} backdropDismiss={false}>
                <form>
                    <IonHeader translucent>
                        <IonToolbar>
                                <IonTitle>{t('Group.creation')}</IonTitle>
                                <IonButton slot="end" type="reset" fill="clear" onClick={() => {
                                    props.setShowModal(false)
                                }}>{t('Conv.return')}</IonButton>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent fullscreen>
                        <IonList>
                            <IonItem>
                                <IonLabel><h2>{t('Group.name')}</h2></IonLabel>
                                <IonInput placeholder="Nom du groupe" value={groupName} onIonChange={(e) => setGroupName(e.detail.value!)} />
                                <IonLabel position="stacked"><h2>{t('Group.firstMessage')}</h2></IonLabel>
                                <IonTextarea value={messageValue} defaultValue={placeholderFirstMessage} placeholder={placeholderFirstMessage} onIonChange={(e) => setMessageValue(e.detail.value!)}></IonTextarea>
                            </IonItem>
                        </IonList>
                        <IonList>
                            <IonListHeader>{t('Group.addMember')}</IonListHeader>
                            {
                                fillResults()
                            }
                        </IonList>
                    </IonContent>
                    <IonFab vertical="bottom" slot="fixed" horizontal="center">
                        <IonFabButton color="success" onClick={() => handleCreateGroup()}>Créer</IonFabButton>
                    </IonFab>
                </form>
            </IonModal>
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
        </>
    );
};

export default GroupModal