import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHNUV3TgkdxTcNeR-gq1V-TfgZRieoX3o",
  authDomain: "street-safe-1c78a.firebaseapp.com",
  projectId: "street-safe-1c78a",
  storageBucket: "street-safe-1c78a.firebasestorage.app",
  messagingSenderId: "810744358418",
  appId: "1:810744358418:web:970e94387d5fdb33701acb",
  measurementId: "G-FFRQ8K64HB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};