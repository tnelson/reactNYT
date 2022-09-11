/////////////////////////////////////////////////////////////////////
// Firebase setup and configuration The tokens here aren't 
// sensitive; the client needs them to use the database.
// This is a "Spark" plan, so limited to 100 concurrent connections.
/////////////////////////////////////////////////////////////////////

import { initializeApp } from "firebase/app";
import {v4 as uuid} from 'uuid' // also needs @types/uuid to dev in TypeScript
import { getDatabase} from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7lnyIvWJocylZcWLFrRbeWSN2WQr0V2E",
  authDomain: "reactnyt.firebaseapp.com",
  projectId: "reactnyt",
  storageBucket: "reactnyt.appspot.com",
  messagingSenderId: "1019309984051",
  appId: "1:1019309984051:web:0543a1ee528e05a8ec9646",
  measurementId: "G-7F1N89X5BL"
};

export const session_id = uuid()
const firebase_app = initializeApp(firebaseConfig);  
export const database = getDatabase(firebase_app);
