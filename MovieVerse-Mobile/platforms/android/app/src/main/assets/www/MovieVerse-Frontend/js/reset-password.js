import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function translateFBC(value) {
    return atob(value);
}

function getFBConfig1() {
    const fbConfig1 = "QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==";
    return translateFBC(fbConfig1);
}

function getFBConfig2() {
    const fbConfig2 = "bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t";
    return translateFBC(fbConfig2);
}

function getFBConfig3() {
    const fbConfig3 = "bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=";
    return translateFBC(fbConfig3);
}

function getFBConfig4() {
    const fbConfig4 = "ODAyOTQzNzE4ODcx";
    return translateFBC(fbConfig4);
}

function getFBConfig5() {
    const fbConfig5 = "MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=";
    return translateFBC(fbConfig5);
}

const firebaseConfig = {
    apiKey: getFBConfig1(),
    authDomain: getFBConfig2(),
    projectId: "movieverse-app",
    storageBucket: getFBConfig3(),
    messagingSenderId: getFBConfig4(),
    appId: getFBConfig5()
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    try {
        event.preventDefault();
        const resetEmail = document.getElementById('resetEmail').value;

        const q = query(collection(db, "MovieVerseUsers"), where("email", "==", resetEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("No account with such credentials exists in our database, or you might have mistyped something. Please try again.");
            return;
        }

        document.getElementById('newPasswordFields').style.display = 'block';
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('password-reset-form-container');
            if (noUserSelected) {
                noUserSelected.innerHTML = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                noUserSelected.style.height = '350px';
            }
            hideSpinner();
        }
    }
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
                console.log("Error updating password: ", error);
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
