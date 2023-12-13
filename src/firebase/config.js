// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgJNUrkn_1Bc18-6FSSGkhrRSgWsTq6To",
  authDomain: "thienminh-8c869.firebaseapp.com",
  projectId: "thienminh-8c869",
  storageBucket: "thienminh-8c869.appspot.com",
  messagingSenderId: "591304616097",
  appId: "1:591304616097:web:3648d0dc7acd331dcb68e0",
  measurementId: "G-YT2S7EHCYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {
    db,
    auth
}