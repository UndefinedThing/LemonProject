import { IonAvatar, IonButton, IonItem, IonLabel, IonList, IonListHeader, IonLoading } from '@ionic/react'
import firebase from '../../firebase';
import React, { useContext, useEffect, useState } from 'react';
import defaultProfile from '../../assets/defaultProfile.jpg';
import AppContext from '../../data/app-context';
import ContactAddUserModal from './ContactAddUserModal';
import { useTranslation } from 'react-i18next';

const ContactList: React.FC = () => {
    const appCtx = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [contactList, setContactList] = useState<firebase.firestore.DocumentData[]>([]);

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
    // eslint-disable-next-line
    }, [appCtx.contacts.contactList])

    const showContactList = () => {
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
                        <IonButton color="danger" size="default" onClick={() => {
                            setShowLoading(true);
                            appCtx.removeContact(value.data()?.uid)
                        }}>{t('Group.delete')}</IonButton>
                    </IonItem>
                )
            })
        }
    }

    return (
        <>
            <ContactAddUserModal showModal={showModal} setShowModal={setShowModal}/>
            <IonList>
                <IonListHeader >
                    <IonLabel>Liste des contact(s)</IonLabel>
                </IonListHeader>
                {
                    showContactList()
                }
            </IonList>
            <IonLoading
                isOpen={showLoading}
                onDidDismiss={() => setShowLoading(false)}
                message={'Please wait...'}
                duration={500}
            />
        </>
    )
}

export default ContactList