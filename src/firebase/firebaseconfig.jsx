import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyADRgqjoITMgQklDBIcAYHZVR81TQdk-vY",
    authDomain: "durshdj.firebaseapp.com",
    projectId: "durshdj",
    storageBucket: "durshdj.appspot.com",
    messagingSenderId: "71304478998",
    appId: "1:71304478998:web:b49c00abe0931d5d5cd037"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { fireDB, auth, storage };