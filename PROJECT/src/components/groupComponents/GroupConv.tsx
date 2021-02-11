import firebase from '../../firebase';
import React, { useContext, useEffect, useState } from 'react';
import AppContext, { Group, Message } from '../../data/app-context';
import { IonButton, IonContent, IonFooter, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPopover, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { ellipsisHorizontalSharp, sendSharp } from 'ionicons/icons';
import GroupInformationItem from './GroupInformation';
import { useTranslation } from 'react-i18next';

interface oui {
    [key: string]: firebase.firestore.DocumentData;
}

const GroupConv: React.FC<{id: string}> = (props) => {
    const appCtx = useContext(AppContext);
	const db = firebase.firestore();
	const [loading, setLoading] = useState<boolean>(true);
	const [group, setGroup] = useState<Group>( appCtx.groups.filter((value) => { return value.groupId === props.id })[0] as Group );
	const [messageValue, setMessageValue] = useState<string>("");
	const [users, setUsers] = useState<oui>({});
	const [messages, setMessages] = useState<Message[]>([]);
	const { t } = useTranslation('general');

	const [showPopover, setShowPopover] = useState(false);

	useEffect(() => {
		setLoading(true);

		db.collection("Groups").doc(props.id).get()
			.then( async (res) => {
				// SET GROUP DATA
				setGroup(res.data() as Group);

				// SETUP OTHER USERS DATA
				let listUsers: oui = {};
                for(const doc of res.data()?.users) {
                    await db.collection('Users').doc(doc).get()
                        .then((res) => {
                            listUsers[doc] = res.data()!;
                        });
                }

                setUsers(listUsers);

				db.collection('Messages').where("convId", "==", props.id).orderBy("sendedAt", "asc")
                    .onSnapshot(function (querySnapshot) {
                        let listMessages: Message[] = [];
                        querySnapshot.forEach(function (doc) {
                            listMessages.push(doc.data() as Message);
                        });
                        setMessages(listMessages);
                    });
			})

		setLoading(false);
	//eslint-disable-next-line
	}, [props.id, group.users])

	const loadMessages = () => {
		if ( messages.length === 0 ) {
			return (
				<IonItem>
					{t('Group.noMessage')}
				</IonItem>
			)
		} else {
			return messages.map((msg: Message, index) => {
                if (msg.senderId === appCtx.userdata.uid) {
                    return (
                        <IonItem key={index}>
                            <IonLabel slot='end' className='ion-text-right' color='primary'>
                                {msg.message}
                            </IonLabel>
                        </IonItem>
                    )
                } else if ( msg.senderId === "system") {
                    return (
                        <IonItem key={index}>
                            <IonLabel slot="center" className="ion-text-justify" color="danger">
                                {msg.message}
                            </IonLabel>
                        </IonItem>
                    )
                } else {
                    const usr = users[msg.senderId]
                    return (
                        <IonItem key={index}>
                            <IonLabel slot='start' className='ion-text-left' color='black'>
                                {usr.username} : {msg.message}
                            </IonLabel>
                        </IonItem>
                    )
                }
			})
		}
	}

	const fillMenu = () => {
		if (group.creatorId === appCtx.userdata.uid) {
			return (
				<>
					<GroupInformationItem action={"addUser"} text={"Ajouter un membre"} group={group} />
					<GroupInformationItem action={"remUser"} text={"Retirer un membre"} group={group} />
					<GroupInformationItem action={"eleUser"} text={"Élever un membre"} group={group} />
					<GroupInformationItem action={"retUser"} text={"Rétrograder un membre"} group={group} />
					<GroupInformationItem action={"delConv"} text={"Supprimer"} group={group} />
				</>
			)
		} else if (group.adminUsers.includes(appCtx.userdata.uid)) {
			return (
				<>
					<GroupInformationItem action={"addUser"} text={"Ajouter un membre"} group={group} />
					<GroupInformationItem action={"remUser"} text={"Retirer un membre"} group={group} />
					<GroupInformationItem action={"quitCon"} text={"Quitter la conversation"} group={group} />
				</>
			)
		} else {
			return (
				<>
					<GroupInformationItem action={"quitCon"} text={"Quitter la conversation"} group={group} />
				</>
			)
		}
	}

	const handleSendMessage = (groupId: string, message: string) => {
		appCtx.groupSendMessage(groupId, message.trim());
		setMessageValue('');
	}

	return (
		<>
			<IonPopover
				isOpen={showPopover}
				cssClass='my-custom-class'
				onDidDismiss={e => setShowPopover(false)}
			>
				<IonList>
					{
						fillMenu()
					}
				</IonList>
			</IonPopover>
			<IonLoading
				isOpen={loading}
				message="Loading your messages"
			/>
			<IonToolbar className="ion-text-center ion-toolbar-transparent ion-padding">
				<IonTitle>
					{group.groupName}
				</IonTitle>
				<IonButton slot='end' onClick={() => setShowPopover(true)}>
					<IonIcon slot="icon-only" icon={ellipsisHorizontalSharp} />
				</IonButton>
			</IonToolbar>
			<IonContent>
				<IonList className="ion-no-border ion-margin reorder-list-active">
					{
						loadMessages()
					}
				</IonList>
			</IonContent>
			<IonFooter id='custFooter' className='ion-padding' style={{"backgroundColor":"var(--ion-color-primary)"}}>
				<form>
					<IonItem>
						<IonLabel>Message : </IonLabel>
						<IonInput placeholder="Enter a gentle message" value={messageValue} onIonChange={(e) => setMessageValue(e.detail.value!)} />
					</IonItem>
					<IonItem>
						<IonButton disabled={!(messageValue.trim().length > 1)} onClick={() => handleSendMessage(group.groupId, messageValue)} size="large" fill="clear">
							<IonIcon slot="icon-only" icon={sendSharp} />
						</IonButton>
					</IonItem>
				</form>
			</IonFooter>
		</>
	);
}

export default GroupConv