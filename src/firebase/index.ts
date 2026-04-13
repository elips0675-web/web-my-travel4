import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Provides a single, initialized Firebase app instance
let firebaseApp: FirebaseApp;
export const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  return firebaseApp;
};

export function getFirebase() {
    const app = initializeFirebase();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
}

export * from './provider';
export * from './auth/use-user';
export * from './auth/use-user-profile';
export * from './firestore/use-collection';
