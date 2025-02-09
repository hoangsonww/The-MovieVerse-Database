import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let app;
let db;

async function loadFirebaseConfig() {
  try {
    const token = localStorage.getItem('movieverseToken');
    const response = await fetch('https://api-movieverse.vercel.app/api/firebase-config', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
    }
    const firebaseConfig = await response.json();
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase Initialized Successfully');
  } catch (error) {
    console.error('Error loading Firebase config:', error);
  }
}

await loadFirebaseConfig();

function isValidPassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
}

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

document.getElementById('createAccountForm').addEventListener('submit', async e => {
  showSpinner();
  try {
    e.preventDefault();
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidPassword(password)) {
      alert(
        'Password does not meet the security requirements.\n\n' +
          'Your password must include:\n' +
          '- At least 8 characters\n' +
          '- At least one uppercase letter\n' +
          '- At least one lowercase letter\n' +
          '- At least one number\n' +
          '- At least one special character (e.g., !@#$%^&*)'
      );
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
      await addDoc(collection(db, 'MovieVerseUsers'), {
        email: email,
        password: password,
      });

      const profileRef = doc(db, 'profiles', email);
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
        profileImage: '../../images/user-default.png',
      });

      alert('Account created successfully! Now please sign in on the sign in page to proceed.');
      window.location.href = 'sign-in.html';
    } catch (error) {
      console.log('Error creating account: ', error);
      alert('Failed to create account. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching user list: ', error);
    if (error.code === 'resource-exhausted') {
      const noUserSelected = document.getElementById('account-creation-form-container');
      if (noUserSelected) {
        noUserSelected.innerHTML =
          "Sorry, our database is currently overloaded. Please try reloading once more, and if that still doesn't work, please try again in a couple hours. For full transparency, we are currently using a database that has a limited number of reads and writes per day due to lack of funding. Thank you for your patience as we work on scaling our services. At the mean time, feel free to use other MovieVerse features!";
        noUserSelected.style.height = '350px';
      }
    }
  } finally {
    hideSpinner();
  }
});

async function accountExists(email) {
  const q = query(collection(db, 'MovieVerseUsers'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
