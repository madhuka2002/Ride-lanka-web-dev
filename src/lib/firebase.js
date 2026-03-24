import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guide-specific Firebase config (Secondary Project)
const guideFirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_GUIDE_FIREBASE_APP_ID,
};

// Initialize Primary App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Guide App
const guideApp = !getApps().find(a => a.name === "guideApp") 
    ? initializeApp(guideFirebaseConfig, "guideApp") 
    : getApp("guideApp");
export const guideAuth = getAuth(guideApp);
export const guideDb = getFirestore(guideApp);
export const guideStorage = getStorage(guideApp);