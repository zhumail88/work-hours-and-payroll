import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNeO0LeKdwXW0Xl2UrV5QGsKxX5Ik3GLg",
  authDomain: "work-hours-and-payroll.firebaseapp.com",
  projectId: "work-hours-and-payroll",
  storageBucket: "work-hours-and-payroll.firebasestorage.app",
  messagingSenderId: "906601955088",
  appId: "1:906601955088:web:776d3e76c431e010d6af95",
  measurementId: "G-24QMCG841Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();