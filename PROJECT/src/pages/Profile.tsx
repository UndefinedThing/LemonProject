import React, { Suspense, useContext } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner } from '@ionic/react';
import { exitOutline } from 'ionicons/icons';

import './Profile.scss';
import AppContext from '../data/app-context';
import UserInformationItem from '../components/UserInformation';

import Logout from '../components/Auth/Logout';
import ProfilePicture from '../components/ProfilePicture';

import { useTranslation } from 'react-i18next';
import SelectLanguage from '../components/SelectLanguage';

const Profile: React.FC = () => {
  const appCtx = useContext(AppContext);
  const userdata = appCtx.userdata;
  const { t } = useTranslation('profile');

  return (
    <IonPage id="User">
      <IonContent>
        <IonGrid>
          <IonRow id="headerRow" className="ion-justify-content-around ion-align-items-center">
            <Suspense fallback={<IonSpinner />}>
              <ProfilePicture />
            </Suspense>
          </IonRow>
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeLg='7'>
              <IonList mode="ios">
                <IonListHeader>
                  <IonLabel>
                  {t('your-profile')}
                  </IonLabel>
                </IonListHeader>
                <UserInformationItem userdata={userdata.username} field='username' friendlyName={t('pseudo')} unit='' type='text' />
                <UserInformationItem userdata={userdata.name} field='name' friendlyName={t('name')} unit='' type='text' />
                <UserInformationItem userdata={userdata.lastname} field='lastname' friendlyName={t('lastName')} unit='' type='text' />
                <UserInformationItem userdata={userdata.description} field='description' friendlyName={t('description')} unit='' type='textarea' />
                <SelectLanguage />
              </IonList>
            </IonCol>
          </IonRow>
          {/* <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeLg='7'>
              <IonList mode="ios">
                <IonListHeader>
                  <IonLabel>
                    Informations
                  </IonLabel>
                </IonListHeader>
                <UserUtilisationInformation userdata={userdata.username} field='username' friendlyName='Nombres de contact' unit='' type='text' />
                <UserUtilisationInformation userdata={userdata.name} field='name' friendlyName='Nombres de messages envoyées' unit='' type='text' />
                <UserUtilisationInformation userdata={userdata.lastname} field='lastname' friendlyName='Lastname' unit='' type='text' />
                <UserUtilisationInformation userdata={userdata.description} field='description' friendlyName='Description' unit='' type='textarea' />
              </IonList>
            </IonCol>
          </IonRow> */}
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeLg='7'>
                <Logout>
                  <IonButton expand="full" color="danger">
                    <IonLabel>{t('logout')}</IonLabel>
                    <IonIcon slot='end' icon={ exitOutline }/>
                  </IonButton>
                </Logout>
            </IonCol>
          </IonRow>
                
        </IonGrid>
      </IonContent>       
    </IonPage>
  );
};

export default Profile;