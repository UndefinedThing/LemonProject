import React, { useContext, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import AuthRoutes from './nav/AuthRoutes';
import PrivateRoute from './nav/PrivateRoutes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import {ROUTE_CONTACT, ROUTE_HOME, ROUTE_GROUP_MAIN, ROUTE_PROFILE, ROUTE_CONVERSATION, ROUTE_GROUP } from './nav/Routes';
import Nav from './nav/Nav';
import AppContext from './data/app-context';


/* Import Traslation */
import './translations/i18n';

const App: React.FC = () => {

  const appCtx = useContext(AppContext);

  useEffect(() => {
    appCtx.initContext();
    // eslint-disable-next-line
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <PrivateRoute path={ROUTE_CONTACT} component={Nav} />
            <PrivateRoute path={ROUTE_GROUP_MAIN} component={Nav} />
            <PrivateRoute exact path={`${ROUTE_PROFILE}:id`} component={Nav} />
            <PrivateRoute path={ROUTE_HOME} component={Nav} />
            <PrivateRoute exact path={`${ROUTE_CONVERSATION}:id`} component={Nav} />
            <PrivateRoute exact path={`${ROUTE_GROUP}:id`} component={Nav} />
            <Route path="/auth" component={AuthRoutes} />
            <Redirect path="/" to={ROUTE_HOME} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
