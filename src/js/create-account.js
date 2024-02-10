import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidPassword(password)) {
        alert('Password does not meet the security requirements.\n\n' +
            'Your password must include:\n' +
            '- At least 8 characters\n' +
            '- At least one uppercase letter\n' +
            '- At least one lowercase letter\n' +
            '- At least one number\n' +
            '- At least one special character (e.g., !@#$%^&*)');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const exists = await accountExists(email);
    if (exists) {
        alert('An account with this email already exists.');
        return;
    }

    try {
        await addDoc(collection(db, "users"), {
            email: email,
            password: password
        });
        alert('Account created successfully! Now please sign in on the sign in page to proceed.');
        window.location.href = 'sign-in.html';
    }
    catch (error) {
        console.error("Error creating account: ", error);
        alert('Failed to create account. Please try again later.');
    }
});

function isValidPassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumbers &&
        hasSpecialChar
    );
}

async function accountExists(email) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if account exists, false otherwise
}

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}