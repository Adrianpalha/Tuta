// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCxokWIgooUb0RRU2IgdvZHvObuYSv9AL0",
  authDomain: "tuta-lanches.firebaseapp.com",
  databaseURL: "https://tuta-lanches-default-rtdb.firebaseio.com",
  projectId: "tuta-lanches",
  storageBucket: "tuta-lanches.appspot.com",
  messagingSenderId: "479951848",
  appId: "1:479951848:web:262562993fcac563bdc25d",
  measurementId: "G-0ZQMDSDYGJ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();