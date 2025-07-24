// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "romelyy-92cgr",
  "appId": "1:905886063680:web:6e5b070425e2779846d3a5",
  "storageBucket": "romelyy-92cgr.firebasestorage.app",
  "apiKey": "AIzaSyCFZbp2tJQ4v71EdNzgD656xcuu1JdgWcY",
  "authDomain": "romelyy-92cgr.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "905886063680"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable Firestore persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  });


export { app, db };
