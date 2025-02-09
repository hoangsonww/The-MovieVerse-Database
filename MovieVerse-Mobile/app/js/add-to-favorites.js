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

export async function checkAndUpdateFavoriteButton() {
  let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  const movieId = localStorage.getItem('selectedMovieId');

  if (!movieId) {
    console.log('Movie ID is missing');
    return;
  }

  try {
    if (!userEmail) {
      console.log('User is not signed in. Checking local storage for favorites.');
      const localFavorites = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      updateFavoriteButton(movieId, localFavorites);
      return;
    }
    if (!db) await loadFirebaseConfig();

    const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(usersRef);

    if (querySnapshot.empty) {
      console.log('No user found with that email');
      return;
    }

    const userData = querySnapshot.docs[0].data();
    const favorites = userData.favoritesMovies || [];

    updateFavoriteButton(movieId, favorites);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Checking local storage for favorites.');
      const localFavorites = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      updateFavoriteButton(movieId, localFavorites);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

function updateFavoriteButton(movieId, favorites) {
  const favoriteButton = document.getElementById('favorite-btn');

  if (favorites.includes(movieId)) {
    favoriteButton.classList.add('favorited');
    favoriteButton.style.backgroundColor = 'grey';
    favoriteButton.title = 'Remove from favorites';
  } else {
    favoriteButton.classList.remove('favorited');
    favoriteButton.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    favoriteButton.title = 'Add to favorites';
  }
}

async function getMovieGenre(movieId) {
  const token = localStorage.getItem('movieverseToken');
  const tmdbUrl = `https://api-movieverse.vercel.app/api/3/movie/${movieId}`;
  const response = await fetch(tmdbUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const movieData = await response.json();
  return movieData.genres.length > 0 ? movieData.genres[0].name : 'Unknown';
}

export async function toggleFavorite() {
  let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  const movieId = localStorage.getItem('selectedMovieId');

  if (!movieId) {
    console.log('Movie ID is missing');
    return;
  }

  const movieGenre = await getMovieGenre(movieId);

  try {
    if (!userEmail) {
      console.log('User is not signed in. Using localStorage for favorites.');
      let favoritesMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

      if (favoritesMovies.includes(movieId)) {
        favoritesMovies = favoritesMovies.filter(id => id !== movieId);
        favoriteGenres = favoriteGenres.filter(genre =>
          favoritesMovies.some(id => {
            const movieDetails = JSON.parse(localStorage.getItem(id));
            return movieDetails && movieDetails.genre === genre;
          })
        );
      } else {
        favoritesMovies.push(movieId);
        if (!favoriteGenres.includes(movieGenre)) {
          favoriteGenres.push(movieGenre);
        }
      }

      localStorage.setItem('moviesFavorited', JSON.stringify(favoritesMovies));
      localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));

      console.log('Favorites movies updated successfully in localStorage');
      window.location.reload();
      return;
    }
    if (!db) await loadFirebaseConfig();

    const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(usersRef);

    let userDocRef;

    if (querySnapshot.empty && userEmail === '') {
      const newUserRef = doc(collection(db, 'MovieVerseUsers'));
      userDocRef = newUserRef;
      await setDoc(newUserRef, {
        email: userEmail,
        favoritesMovies: [movieId],
      });
      console.log('New user created with favorite movie.');
    } else if (!querySnapshot.empty) {
      userDocRef = doc(db, 'MovieVerseUsers', querySnapshot.docs[0].id);
    } else {
      console.log('No user found with that email and user is supposed to be signed in.');
      return;
    }

    if (userDocRef) {
      const userData = querySnapshot.empty ? { favoritesMovies: [] } : querySnapshot.docs[0].data();
      let favoritesMovies = userData.favoritesMovies || [];
      let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

      if (favoritesMovies.includes(movieId)) {
        favoritesMovies = favoritesMovies.filter(id => id !== movieId);
        favoriteGenres = favoriteGenres.filter(genre =>
          favoritesMovies.some(id => {
            const movieDetails = JSON.parse(localStorage.getItem(id));
            return movieDetails && movieDetails.genre === genre;
          })
        );
      } else {
        favoritesMovies.push(movieId);
        if (!favoriteGenres.includes(movieGenre)) {
          favoriteGenres.push(movieGenre);
        }
      }

      await updateDoc(userDocRef, { favoritesMovies });
      localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));
      console.log('Favorites movies updated successfully in Firestore');
    }

    updateMoviesFavorited(movieId);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for favorites.');
      let favoritesMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

      if (favoritesMovies.includes(movieId)) {
        favoritesMovies = favoritesMovies.filter(id => id !== movieId);
        favoriteGenres = favoriteGenres.filter(genre =>
          favoritesMovies.some(id => {
            const movieDetails = JSON.parse(localStorage.getItem(id));
            return movieDetails && movieDetails.genre === genre;
          })
        );
      } else {
        favoritesMovies.push(movieId);
        if (!favoriteGenres.includes(movieGenre)) {
          favoriteGenres.push(movieGenre);
        }
      }

      localStorage.setItem('moviesFavorited', JSON.stringify(favoritesMovies));
      localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));
      console.log('Favorites movies updated successfully in localStorage');
      window.location.reload();
      return;
    } else {
      console.error('An error occurred:', error);
    }

    updateMoviesFavorited(movieId);
  }
  window.location.reload();
}

function updateMoviesFavorited(movieId) {
  let favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
  if (!favoritedMovies.includes(movieId)) {
    favoritedMovies.push(movieId);
    localStorage.setItem('moviesFavorited', JSON.stringify(favoritedMovies));
  }
}
