import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDic7njORA4nE3-bSN5yQFbHba4IXIGpC8",
  authDomain: "portfolio-rafie.firebaseapp.com",
  databaseURL: "https://portfolio-rafie-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfolio-rafie",
  storageBucket: "portfolio-rafie.firebasestorage.app",
  messagingSenderId: "301202975884",
  appId: "1:301202975884:web:bc00f6d2838605f51cdfa9",
  measurementId: "G-9FBKNJVVEM"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);