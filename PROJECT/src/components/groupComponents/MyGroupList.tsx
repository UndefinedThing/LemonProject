import { IonAvatar, IonButton, IonItem, IonItemSliding, IonLabel, IonList, IonListHeader, IonTitle } from '@ionic/react'
import firebase from '../../firebase';
import React, { useContext, useEffect, useState } from 'react';
import AppContext, { Group } from '../../data/app-context';
import { ROUTE_GROUP } from '../../nav/Routes';
import defaultProfile from '../../assets/defaultProfile.jpg';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';


const MyGroupList: React.FC = () => {
    const appCtx = useContext(AppContext);
    const history = useHistory();
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const { t } = useTranslation('general');
    
    useEffect(() => {
		firebase.firestore().collection("Groups").where("users", "array-contains", appCtx.userdata.uid)
			.onSnapshot( async (snapshot) => {
				let myList: Group[] = [];

				snapshot.docs.forEach((someGroup) => {
					if (someGroup.data().creatorId === appCtx.userdata.uid) {
						myList.push(someGroup.data() as Group);
					}
				});

				setMyGroups(myList);
			})
	//eslint-disable-next-line
    }, []);
    
    const fillMyList = () => {
		if (myGroups.length === 0) {
			return (
				<IonItem>
					<IonLabel>
						{t('Group.notCreate')}
					</IonLabel>
				</IonItem>
			)
		} else {
			return myGroups.map((grp, index) => {
                return (
                        <IonItem key={index}>
                            <IonAvatar slot="start">
                                <img alt='Profile' src={defaultProfile} />
                            </IonAvatar>
                            <IonLabel>
                                <h2>{grp.groupName}</h2>
                                <p>{grp.users.length} participant</p>
                            </IonLabel>
                            <IonButton color="danger" size="default" onClick={() => {
                                appCtx.deleteGroup(grp.groupId)
                            }}>{t('Group.delete')}</IonButton>
                        </IonItem>
                )
            })
		}
	}

    return (
        <IonList>
            <IonListHeader>
                <IonLabel>{t('Group.iCreate')}</IonLabel>
            </IonListHeader>
            {
                fillMyList()
            }
        </IonList>
    )
}

export default MyGroupList