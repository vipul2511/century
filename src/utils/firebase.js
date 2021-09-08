import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// var firebaseConfig = {
//   apiKey: "AIzaSyAjn5tiZF5RMbTG7WC9RPFVFtJaZG3bMYE",
//   authDomain: "century-7e29f.firebaseapp.com",
//   databaseURL: "https://century-7e29f-default-rtdb.firebaseio.com",
//   projectId: "century-7e29f",
//   storageBucket: "century-7e29f.appspot.com",
//   messagingSenderId: "1050568693027",
//   appId: "1:1050568693027:web:d65aa9819af9e535656896",
//   measurementId: "G-TFJZMCSBTG"
// };
var firebaseConfig = {
  apiKey: "AIzaSyBMp6zdfMCno7AoYCqB4wxuPm5FU5msEyw",
  authDomain: "century-57260.firebaseapp.com",
  databaseURL: "https://century-57260-default-rtdb.firebaseio.com",
  projectId: "century-57260",
  storageBucket: "century-57260.appspot.com",
  messagingSenderId: "218723826878",
  appId: "1:218723826878:web:7c99d45522031aa25b32ef",
  measurementId: "G-3MV7QPRFV1"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;