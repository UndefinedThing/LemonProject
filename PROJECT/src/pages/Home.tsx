import { IonContent, IonFab, IonFabButton, IonIcon, IonLoading, IonPage } from '@ionic/react';
import React, { useContext, useState } from 'react';
import './Home.css';
import HomeConversation from '../components/HomeConversation';
import { add } from 'ionicons/icons';
import StartConversation from '../components/StartConversation';
import AppContext from '../data/app-context';


const Home: React.FC = () => {
	const appCtx = useContext(AppContext);
	const [ showLoading, setShowLoading ] = useState<boolean>(true);
	const [ showModal, setShowModal ] = useState(false);

	return (
		<>
			<IonLoading
				isOpen={showLoading}
				onDidDismiss={() => setShowLoading(false)}
				backdropDismiss={false}
				spinner={"crescent"}
                message={"Please wait ..."}
                duration={2000}
			/>
			<IonPage>
				<IonContent>
					<HomeConversation />
					<IonFab vertical={appCtx.conversations.length > 0 ? "bottom" : "center"} horizontal={appCtx.conversations.length > 0 ? "end" : "center"} slot="fixed">
						<IonFabButton onClick={() => setShowModal(true)}>
							<IonIcon icon={add} />
          				</IonFabButton>
        			</IonFab>
					<StartConversation showModal={showModal} setShowModal={setShowModal}/>
				</IonContent>
			</IonPage>
		</>
	);
};

export default Home;
