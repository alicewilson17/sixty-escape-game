import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAYmKVvn-3kJYjBh5XI_Gb0KUkwhsjxjo",
  authDomain: "sixty-escape-game.firebaseapp.com",
  projectId: "sixty-escape-game",
  storageBucket: "sixty-escape-game.appspot.com",
  messagingSenderId: "559994329179",
  appId: "1:559994329179:web:48b0fd20d57f877a15077e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
