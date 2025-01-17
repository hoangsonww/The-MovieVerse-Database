import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const code1 = 'QUl6YVN5RE' + 'w2a1FuU2ZV' + 'ZDhVdDhIR' + 'nJwS3Vpdn' + 'F6MXhkW' + 'G03aw==';

const code2 = 'bW92aWV2' + 'ZXJzZS1' + 'hcHAuZm' + 'lyZWJhc2' + 'VhcHAu' + 'Y29t';

const code3 = 'bW92aWV2' + 'ZXJzZS1hc' + 'HAuYXBwc' + '3BvdC' + '5jb20=';

const code4 = 'ODAyOTQz' + 'NzE4ODcx';

const code5 = 'MTo4MDI' + '5NDM3MTg' + '4NzE6d2V' + 'iOjQ4YmM' + '5MTZjYz' + 'k5ZTI3M' + 'jQyMTI' + '3OTI=';

async function animateLoadingDots() {
  const loadingTextElement = document.querySelector('#myModal p');
  let dots = '';

  while (document.getElementById('myModal').classList.contains('modal-visible')) {
    loadingTextElement.textContent = `Loading chats${dots}`;
    dots = dots.length < 3 ? dots + '.' : '.';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

const firebaseConfig = {
  apiKey: atob(code1),
  authDomain: atob(code2),
  projectId: 'movieverse-app',
  storageBucket: atob(code3),
  messagingSenderId: atob(code4),
  appId: atob(code5),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadUserRatings(currentUserEmail) {
  if (currentUserEmail) {
    const ratingsRef = doc(db, 'userRatings', currentUserEmail);
    const docSnap = await getDoc(ratingsRef);
    return docSnap.exists() ? docSnap.data().ratings : {};
  } else {
    return JSON.parse(localStorage.getItem('movieRatings')) || {};
  }
}

export async function updateAverageMovieRating(currentUserEmail, movieId, newRating) {
  if (!currentUserEmail) {
    console.error('No user signed in, using localStorage to save ratings.');
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    savedRatings[movieId] = newRating;
    localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
    updateLocalAverage(savedRatings);
  } else {
    console.log('User signed in, saving ratings to Firebase.');
    const ratingsRef = doc(db, 'userRatings', currentUserEmail);
    const docSnap = await getDoc(ratingsRef);
    let ratings = docSnap.exists() ? docSnap.data().ratings || {} : {};
    ratings[movieId] = newRating;

    await setDoc(ratingsRef, { ratings: ratings }, { merge: true });
    updateFirebaseAverage(ratings, ratingsRef);
    updateLocalAverage(ratings);
  }
}

function updateLocalAverage(savedRatings) {
  let totalRating = 0;
  let totalMoviesRated = 0;
  Object.values(savedRatings).forEach(rating => {
    totalRating += parseFloat(rating);
    totalMoviesRated++;
  });
  const averageRating = totalMoviesRated > 0 ? totalRating / totalMoviesRated : 0;
  localStorage.setItem('averageMovieRating', averageRating.toFixed(1));
}

async function updateFirebaseAverage(ratings, ratingsRef) {
  let totalRating = 0;
  let totalMoviesRated = 0;
  Object.values(ratings).forEach(rating => {
    totalRating += parseFloat(rating);
    totalMoviesRated++;
  });
  const averageRating = totalMoviesRated > 0 ? totalRating / totalMoviesRated : 0;
  await setDoc(ratingsRef, { averageRating: averageRating }, { merge: true });
}

export async function getAverageMovieRating(currentUserEmail) {
  if (!currentUserEmail) {
    console.error('No user signed in, retrieving average rating from localStorage.');
    return localStorage.getItem('averageMovieRating') || 0;
  } else {
    const ratingsRef = doc(db, 'userRatings', currentUserEmail);
    const docSnap = await getDoc(ratingsRef);
    return docSnap.exists() && docSnap.data().averageRating ? docSnap.data().averageRating : 0;
  }
}
