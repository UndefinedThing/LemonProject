import { IonAvatar, IonButton, IonItem, IonItemSliding, IonLabel, IonList, IonListHeader, IonTitle } from '@ionic/react'
import firebase from '../../firebase';
import React, { useContext, useEffect, useState } from 'react';
import AppContext, { Group } from '../../data/app-context';
import { ROUTE_GROUP } from '../../nav/Routes';
import { useHistory } from 'react-router';
import defaultProfile from '../../assets/defaultProfile.jpg';
import { useTranslation } from 'react-i18next';


const OtGroupList: React.FC = () => {
	const appCtx = useContext(AppContext);
	const history = useHistory();
    const [otGroups, setOtGroups] = useState<Group[]>([]);
    const { t } = useTranslation('general');
    
    useEffect(() => {
		firebase.firestore().collection("Groups").where("users", "array-contains", appCtx.userdata.uid)
			.onSnapshot( async (snapshot) => {
				let myList: Group[] = [];

				snapshot.docs.forEach((someGroup) => {
					if (someGroup.data().creatorId !== appCtx.userdata.uid) {
						myList.push(someGroup.data() as Group);
					}
				});

				setOtGroups(myList);
			})
	//eslint-disable-next-line
    }, []);

    const fillOtList = () => {
		if (otGroups.length === 0) {
			return (
				<IonItem>
					<IonLabel>
						{t('Group.noGroupAdded')}
					</IonLabel>
				</IonItem>
			)
		} else {
			return otGroups.map((grp, index) => {
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
                                appCtx.quitGroup(grp.groupId)
                            }}>{t('Group.quit')}</IonButton>
                        </IonItem>
                )
            })
		}
	}

    return (
        <IonList>
                <IonListHeader >
                    <IonLabel>{t('Group.list')}</IonLabel>
                </IonListHeader>
            {
                fillOtList()
            }
        </IonList>
    )
}

export default OtGroupList