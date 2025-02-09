let app;
let db;
let firebaseModules;

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
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = await import(
      'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
    );
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseModules = {
      collection,
      query,
      where,
      getDocs,
      doc,
      updateDoc,
    };
    console.log('Firebase Initialized Successfully');
  } catch (error) {
    console.error('Error loading Firebase config:', error);
  }
}

loadFirebaseConfig();

async function ensureFirebase() {
  while (!db || !firebaseModules) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return { db, firebaseModules };
}

document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
  showSpinner();
  try {
    event.preventDefault();
    const resetEmail = document.getElementById('resetEmail').value;
    const { db, firebaseModules } = await ensureFirebase();
    const q = firebaseModules.query(firebaseModules.collection(db, 'MovieVerseUsers'), firebaseModules.where('email', '==', resetEmail));
    const querySnapshot = await firebaseModules.getDocs(q);
    if (querySnapshot.empty) {
      alert('No account with such credentials exists in our database, or you might have mistyped something. Please try again.');
      return;
    }
    document.getElementById('newPasswordFields').style.display = 'block';
  } catch (error) {
    console.error('Error fetching user list: ', error);
    if (error.code === 'resource-exhausted') {
      const noUserSelected = document.getElementById('password-reset-form-container');
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

async function updatePassword() {
  const resetEmail = document.getElementById('resetEmail').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;

  if (!isValidPassword(newPassword)) {
    alert(
      'New password does not meet the security requirements.\n\n' +
        'Your password must include:\n' +
        '- At least 8 characters\n' +
        '- At least one uppercase letter\n' +
        '- At least one lowercase letter\n' +
        '- At least one number\n' +
        '- At least one special character (e.g., !@#$%^&*)'
    );
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert('Passwords do not match.');
    return;
  }

  const { db, firebaseModules } = await ensureFirebase();
  const q = firebaseModules.query(firebaseModules.collection(db, 'MovieVerseUsers'), firebaseModules.where('email', '==', resetEmail));
  const querySnapshot = await firebaseModules.getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach(async docSnapshot => {
      await firebaseModules
        .updateDoc(firebaseModules.doc(db, 'MovieVerseUsers', docSnapshot.id), {
          password: newPassword,
        })
        .then(() => {
          alert('Password updated successfully!');
          window.location.href = 'sign-in.html';
        })
        .catch(error => {
          console.log('Error updating password: ', error);
          alert('Failed to update password. Please try again.');
        });
    });
  } else {
    alert('Failed to find account. Please try again.');
  }
}

document.getElementById('updatePasswordButton').addEventListener('click', updatePassword);

function isValidPassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
}
