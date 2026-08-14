import { initializeApp } from "firebase/app";
import { initializeAuth, GoogleAuthProvider, getAuth, browserLocalPersistence } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
    apiKey: "AIzaSyBIfzCZRe5nYajS912R9gOGsDxjTSLSjEY",
    authDomain: "career-guidance-app-9aba0.firebaseapp.com",
    projectId: "career-guidance-app-9aba0",
    storageBucket: "career-guidance-app-9aba0.firebasestorage.app",
    messagingSenderId: "162671597184",
    appId: "1:162671597184:web:137fa2c7654bf002d9b865"
};

const app = initializeApp(firebaseConfig);

let auth: any;
if (Platform.OS === 'web') {
    auth = getAuth(app);
    auth.setPersistence(browserLocalPersistence);
} else {
    // @ts-ignore
    const { getReactNativePersistence } = require("firebase/auth/react-native");
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export { auth };
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
