var firebaseConfig = {
    apiKey: "AIzaSyBeQPM4KqKAkDU_6yuYEa6RwLGKD_C9qac",
    authDomain: "splitthepieuk.firebaseapp.com",
    databaseURL: "https://splitthepieuk.firebaseio.com",
    projectId: "splitthepieuk",
    storageBucket: "splitthepieuk.appspot.com",
    messagingSenderId: "68226256686",
    appId: "1:68226256686:web:e4a6ea08a313086dd1f4bf",
    measurementId: "G-S7YR7KMNEC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();