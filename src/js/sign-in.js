import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL6kQnSfUdD8Ut8HFrp9kuivqz1xdXm7k",
    authDomain: "movieverse-app.firebaseapp.com",
    projectId: "movieverse-app",
    storageBucket: "movieverse-app.appspot.com",
    messagingSenderId: "802943718871",
    appId: "1:802943718871:web:48bc916cc99e2724212792"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

document.getElementById('signInForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const usersRef = collection(db, "MovieVerseUsers");
    const q = query(usersRef, where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        alert('Successfully signed in!');
        localStorage.setItem('isSignedIn', JSON.stringify(true));
        localStorage.setItem('currentlySignedInMovieVerseUser', email);
        window.location.href = '../../index.html';
    }
    else {
        alert('Invalid email or password. Ensure that you have entered a correct combination of email and password - one that we have on file.');
    }
});

document.getElementById('createAccountBtn').addEventListener('click', function() {
    window.location.href = 'create-account.html';
});