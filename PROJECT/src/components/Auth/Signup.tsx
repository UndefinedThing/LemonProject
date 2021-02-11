import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import "firebase/firestore";
import AppContext from "../../data/app-context";
import { ROUTE_HOME, ROUTE_LOGIN } from "../../nav/Routes";
import { IonAlert, IonButton, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonList, IonPage } from "@ionic/react";

interface FormItems {
  username: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  birthdate: string;
  
};
const SignUp = () => {
  const [showAlert1, setShowAlert1] = useState(false);
  const appCtx = useContext(AppContext);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const currentDate = new Date()

  function calculateAge(birthday: Date) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const [values, setValues] = useState({
    username: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    birthdate: currentDate.toISOString()

  } as FormItems);

  const history = useHistory();
  const handleClick = () => {
    history.push(ROUTE_LOGIN)
  }
 
  const handleSubmit = (event: any) => {
    event?.preventDefault();
    const currentAgeOfUser = calculateAge(new Date(values.birthdate))
    if (currentAgeOfUser < 13) {
      setShowAlert1(true)
      return
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential: firebase.auth.UserCredential) => {
        const db = firebase.firestore();
        db.collection("Users").doc(userCredential.user!.uid).set({
            email: values.email,
            username: values.username,
            phone: values.phone,
            contact: "",
            name: values.name,
            lastname: values.lastname,
            description: '',
            picture: '',
            birthdate: values.birthdate,
            uid: userCredential.user!.uid
          })
          .then(() => {
            db.collection("Contacts")
              .add({
                  uidUser: userCredential.user!.uid,
                  contactList: [],
                  myPendingList: [],
                  otPendingList: [],
                  blockedList: []
              }).then((res1) => {
                  var infos = res1.path.split("/");
                  db.collection("Users").doc(userCredential.user!.uid).update({
                      contact: infos[1]
                  });
              });
            appCtx.setUser(userCredential.user!.uid);
            appCtx.setupUserData(userCredential);
            appCtx.setupContactList(userCredential);
            history.push(ROUTE_HOME);
          }).catch(error => {
            setErrorMessage(error.message)
            setShowAlert(true)
          });
      })
      .catch(error => {
        setErrorMessage(error.message)
        setShowAlert(true)
      });
  }

  const handleChange = (event: CustomEvent) => {
    const tar = (event.target as HTMLInputElement)
    setValues(values => ({
      ...values,
      [tar.name]: tar.value
    }));
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flexGrow: 1 }} />
            <div style={{ textAlign: 'center' }}>
              <h1>Sign Up</h1>
              <form onSubmit={handleSubmit}>
                <IonList>        
                  <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput type="text" name="username" value={values.username} onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Name</IonLabel>
                    <IonInput type="text" name="name" value={values.name} onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Lastname</IonLabel>
                    <IonInput type="text" name="lastname" value={values.lastname} onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Phone</IonLabel>
                    <IonInput type="text" name="phone" value={values.phone} onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput type="text" name="email" value={values.email} onIonChange={handleChange}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" name="password" value={values.password} onIonChange={handleChange} ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Birthdate</IonLabel>
                    <IonDatetime name="birthdate" displayFormat="DD/MM/YYYY" max={currentDate.toISOString()} value={values.birthdate} onIonChange={handleChange} ></IonDatetime>
                  </IonItem>
                </IonList>
                <div style={{ marginTop: "1em" }}>
                  <IonButton expand="full" onClick={handleSubmit}>Sign Up</IonButton>
                </div>

                <div>
                  <p style={{ margin: "0", marginTop: "2em" }}>
                    Already have account?
                  </p>
                  <IonButton onClick={handleClick} fill="clear">Login</IonButton>
                </div>
                <p></p>
              </form>
            </div>
            <div style={{ flexGrow: 1 }} />
          </div>
          <div style={{ flexGrow: 1 }} />
        </div>
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        header={errorMessage}
        onDidDismiss={() => { setErrorMessage(""); setShowAlert(false) }}
        buttons={[
          {
            text: 'Ok'
          }
        ]}
      />
      <IonAlert
      isOpen={showAlert1}
      onDidDismiss={() => setShowAlert1(false)}
      header={'Alert'}
      subHeader={'Date de naissance'}
      message={'Vous devez au minimum avoir 13 ans pour pouvoir utiliser cette aplication.'}
      buttons={['OK']}
    />
    </IonPage>
  );
}
export default SignUp;