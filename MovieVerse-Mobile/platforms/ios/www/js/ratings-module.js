import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: atob('QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw=='),
  authDomain: atob('bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t'),
  projectId: 'movieverse-app',
  storageBucket: atob('bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20='),
  messagingSenderId: atob('ODAyOTQzNzE4ODcx'),
  appId: atob('MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI='),
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
