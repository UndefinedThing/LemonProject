import { IonAvatar, IonButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading } from '@ionic/react'
import firebase from '../../firebase';
import { closeOutline } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import defaultProfile from '../../assets/defaultProfile.jpg';
import AppContext from '../../data/app-context';
import { useTranslation } from 'react-i18next';

const MyPendingContactList: React.FC = () => {
    const appCtx = useContext(AppContext);
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [contactList, setContactList] = useState<firebase.firestore.DocumentData[]>([]);
    const { t } = useTranslation('general');

    useEffect(() => {
        setContactList([]);
        appCtx.contacts.myPendingList.forEach( async (user) => {
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
    }, [appCtx.contacts.myPendingList])

    const showMyPendingContactList = () => {
        if ( contactList.length === 0 ) {
            return (
                <IonItem>
                    <IonLabel>
                        {t('Contact.noRequest')} 
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
                        <IonButton onClick={() => appCtx.delPendingInvite(value.data().uid)} size="large" fill="clear" color='danger' >
                            <IonIcon size="large" slot='icon-only' icon={closeOutline} color='danger' />
                        </IonButton>
                    </IonItem>
                )
            })
        }
    }

    return (
        <>
            <IonList>
                <IonListHeader>
                    <IonLabel>{t('Contact.requestSent')}</IonLabel>
                </IonListHeader>
                {
                    showMyPendingContactList()
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

export default MyPendingContactList