import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
    try {
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
            await addDoc(collection(db, "MovieVerseUsers"), {
                email: email,
                password: password
            });

            const profileRef = doc(db, 'profiles', email); // Using email as document ID for simplicity
            await setDoc(profileRef, {
                username: 'N/A',
                dob: 'N/A',
                bio: 'N/A',
                favoriteGenres: ['N/A'],
                location: 'N/A',
                favoriteMovie: 'N/A',
                hobbies: ['N/A'],
                favoriteActor: 'N/A',
                favoriteDirector: 'N/A',
                personalQuote: 'N/A',
                profileImage: '../../images/user-default.png'
            });

            alert('Account created successfully! Now please sign in on the sign in page to proceed.');
            window.location.href = 'sign-in.html';
        }
        catch (error) {
            console.log("Error creating account: ", error);
            alert('Failed to create account. Please try again later.');
        }
    }
    catch (error) {
        console.error("Error fetching user list: ", error);
        if (error.code === 'resource-exhausted') {
            const noUserSelected = document.getElementById('account-creation-form-container');
            if (noUserSelected) {
                noUserSelected.innerHTML = "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
                noUserSelected.style.height = '350px';
            }
            hideSpinner();
        }
    }
});

async function accountExists(email) {
    const q = query(collection(db, "MovieVerseUsers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}
