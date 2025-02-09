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
    const { getFirestore, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseModules = { collection, query, where, getDocs };
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

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

document.getElementById('signInForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  showSpinner();
  try {
    const { db, firebaseModules } = await ensureFirebase();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    const usersRef = firebaseModules.collection(db, 'MovieVerseUsers');
    const q = firebaseModules.query(usersRef, firebaseModules.where('email', '==', email), firebaseModules.where('password', '==', password));
    const querySnapshot = await firebaseModules.getDocs(q);
    if (!querySnapshot.empty) {
      alert('Successfully signed in!');
      localStorage.setItem('isSignedIn', JSON.stringify(true));
      localStorage.setItem('currentlySignedInMovieVerseUser', email);
      window.location.href = '../../index.html';
    } else {
      alert('Invalid email or password. Ensure that you have entered a correct combination of email and password - one that we have on file.');
    }
  } catch (error) {
    console.error('Error fetching user list: ', error);
    if (error.code === 'resource-exhausted') {
      const noUserSelected = document.getElementById('signInForm');
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

document.getElementById('createAccountBtn').addEventListener('click', function () {
  window.location.href = 'create-account.html';
});
