import React, { useContext, useEffect } from 'react';
import { Redirect, Route} from 'react-router-dom';
import { IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';

import { personAdd, settings, people, home } from 'ionicons/icons';
import Contact from '../pages/Contact';
import Profile from '../pages/Profile';
import GroupsListing from '../pages/Group_main';
import Home from '../pages/Home';
import { ROUTE_CONTACT, ROUTE_PROFILE, ROUTE_GROUP_MAIN, ROUTE_HOME, ROUTE_NAV, ROUTE_CONVERSATION, ROUTE_GROUP } from './Routes';
import firebase from 'firebase';
import AppContext from '../data/app-context';
import Conversation from '../pages/Conversation';
import GroupComp from '../pages/GroupConversation';

const Nav: React.FC = () => {
    const appCtx = useContext(AppContext);

    const id_current_user = firebase.auth().currentUser?.uid
    
    useEffect(() => {
    }, [appCtx.contacts.otPendingList])
    
    const isNotif = () => {
        if ( appCtx.contacts.otPendingList.length > 99 ) {
            return (
                <IonBadge color="danger">
                    99+
                </IonBadge>
            )
        }
        if ( appCtx.contacts.otPendingList.length >= 1 ) {
            return (
                <IonBadge color="danger">
                    {appCtx.contacts.otPendingList.length}
                </IonBadge>
            )
        }
    }

    return (
        <IonTabs> 
            <IonRouterOutlet>
                <Route path={ROUTE_CONTACT} component={Contact} exact />
                <Route path={ROUTE_PROFILE + id_current_user} component={Profile} exact />
                <Route path={`${ROUTE_CONVERSATION}:id`} component={Conversation} exact />
                <Route path={`${ROUTE_GROUP}:id`} component={GroupComp} exact />
                <Route path={ROUTE_GROUP_MAIN} component={GroupsListing} exact />
                <Route path={ROUTE_HOME} component={Home} exact />
                <Redirect path={ROUTE_NAV} exact to={ROUTE_HOME} />
            </IonRouterOutlet>
            <IonTabBar color="primary" slot="top">
                <IonTabButton tab="Home" href={ROUTE_HOME}>
                    <IonIcon icon={home} />
                    <IonLabel>Messages</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Contact" href={ROUTE_CONTACT}>
                    <IonIcon icon={personAdd} />
                    <IonLabel>Contact</IonLabel>
                    {
                        isNotif()
                    }
                </IonTabButton>
                <IonTabButton tab="Group" href={ROUTE_GROUP_MAIN}>
                    <IonIcon icon={people} />
                    <IonLabel>Group</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Profile" href={ROUTE_PROFILE + id_current_user}>
                    <IonIcon icon={settings} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
};

export default Nav;