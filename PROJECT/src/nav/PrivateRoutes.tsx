import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Route, Redirect } from "react-router-dom";
import AppContext from "../data/app-context";
import { ROUTE_AUTH_MAIL_CONFIRM, ROUTE_LOGIN } from "./Routes";
import firebase from "../firebase";

export interface RouteAndRedirectProps {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path?: string;
    exact?: boolean;
}

const PrivateRoute: React.FC<RouteAndRedirectProps> = (props) => {
    const { authenticated, loadingAuthState } = useContext(AppContext);
    const userCredential = firebase.auth().currentUser;

    if (loadingAuthState) {
        return (
            <IonPage>
                <IonContent fullscreen>
                    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                        <div style={{ flexGrow: 1 }} />
                        <div className="ion-text-center">
                            <h1>Loading</h1>
                            <IonSpinner />
                        </div>
                        <div style={{ flexGrow: 1 }} />
                    </div>

                </IonContent>
            </IonPage>

        );
    }
    return (
        <React.Fragment>
            {
                authenticated ?
                    <React.Fragment>
                        {
                            userCredential?.emailVerified ?
                                <Route path={props.path} component={props.component} exact={props.exact} />
                                :
                                <Redirect path={props.path} exact={props.exact} to={ROUTE_AUTH_MAIL_CONFIRM} />
                        }

                    </React.Fragment>
                    :
                    <Redirect path={props.path} exact={props.exact} to={ROUTE_LOGIN} />
            }
        </React.Fragment>
    );
}
export default PrivateRoute