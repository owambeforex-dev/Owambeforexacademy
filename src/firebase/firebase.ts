import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || "dummy-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || "dummy-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || "dummy-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || "dummy-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || "dummy-app-id",
  databaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || "(default)"
};

let app;
let auth: any;
let googleProvider: any;
let facebookProvider: any;
let db: any;
let functions: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  db = getFirestore(app, firebaseConfig.databaseId);
  functions = getFunctions(app);

  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  };
  testConnection();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Provide dummy objects to prevent crashes
  auth = { onAuthStateChanged: () => () => {}, currentUser: null };
  db = {};
  functions = {};
}

export { app, auth, googleProvider, facebookProvider, db, functions };
