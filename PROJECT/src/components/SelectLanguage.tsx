import { IonCol, IonRow, IonSegment, IonSegmentButton } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import fr_flag from '../assets/fr.png'
import en_flag from '../assets/an.png'
import AppContext from '../data/app-context';

const SelectLanguage: React.FC = () => {
    const [lng, setLng] = useState<string>()
    const appCtx = useContext(AppContext)
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!lng && appCtx.userdata.lng !== lng && appCtx.userdata.lng) {
            setLng(appCtx.userdata.lng);
            i18n.changeLanguage(appCtx.userdata.lng)
        }
    }, [appCtx.userdata.lng])

    const updateLng = (newLng: string | undefined) => {
        if (!newLng) return
        setLng(newLng);
        appCtx.updateLanguage(newLng)
    }

    return (
        <IonRow>
            <IonCol sizeSm="10" sizeMd="8" offsetSm="1" offsetMd="2">
                <IonSegment value={lng || 'fr'} onIonChange={e => updateLng(e.detail.value)}>
                    <IonSegmentButton value="fr">
                        <img height="15px" src={fr_flag} />
                    </IonSegmentButton>
                    <IonSegmentButton value="en">
                        <img height="15px" src={en_flag} />
                    </IonSegmentButton>
                </IonSegment>
            </IonCol>
        </IonRow>
    )
}

export default SelectLanguage