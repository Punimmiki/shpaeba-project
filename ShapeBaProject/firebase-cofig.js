// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    query,
    where,
    setDoc
} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAHH_4s6z09sRFpXx9fpKejzjp8XHOZiZE",
    authDomain: "shapeba-5d73a.firebaseapp.com",
    projectId: "shapeba-5d73a",
    storageBucket: "shapeba-5d73a.appspot.com",
    messagingSenderId: "130457149367",
    appId: "1:130457149367:web:655ac41792822189991232",
    measurementId: "G-D532KVL0DZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const AUTH = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, query, where, getDoc, AUTH, setDoc };
