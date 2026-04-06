import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import firebaseConfig from '../../firebase-applet-config.json';

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
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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
