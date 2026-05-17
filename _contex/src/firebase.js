// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkuzN4G3X-AV_QpIpZNb6jIH4hf3E-fcI",
  authDomain: "quickchat-87c9f.firebaseapp.com",
  databaseURL: "https://quickchat-87c9f-default-rtdb.firebaseio.com",
  projectId: "quickchat-87c9f",
  storageBucket: "quickchat-87c9f.firebasestorage.app",
  messagingSenderId: "799230227234",
  appId: "1:799230227234:web:e7b0f0c3bbcdfcb2f9ab7b",
  measurementId: "G-C6X8TQV4R9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
