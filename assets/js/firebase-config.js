/* Firebase Configuration for Syed Ejaz Digital Library */
const firebaseConfig = {
  apiKey: "AIzaSyBaGjSxKymWvPmADm-YrAJnmIUKWpNJYIE",
  authDomain: "ejaz-gillani-books.firebaseapp.com",
  projectId: "ejaz-gillani-books",
  storageBucket: "ejaz-gillani-books.firebasestorage.app",
  messagingSenderId: "1092755470144",
  appId: "1:1092755470144:web:f3aa4411e982ac48d2eca5",
  measurementId: "G-1XTX1FN02T"
};

// Initialize Firebase (Compat SDK)
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.db = firebase.firestore();
  if (firebase.storage) {
    window.storage = firebase.storage();
  }
}
