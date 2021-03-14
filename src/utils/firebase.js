import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyAjn5tiZF5RMbTG7WC9RPFVFtJaZG3bMYE",
  authDomain: "century-7e29f.firebaseapp.com",
  databaseURL: "https://century-7e29f-default-rtdb.firebaseio.com",
  projectId: "century-7e29f",
  storageBucket: "century-7e29f.appspot.com",
  messagingSenderId: "1050568693027",
  appId: "1:1050568693027:web:d65aa9819af9e535656896",
  measurementId: "G-TFJZMCSBTG"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;