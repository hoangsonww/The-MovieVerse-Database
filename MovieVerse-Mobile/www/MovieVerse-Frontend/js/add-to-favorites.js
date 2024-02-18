import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, doc, setDoc, collection, updateDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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

export async function checkAndUpdateFavoriteButton() {
    let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const movieId = localStorage.getItem('selectedMovieId');

    if (!movieId) {
        console.error('Movie ID is missing');
        return;
    }

    if (!userEmail) {
        console.log('User is not signed in. Checking local storage for favorites.');
        const localFavorites = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        updateFavoriteButton(movieId, localFavorites);
        return;
    }

    const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(usersRef);

    if (querySnapshot.empty) {
        console.error('No user found with that email');
        return;
    }

    const userData = querySnapshot.docs[0].data();
    const favorites = userData.favoritesMovies || [];

    updateFavoriteButton(movieId, favorites);
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
        favoriteButton.style.background = 'transparent';
        favoriteButton.title = 'Add to favorites';
    }
}

export async function toggleFavorite() {
    let userEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const movieId = localStorage.getItem('selectedMovieId');

    if (!movieId) {
        console.error('Movie ID is missing');
        return;
    }

    if (!userEmail) {
        console.log('User is not signed in. Using localStorage for favorites.');
        let favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        if (favoritesMovies.includes(movieId)) {
            favoritesMovies = favoritesMovies.filter(id => id !== movieId);
        }
        else {
            favoritesMovies.push(movieId);
        }
        localStorage.setItem('favoritesMovies', JSON.stringify(favoritesMovies));
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
        await setDoc(newUserRef, { email: userEmail, favoritesMovies: [movieId] });
        console.log('New user created with favorite movie.');
    }
    else if (!querySnapshot.empty) {
        userDocRef = doc(db, "MovieVerseUsers", querySnapshot.docs[0].id);
    }
    else {
        console.error('No user found with that email and user is supposed to be signed in.');
        return;
    }

    if (userDocRef) {
        const userData = querySnapshot.empty ? { favoritesMovies: [] } : querySnapshot.docs[0].data();
        let favoritesMovies = userData.favoritesMovies || [];

        if (favoritesMovies.includes(movieId)) {
            favoritesMovies = favoritesMovies.filter(id => id !== movieId);
        }
        else {
            favoritesMovies.push(movieId);
        }

        await updateDoc(userDocRef, { favoritesMovies });
        console.log('Favorites movies updated successfully in Firestore');
    }

    window.location.reload();
}
