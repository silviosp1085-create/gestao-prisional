import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgqRsvgiRFWIe_AL1fCCXz00IU8_UQW5M",
  authDomain: "sistema-gestao-interna.firebaseapp.com",
  projectId: "sistema-gestao-interna",
  storageBucket: "sistema-gestao-interna.firebasestorage.app",
  messagingSenderId: "335765550585",
  appId: "1:335765550585:web:8f3bd3ad03f8f714dcf928"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Ensure session persists even if the browser is closed
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});
