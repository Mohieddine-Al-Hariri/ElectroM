// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

//##// Project Console: https://console.firebase.google.com/project/sportsecommerce-proj-try1-gu/overview
//##// Hosting URL: https://sportsecommerce-proj-try1-gu.web.app

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBaxvmojc3pZB6QXUcSpSPTOdC-x07Nxi8",
//   // apiKey: process.env.FIREBASE_API_Key,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_API_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyBaxvmojc3pZB6QXUcSpSPTOdC-x07Nxi8",
  authDomain: "sportsecommerce-proj-try1-gu.firebaseapp.com",
  projectId: "sportsecommerce-proj-try1-gu",
  storageBucket: "sportsecommerce-proj-try1-gu.appspot.com",
  messagingSenderId: "633746400501",
  appId: "1:633746400501:web:97f45bd2546dedcd7a91bc",
  measurementId: "G-PBKZZ0XZBK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);
// export const analytics = getAnalytics(app);

export { auth, storage };
