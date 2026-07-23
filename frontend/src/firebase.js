import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBIfzCZRe5nYajS912R9gOGsDxjTSLSjEY",
    authDomain: "career-guidance-app-9aba0.firebaseapp.com",
    projectId: "career-guidance-app-9aba0",
    storageBucket: "career-guidance-app-9aba0.firebasestorage.app",
    messagingSenderId: "162671597184",
    appId: "1:162671597184:web:137fa2c7654bf002d9b865"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });