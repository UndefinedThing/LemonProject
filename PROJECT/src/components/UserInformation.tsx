import { IonAlert, IonItem, IonLabel } from '@ionic/react';
import React, { useContext, useState } from 'react';
import AppContext, { UserInformationFields } from '../data/app-context';
import "firebase/firestore";

const UserInformationItem: React.FC<{userdata: any, field: UserInformationFields, friendlyName: string, unit: String, type: string }> = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const appCtx = useContext(AppContext);

    const whatToDisplay = (userdata: String) => {
        if ( userdata === '' ) {
            return <i>Empty</i>;
        } else {
            return userdata;
        }
    }

    return (
        <IonItem onClick={() => {setShowAlert(true)}}>
            <IonLabel>
                {props.friendlyName}
            </IonLabel>
            <IonLabel className="ion-text-right">
                {whatToDisplay(props.userdata)}
            </IonLabel>
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={props.friendlyName}
                message={`change your data ${props.friendlyName}`}
                inputs={[
                    {
                        name: 'dataInput',
                        type: props.type === 'text' ? 'text' : 'textarea',
                        placeholder: props.friendlyName,
                        value: props.userdata
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        }
                    },
                    {
                        text: 'Ok',
                        cssClass: 'primary',
                        handler: (data: any) => {
                            appCtx.updateOneFieldUserData(appCtx.user, props.field, data['dataInput'])
                        }
                    }
                ]}
            />
        </IonItem>
    )
}

export default UserInformationItem