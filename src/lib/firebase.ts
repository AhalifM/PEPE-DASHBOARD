// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvyte0zxB59e6_R1HkfyiXnGDVrWPNDI8",
  authDomain: "pepe-f20ae.firebaseapp.com",
  projectId: "pepe-f20ae",
  storageBucket: "pepe-f20ae.firebasestorage.app",
  messagingSenderId: "245206153922",
  appId: "1:245206153922:web:ea2ffd6c904a18426e595b",
  measurementId: "G-GVW0PQGYX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
