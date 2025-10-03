// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIctezfC2wzlw8Awas9lPXn_YOXBWYso4",
  authDomain: "wicue-a6a01.firebaseapp.com",
  projectId: "wicue-a6a01",
  storageBucket: "wicue-a6a01.appspot.com", // fixed typo here
  messagingSenderId: "481075077575",
  appId: "1:481075077575:web:e0e5ed187231c3a788b9e2",
  measurementId: "G-ZVZ4S87GVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);