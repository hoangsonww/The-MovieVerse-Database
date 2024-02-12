import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const resetEmail = document.getElementById('resetEmail').value;

    const q = query(collection(db, "MovieVerseUsers"), where("email", "==", resetEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("No account with such credentials exists in our database, or you might have mistyped something. Please try again.");
        return;
    }

    document.getElementById('newPasswordFields').style.display = 'block';
});

async function updatePassword() {
    const resetEmail = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!isValidPassword(newPassword)) {
        alert('New password does not meet the security requirements.\n\n' +
            'Your password must include:\n' +
            '- At least 8 characters\n' +
            '- At least one uppercase letter\n' +
            '- At least one lowercase letter\n' +
            '- At least one number\n' +
            '- At least one special character (e.g., !@#$%^&*)');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match.");
        return;
    }

    const q = query(collection(db, "MovieVerseUsers"), where("email", "==", resetEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
            await updateDoc(doc(db, "MovieVerseUsers", docSnapshot.id), {
                password: newPassword
            }).then(() => {
                alert("Password updated successfully!");
                window.location.href = 'sign-in.html';
            }).catch((error) => {
                console.error("Error updating password: ", error);
                alert("Failed to update password. Please try again.");
            });
        });
    }
    else {
        alert("Failed to find account. Please try again.");
    }
}

document.getElementById('updatePasswordButton').addEventListener('click', updatePassword);

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
