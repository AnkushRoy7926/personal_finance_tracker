import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Load environment variables from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FBapiKey,
  authDomain: process.env.NEXT_PUBLIC_FBauthDomain,
  projectId: process.env.NEXT_PUBLIC_FBprojectId,
  storageBucket: process.env.NEXT_PUBLIC_FBstorageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FBmessagingSenderId,
  appId: process.env.NEXT_PUBLIC_FBappId,
  // measurementId: process.env.NEXT_PUBLIC_FBmeasurementId,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Ensure session persists across tabs and browser restarts
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export {db, firebaseApp, auth };