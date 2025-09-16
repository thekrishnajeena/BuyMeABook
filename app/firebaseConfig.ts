// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBT96tRoCUbPSVOExpHd6GEdGleyBxg18Y",
  authDomain: "buymeabook-1c1dd.firebaseapp.com",
  projectId: "buymeabook-1c1dd",
  storageBucket: "buymeabook-1c1dd.firebasestorage.app",
  messagingSenderId: "366232813336",
  appId: "1:366232813336:web:b1275f1b5480ff6c31a86d",
  measurementId: "G-CPN1FKPWSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)

// const analytics = getAnalytics(app);