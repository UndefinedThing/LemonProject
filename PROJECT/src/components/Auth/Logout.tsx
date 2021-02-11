import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import "firebase/firestore";
import { ROUTE_LOGIN } from "../../nav/Routes";
import AppContext from "../../data/app-context";


const Logout: React.FC = (props) => {
    const history = useHistory();
    const appCtx = useContext(AppContext);
    const handleClick = (event: any) => {
        event.preventDefault();

        firebase
            .auth()
            .signOut()
            .then(res => {
                appCtx.setUser();
                history.push(ROUTE_LOGIN);
            })
    }
    return (
        <div onClick={handleClick}>
            {props.children}
        </div>
    );
}
export default Logout;