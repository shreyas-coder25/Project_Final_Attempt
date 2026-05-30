import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, httpsCallable, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const configValues = Object.values(firebaseConfig);
export const isFirebaseConfigured = configValues.every(Boolean);

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let functions: Functions | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
}

export function requireFirebase() {
  if (!auth || !db || !functions) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to .env.",
    );
  }
  return { auth, db, functions };
}

export async function signInWithGoogle(): Promise<void> {
  const { auth } = requireFirebase();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function ensureAuth(): Promise<User> {
  const { auth } = requireFirebase();
  if (auth.currentUser) return auth.currentUser;
  
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not authenticated. Please log in."));
      }
    });
  });
}

export function getCallable<TRequest, TResponse>(name: string) {
  const { functions } = requireFirebase();
  return httpsCallable<TRequest, TResponse>(functions, name);
}
