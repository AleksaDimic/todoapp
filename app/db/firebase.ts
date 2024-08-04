import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBLS_d0xeXXjP8izRemXSiHunUDzDb704M",
  authDomain: "to-do-list-17b99.firebaseapp.com",
  projectId: "to-do-list-17b99",
  storageBucket: "to-do-list-17b99.appspot.com",
  messagingSenderId: "775584392971",
  appId: "1:775584392971:web:7b4bcc75def373b13b240e"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(auth)
export const firestore = getFirestore(app)