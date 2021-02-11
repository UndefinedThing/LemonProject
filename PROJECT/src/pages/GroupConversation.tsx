import { IonAlert, IonPage } from '@ionic/react';
import firebase from '../firebase';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import AppContext from '../data/app-context';
import { ROUTE_HOME } from '../nav/Routes';
import GroupConv from '../components/groupComponents/GroupConv';

const GroupComp: React.FC = () => {
	const appCtx = useContext(AppContext);
	const history = useHistory();
	const { id } = useParams<{id: string}>();
	const db = firebase.firestore();
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertText, setAlertText] = useState<string>("");

	useEffect(() => {
		try {
			db.collection('Groups').doc(id).get()
				.then((res) => {
					if (!res.data()?.users.includes(appCtx.userdata.uid)) {
						setAlertText("Not part of the group");
						setShowAlert(true);
					}
				}).catch(() => {
					setAlertText("Wrong id :'(");
					setShowAlert(true);
				})
		} catch (e) {
			console.log(e);
		}
	//eslint-disable-next-line
	}, [ id ]);

	if (showAlert) {
		return (
			<IonPage>
				<IonAlert
					isOpen={showAlert}
					onDidDismiss={() => {setShowAlert(false); history.goBack()}}
					header={'Alert'}
					message={alertText}
					buttons={[
						{
							text: 'Home',
							handler: () => {
								setShowAlert(false);
								history.push(ROUTE_HOME);
							}
						},
						{
							text: 'Ok',
							handler: () => {
								setShowAlert(false);
								history.goBack();
							}
						}
					]}
				/>
			</IonPage>
		)
	} else {
		return (
			<IonPage>
				<GroupConv id={ id } />
			</IonPage>
		)
	}
};

export default GroupComp;
