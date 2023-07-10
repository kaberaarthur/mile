import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0kPJKSOU4qtXrvddyAZFHeXQY2LMrz_M",
  authDomain: "mile-cab-app.firebaseapp.com",
  projectId: "mile-cab-app",
  storageBucket: "mile-cab-app.appspot.com",
  messagingSenderId: "51746516421",
  appId: "1:51746516421:web:e77c88b9d209063446afac",
  measurementId: "G-763ZNR0FZZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore, Auth and get a reference to the service
const db = getFirestore(app);
const auth = firebase.auth();

export { auth, db };
