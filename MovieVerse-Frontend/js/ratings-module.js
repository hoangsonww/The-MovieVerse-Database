import { app, db, firebaseReady } from './firebase.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Wait for Firebase to be ready (if needed)
await firebaseReady;

export async function loadUserRatings(currentUserEmail) {
  if (currentUserEmail) {
    const ratingsRef = doc(db, 'userRatings', currentUserEmail);
    const docSnap = await getDoc(ratingsRef);
    return docSnap.exists() ? docSnap.data().ratings : {};
  } else {
    return JSON.parse(localStorage.getItem('movieRatings')) || {};
  }
}

let currentUserEmail1 = '';
let movieId1 = '';
let newRating1 = '';

export async function updateAverageMovieRating(currentUserEmail, movieId, newRating) {
  if (!currentUserEmail) {
    console.error('No user signed in, using localStorage to save ratings.');
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    savedRatings[movieId] = newRating;
    localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
    updateLocalAverage(savedRatings);
    currentUserEmail1 = currentUserEmail;
    movieId1 = movieId;
    newRating1 = newRating;
  } else {
    console.log('User signed in, saving ratings to Firebase.');
    const ratingsRef = doc(db, 'userRatings', currentUserEmail);
    const docSnap = await getDoc(ratingsRef);
    let ratings = docSnap.exists() ? docSnap.data().ratings || {} : {};
    ratings[movieId] = newRating;
    await setDoc(ratingsRef, { ratings: ratings }, { merge: true });
    updateFirebaseAverage(ratings, ratingsRef);
    updateLocalAverage(ratings);
    currentUserEmail1 = currentUserEmail;
    movieId1 = movieId;
    newRating1 = newRating;
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

document.addEventListener('DOMContentLoaded', async () => {
  await updateAverageMovieRating(currentUserEmail1, movieId1, newRating1);
});
