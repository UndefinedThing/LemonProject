import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useState } from 'react';
import ContactAddUserModal from '../components/contactComponents/ContactAddUserModal';
import ContactList from '../components/contactComponents/ContactList';
import MyPendingContactList from '../components/contactComponents/MyPendingContactList';
import OtPendingContactList from '../components/contactComponents/OtPendingContactList';

const Contact: React.FC = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<IonPage>
			<IonContent>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
          			<IonFabButton onClick={() => setShowModal(true)}>
            			<IonIcon icon={add} />
          			</IonFabButton>
        		</IonFab>
				<ContactAddUserModal showModal={showModal} setShowModal={setShowModal}/>
				<IonGrid>
					<IonRow class="ion-justify-content-center">
						<IonCol size="12" sizeLg='7'>
							<OtPendingContactList />
						</IonCol>
					</IonRow>
					<IonRow class="ion-justify-content-center">
						<IonCol size="12" sizeLg='7'>
							<MyPendingContactList />
						</IonCol>
					</IonRow>
					<IonRow class="ion-justify-content-center">
						<IonCol size="12" sizeLg='7'>
							<ContactList />
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Contact;
	

