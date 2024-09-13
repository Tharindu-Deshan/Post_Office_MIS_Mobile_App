import firebase from 'firebase/compat/app';
import { getDatabase} from 'firebase/database';

 const firebaseConfig = {
        apiKey: "AIzaSyAT5QLBBJjC0q_50WNF42ABNrEQrzouLWA",
        authDomain: "post-office-mis-9c2e6.firebaseapp.com",
        databaseURL: "https://post-office-mis-9c2e6-default-rtdb.firebaseio.com",
        projectId: "post-office-mis-9c2e6",
        storageBucket: "post-office-mis-9c2e6.appspot.com",
        messagingSenderId: "37945704881",
        appId: "1:37945704881:web:0f349c0741bdb3d5567d90",
        measurementId: "G-E7HZJ33Z4F"
      };



if  (firebase.apps.length==0){
    firebase.initializeApp(firebaseConfig);
}

const db =getDatabase();
export { db }