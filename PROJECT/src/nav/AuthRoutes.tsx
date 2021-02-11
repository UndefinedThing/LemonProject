import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "../components/Auth/Login";
import MailConfirmation from "../components/Auth/MailConfirmation";
import SignUp from "../components/Auth/Signup";
import { ROUTE_AUTH_BASE, ROUTE_AUTH_MAIL_CONFIRM, ROUTE_LOGIN, ROUTE_SIGN_UP } from "./Routes";
export const AuthRoutes: React.FC = () => {
    return (
        <Switch>
            <Route exact path={ROUTE_LOGIN} component={Login} />
            <Route exact path={ROUTE_SIGN_UP} component={SignUp} />
            <Route exact path={ROUTE_AUTH_MAIL_CONFIRM} component={MailConfirmation} />
            <Redirect to={ROUTE_LOGIN} from={ROUTE_AUTH_BASE} />
        </Switch>
    )
}

export default AuthRoutes