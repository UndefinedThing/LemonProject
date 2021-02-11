import firebase from '../firebase';
import React, { useContext, useEffect, useState } from 'react';
import AppContext, { Conversation, defaultUserData, Message, UserData } from '../data/app-context';
import { IonButton, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRow, IonTitle } from '@ionic/react';
import { arrowDownCircle, sendSharp } from 'ionicons/icons';
import './ConversationDisp.scss'
import { useTranslation } from 'react-i18next';

const ConversationDisp: React.FC<{id: string}> = (props) => {
    const appCtx = useContext(AppContext);
	const db = firebase.firestore();
	const [loading, setLoading] = useState<boolean>(true);
	const [conv, setConv] = useState<Conversation>( appCtx.conversations.filter((value) => { return value.convId === props.id })[0] as Conversation );
	const [messageValue, setMessageValue] = useState<string>("");
	const [alterUser, setAlterUser] = useState<UserData>(defaultUserData);
	const [messages, setMessages] = useState<Message[]>([]);

	const { t } = useTranslation('general');

	function computedate(msg: Message) {
		let messagedate = msg.sendedAt.toDate()
		let month = messagedate.getMonth()
		let day = messagedate.getDate()
		let hours = messagedate.getHours()
		let minutes =messagedate.getMinutes()
		return day + "/" + month + " " + hours + ":" + minutes
	}
	useEffect(() => {
		setLoading(true);
		
		try {
			db.collection("Conversations").doc(props.id).get()
			.then( async (res) => {
				// SET CONV DATA
				setConv(res.data() as Conversation);

				// SETUP OTHER USER DATA
				db.collection("Users").doc(res.data()?.users.filter((value:string) => { return value !== appCtx.userdata.uid })[0])
					.onSnapshot((res) => {
						setAlterUser(res.data() as UserData);
					})

				db.collection('Messages').where("convId", "==", props.id).orderBy("sendedAt", "asc")
                    .onSnapshot(function (querySnapshot) {
                        let listMessages: Message[] = [];
                        querySnapshot.forEach(function (doc) {
                            listMessages.push(doc.data() as Message);
                        });
                        setMessages(listMessages);
                    });
			})
		} catch (error) {
			console.log("Error from ConversationDisp : ", error)
		}

		setLoading(false);
	//eslint-disable-next-line
	}, [props.id])

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
						<IonRow key={index} class="ion-justify-content-end">
							<IonCol className="ion-text-start" size="6" id="date"><p>{msg.sendedAt ? computedate(msg) : ""}</p></IonCol>

							<IonCol size="6" className='ion-align-self-end ion-text-end' color='primary'>
								<IonItem id="message" color="primary">{msg.message}</IonItem>
							</IonCol>
						</IonRow>
                    )
                } else if ( msg.senderId === "system") {
                    return (
							<IonRow key={index}>
							<IonCol slot='center' className='ion-text-justify' color='warning'>
							{msg.message}
							</IonCol>
						</IonRow>
                    )
                } else {
                    return (
							<IonRow key={index}>
								<IonCol size="6" className='ion-text-start' color='black'>
								  <IonItem id="message" color="secondary">{msg.message}</IonItem>
								</IonCol>
								<IonCol className="ion-text-end" size="6" id="date"><p>{msg.sendedAt ? computedate(msg) : ""}</p></IonCol>
							</IonRow>
                    )
                }
			})
		}
	}

	const handleSendMessage = (convId: string, message: string) => {
		appCtx.sendMessage(convId, message.trim());
		setMessageValue('');
	}
	function scrollToBottom() {
		let list = document.querySelector("ion-content");
		return list && list.scrollToBottom();
	};
	return (
		<>
			<IonLoading
				isOpen={loading}
				message="Loading your messages"
			/>
			<IonFab vertical="center" horizontal="end" slot="fixed">
          		<IonFabButton size="small" onClick={() => scrollToBottom()}>
            		<IonIcon icon={arrowDownCircle} />
          		</IonFabButton>
        	</IonFab>
			<IonHeader translucent className="ion-text-center ion-toolbar-transparent ion-padding">
				<IonTitle>
					{alterUser.username}
				</IonTitle>
			</IonHeader>
			<IonContent>
				<IonList className="ion-no-border ion-margin reorder-list-active">
					<IonGrid>
					{loadMessages()}
					</IonGrid>
				</IonList>
			</IonContent>
			<IonFooter id='custFooter' className='ion-padding' style={{"backgroundColor":"var(--ion-color-primary)"}}>
				<form>
					<IonItem>
						<IonLabel>Message : </IonLabel>
						<IonInput placeholder={t('Conv.enterMessage')} value={messageValue} onIonChange={(e) => setMessageValue(e.detail.value!)} />
					</IonItem>
					<IonItem>
						<IonButton disabled={!(messageValue.trim().length > 1)} onClick={() => handleSendMessage(conv.convId, messageValue)} size="large" fill="clear">
							<IonIcon slot="icon-only" icon={sendSharp} />
						</IonButton>
					</IonItem>
				</form>
			</IonFooter>
		</>
	);
}

export default ConversationDisp