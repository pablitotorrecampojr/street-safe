// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK6gpXdVbV445c_dUV7VcCY9iH4jd34ec",
  authDomain: "streetsafe-4e716.firebaseapp.com",
  databaseURL: "https://streetsafe-4e716-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "streetsafe-4e716",
  storageBucket: "streetsafe-4e716.firebasestorage.app",
  messagingSenderId: "758515650137",
  appId: "1:758515650137:web:e18e6045f69254493dab48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, createUserWithEmailAndPassword, setDoc, doc, getDoc, signInWithEmailAndPassword };
