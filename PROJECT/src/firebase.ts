import firebase from "firebase/app";
import firebaseConfig from "./config/firebaseConfig";
firebase.initializeApp(firebaseConfig);
export default firebase;