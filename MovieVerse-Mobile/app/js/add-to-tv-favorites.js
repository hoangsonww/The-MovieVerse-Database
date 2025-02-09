import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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

    console.log('🔥 Firebase Initialized Successfully');
  } catch (error) {
    console.error('❌ Error loading Firebase config:', error);
  }
}

loadFirebaseConfig();

export async function toggleFavoriteTVSeries() {
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  try {
    let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    if (!tvSeriesId) {
      console.log('TV Series ID is missing');
      return;
    }

    if (!userEmail) {
      console.log('User is not signed in. Using localStorage for favorites.');
      let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
      if (favoritesTVSeries.includes(tvSeriesId)) {
        favoritesTVSeries = favoritesTVSeries.filter(id => id !== tvSeriesId);
      } else {
        favoritesTVSeries.push(tvSeriesId);
      }
      localStorage.setItem('favoritesTVSeries', JSON.stringify(favoritesTVSeries));
      console.log('Favorites TV Series updated successfully in localStorage');
      await checkAndUpdateFavoriteButtonTVSeries();
      return;
    }

    if (!db) await loadFirebaseConfig();

    const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(usersRef);

    let userDocRef;
    if (querySnapshot.empty) {
      console.log('Signed-in user does not have a Firestore document.');
      return;
    } else {
      userDocRef = doc(db, 'MovieVerseUsers', querySnapshot.docs[0].id);
    }

    const userData = querySnapshot.docs[0].data();
    let favoritesTVSeries = userData.favoritesTVSeries || [];

    if (favoritesTVSeries.includes(tvSeriesId)) {
      favoritesTVSeries = favoritesTVSeries.filter(id => id !== tvSeriesId);
    } else {
      favoritesTVSeries.push(tvSeriesId);
    }

    await updateDoc(userDocRef, { favoritesTVSeries });
    console.log('Favorites TV Series updated successfully in Firestore');
    await checkAndUpdateFavoriteButtonTVSeries();
    window.location.reload();
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for favorites.');
      let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
      if (favoritesTVSeries.includes(tvSeriesId)) {
        favoritesTVSeries = favoritesTVSeries.filter(id => id !== tvSeriesId);
      } else {
        favoritesTVSeries.push(tvSeriesId);
      }
      localStorage.setItem('favoritesTVSeries', JSON.stringify(favoritesTVSeries));
      console.log('Favorites TV Series updated successfully in localStorage');
    } else {
      console.error('An error occurred:', error);
    }
    window.location.reload();
  }
}

export async function checkAndUpdateFavoriteButtonTVSeries() {
  let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

  try {
    if (!tvSeriesId) {
      console.log('TV Series ID is missing');
      return;
    }

    let favoritesTVSeries = [];

    if (userEmail) {
      if (!db) await loadFirebaseConfig();
      const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', userEmail));
      const querySnapshot = await getDocs(usersRef);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        favoritesTVSeries = userData.favoritesTVSeries || [];
      }
    } else {
      favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
    }

    updateFavoriteButtonTVSeries(tvSeriesId, favoritesTVSeries);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for favorites.');
      let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
      updateFavoriteButtonTVSeries(tvSeriesId, favoritesTVSeries);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

function updateFavoriteButtonTVSeries(tvSeriesId, favoritesTVSeries) {
  const favoriteBtn = document.getElementById('favorite-btn');

  if (favoritesTVSeries.includes(tvSeriesId)) {
    favoriteBtn.classList.add('favorited');
    favoriteBtn.title = 'Remove from Favorites';
    favoriteBtn.style.backgroundColor = 'grey';
  } else {
    favoriteBtn.classList.remove('favorited');
    favoriteBtn.title = 'Add to Favorites';
    favoriteBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  }
}
