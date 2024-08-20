
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpIg4xTwSY3cVmuf8Pi5f5IqrkshLgZwg",
  authDomain: "reactchat-efb92.firebaseapp.com",
  projectId: "reactchat-efb92",
  storageBucket: "reactchat-efb92.appspot.com",
  messagingSenderId: "987581723953",
  appId: "1:987581723953:web:fc072a931540c4ea4eec10"
};

const app = initializeApp(firebaseConfig);

export const auth= getAuth()
export const db= getFirestore()
export const storage=getStorage()
