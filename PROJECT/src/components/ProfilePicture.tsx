import { IonCol, IonFabButton, IonIcon } from '@ionic/react';
import React, { useContext, useState } from 'react';
import defaultProfile from '../assets/defaultProfile.jpg';
import { pencilOutline } from 'ionicons/icons';

import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import AppContext from '../data/app-context';

import firebase from '../firebase';

const { Camera } = Plugins;

const ProfilePicture: React.FC = () => {
    const appCtx = useContext(AppContext);
    const [uploading, setUploading] = useState<boolean>(false);

    const updatePicture = () => {
        const storage = firebase.storage();
        const storageRef = storage.ref();

        if (!appCtx.user || !appCtx.user.uid) return

        storageRef.child(appCtx.user.uid + '.jpeg').getDownloadURL()
            .then((url) => {
                appCtx.updateOneFieldUserData(appCtx.user, 'picture', url)
            });
    }

    const takePhotoHandler = async () => {
        const photo = await Camera.getPhoto({
            quality: 80,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt,
            width: 500,
        });

        if (!photo || !photo.base64String || !appCtx.user || !appCtx.user.uid) return

        setUploading(true);
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(appCtx.user.uid + '.jpeg');

        const uploadTask = await imageRef.putString(photo.base64String, 'base64');

        console.log(uploadTask)
        updatePicture();
        
        setUploading(false);
    }
    return (
        <IonCol size="6" sizeSm="5" sizeMd="3" sizeLg="2" className="ion-text-center ion-padding">
            <div className="profile-picture" style={{ backgroundImage: `url(${appCtx.userdata.picture !== "" && !uploading ? appCtx.userdata.picture : defaultProfile})` }} />
            <IonFabButton disabled={uploading} style={{ position: 'absolute', top: "15px", right: "0" }} color="danger" onClick={takePhotoHandler}>
                <IonIcon icon={pencilOutline} />
            </IonFabButton>
        </IonCol>
    )
}

export default ProfilePicture