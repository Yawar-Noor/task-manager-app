
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAHyOSzSI5z-WbE4Kf2gF1LT6B532DaqQc",
  authDomain: "tasky-9faf2.firebaseapp.com",
  projectId: "tasky-9faf2",
  storageBucket: "tasky-9faf2.firebasestorage.app",
  messagingSenderId: "624095133549",
  appId: "1:624095133549:web:ce47570bbcc1ddd8176464",
  measurementId: "G-BZLNXD8302"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// This gives you the Firestore instance to read/write:
export const db = getFirestore(app)
