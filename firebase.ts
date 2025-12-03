import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// Config Project Kamu
const firebaseConfig = {
  apiKey: "AIzaSyC1o7FQl-yyln06kOQ8ZIv15xaa30MsgiQ",
  authDomain: "chatapp-c64b4.firebaseapp.com",
  projectId: "chatapp-c64b4",
  storageBucket: "chatapp-c64b4.firebasestorage.app",
  messagingSenderId: "704612627612",
  appId: "1:704612627612:android:85981edb8cfadecfc66959",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const messagesCollection =
  collection(db, "messages") as CollectionReference<DocumentData>;

export {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
};