import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const isBrowser = typeof window !== "undefined";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // Define o authDomain dinamicamente para o hostname atual se não estiver no localhost.
  // Isso resolve o problema de travamento/bloqueio no Safari (iOS) devido às políticas de cookies.
  // IMPORTANTE: Lembre-se de adicionar "https://beautyfreelas.web.app/__/auth/handler" nas URIs autorizadas no Google Cloud Console.
  authDomain: isBrowser && !window.location.hostname.includes("localhost") && !window.location.hostname.startsWith("127.") && !window.location.hostname.startsWith("192.168.")
    ? window.location.hostname
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
