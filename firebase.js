import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA35J4L0yA5yPphKszmtzG8W-uTwnUtHmQ",
    authDomain: "leaderboard-c5ec8.firebaseapp.com",
    projectId: "leaderboard-c5ec8",
    storageBucket: "leaderboard-c5ec8.appspot.com",
    messagingSenderId: "433474546332",
    appId: "1:433474546332:web:3f697816220e03ac991b59"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
