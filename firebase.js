// Import the functions you need from the SDKs you need
import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  getFirestore,
  collection,
} from '@firebase/firestore';

import {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
} from '@env';

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// fix: firebase version 9 setDoc not working issues https://github.com/firebase/firebase-js-sdk/issues/1674#issuecomment-944041831
// const db = initializeFirestore(app, {
//   useFetchStreams: false,
// });
const db = getFirestore();

export { auth, db, doc, setDoc, onSnapshot, collection, serverTimestamp };
