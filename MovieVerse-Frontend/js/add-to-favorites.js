import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, doc, setDoc, collection, updateDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { app, db } from './firebase.js';

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
            const localFavorites = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
            updateFavoriteButton(movieId, localFavorites);
            return;
        }

        const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(usersRef);

        if (querySnapshot.empty) {
            console.log('No user found with that email');
            return;
        }

        const userData = querySnapshot.docs[0].data();
        const favorites = userData.favoritesMovies || [];

        updateFavoriteButton(movieId, favorites);
    }
    catch (error) {
        if (error.code === 'resource-exhausted') {
            console.log('Firebase quota exceeded. Checking local storage for favorites.');
            const localFavorites = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
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
    }
    else {
        favoriteButton.classList.remove('favorited');
        favoriteButton.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        favoriteButton.title = 'Add to favorites';
    }
}

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

async function getMovieGenre(movieId) {
    const tmdbUrl = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${getMovieCode()}`;
    const response = await fetch(tmdbUrl);
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
            let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
            let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

            if (favoritesMovies.includes(movieId)) {
                favoritesMovies = favoritesMovies.filter(id => id !== movieId);
                favoriteGenres = favoriteGenres.filter(genre => favoritesMovies.some(id => {
                    const movieDetails = JSON.parse(localStorage.getItem(id));
                    return movieDetails && movieDetails.genre === genre;
                }));
            }
            else {
                favoritesMovies.push(movieId);
                if (!favoriteGenres.includes(movieGenre)) {
                    favoriteGenres.push(movieGenre);
                }
            }

            localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
            localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));

            console.log('Favorites movies updated successfully in localStorage');
            window.location.reload();
            return;
        }

        const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(usersRef);

        let userDocRef;

        if (querySnapshot.empty && userEmail === "") {
            const newUserRef = doc(collection(db, "MovieVerseUsers"));
            userDocRef = newUserRef;
            await setDoc(newUserRef, {email: userEmail, favoritesMovies: [movieId]});
            console.log('New user created with favorite movie.');
        }
        else if (!querySnapshot.empty) {
            userDocRef = doc(db, "MovieVerseUsers", querySnapshot.docs[0].id);
        }
        else {
            console.log('No user found with that email and user is supposed to be signed in.');
            return;
        }

        if (userDocRef) {
            const userData = querySnapshot.empty ? {favoritesMovies: []} : querySnapshot.docs[0].data();
            let favoritesMovies = userData.favoritesMovies || [];
            let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

            if (favoritesMovies.includes(movieId)) {
                favoritesMovies = favoritesMovies.filter(id => id !== movieId);
                favoriteGenres = favoriteGenres.filter(genre => favoritesMovies.some(id => {
                    const movieDetails = JSON.parse(localStorage.getItem(id));
                    return movieDetails && movieDetails.genre === genre;
                }));
            }
            else {
                favoritesMovies.push(movieId);
                if (!favoriteGenres.includes(movieGenre)) {
                    favoriteGenres.push(movieGenre);
                }
            }

            await updateDoc(userDocRef, {favoritesMovies});
            localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));
            console.log('Favorites movies updated successfully in Firestore');
        }
    } catch (error) {
        if (error.code === 'resource-exhausted') {
            console.log('Firebase quota exceeded. Using localStorage for favorites.');
            let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
            let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];

            if (favoritesMovies.includes(movieId)) {
                favoritesMovies = favoritesMovies.filter(id => id !== movieId);
                favoriteGenres = favoriteGenres.filter(genre => favoritesMovies.some(id => {
                    const movieDetails = JSON.parse(localStorage.getItem(id));
                    return movieDetails && movieDetails.genre === genre;
                }));
            }
            else {
                favoritesMovies.push(movieId);
                if (!favoriteGenres.includes(movieGenre)) {
                    favoriteGenres.push(movieGenre);
                }
            }

            localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
            localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));

            console.log('Favorites movies updated successfully in localStorage');
            window.location.reload();
            return;
        } else {
            console.error('An error occurred:', error);
        }
    }

    window.location.reload();
}
