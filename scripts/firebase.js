  // Your web app's Firebase configuration
  let uid = null;

  var firebaseConfig = {
    apiKey: "AIzaSyChoanx6-Er_Oe50pfBMLdGIa5H9JMZgEw",
    authDomain: "sliceofpie.firebaseapp.com",
    databaseURL: "https://sliceofpie.firebaseio.com",
    projectId: "sliceofpie",
    storageBucket: "sliceofpie.appspot.com",
    messagingSenderId: "425130834619",
    appId: "1:425130834619:web:af1479d550adf4a502079e",
    measurementId: "G-VXN532BC1J"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();

const signIn = () => {
    auth.signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}

auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      let isAnonymous = user.isAnonymous;
      uid = user.uid;
      // ...
    } else {
      // User is signed out.
    }
  });