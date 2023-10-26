// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaswRo-pxuhYz6mI85DBbCGNOoCG2i2Co",
  authDomain: "night-market-34b58.firebaseapp.com",
  projectId: "night-market-34b58",
  storageBucket: "night-market-34b58.appspot.com",
  messagingSenderId: "1096296375261",
  appId: "1:1096296375261:web:1ce036b6c5d58000114c34",
  measurementId: "G-75DYH8FJZ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;