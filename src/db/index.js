import firebase from 'firebase';
import '@firebase/firestore';

import dbConfig from './config';

const firebaseConfig = {
  apiKey: dbConfig.apiKey,
  authDomain: dbConfig.authDomain,
  databaseURL: dbConfig.databaseURL,
  projectId: dbConfig.projectId,
  storageBucket: dbConfig.storageBucket,
  messagingSenderId: dbConfig.messagingSenderId
};

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
