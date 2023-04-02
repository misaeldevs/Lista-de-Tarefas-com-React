import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBFoeMoIkGtjIVNTI-dGejZXfbPHrI63D8",
    authDomain: "curso-e3b67.firebaseapp.com",
    projectId: "curso-e3b67",
    storageBucket: "curso-e3b67.appspot.com",
    messagingSenderId: "756516462486",
    appId: "1:756516462486:web:700abc2bbd0c8dadd087b7",
    measurementId: "G-0153JYNXJ0"
  };

  const firebaseApp = initializeApp(firebaseConfig)
  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export {db, auth}