import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// Required for side-effects
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyBHP3YhzrciwiI_mQ9-80MTR87CSRlW8ME",
  authDomain: "examenux-ee1d5.firebaseapp.com",
  databaseURL: "https://examenux-ee1d5.firebaseio.com",
  projectId: "examenux-ee1d5",
  storageBucket: "examenux-ee1d5.appspot.com",
  messagingSenderId: "320399450906"
};

firebase.initializeApp(config);


const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/dashboard',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],

};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firebaseUI = uiConfig;

