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

        const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(usersRef);

        let userDocRef;
        if (querySnapshot.empty) {
            console.log('Signed-in user does not have a Firestore document.');
            return;
        }
        else {
            userDocRef = doc(db, "MovieVerseUsers", querySnapshot.docs[0].id);
        }

        const userData = querySnapshot.docs[0].data();
        let favoritesTVSeries = userData.favoritesTVSeries || [];

        if (favoritesTVSeries.includes(tvSeriesId)) {
            favoritesTVSeries = favoritesTVSeries.filter(id => id !== tvSeriesId);
        }
        else {
            favoritesTVSeries.push(tvSeriesId);
        }

        await updateDoc(userDocRef, {favoritesTVSeries});
        console.log('Favorites TV Series updated successfully in Firestore');
        await checkAndUpdateFavoriteButtonTVSeries();
        window.location.reload();

    }
    catch (error) {
        if (error.code === 'resource-exhausted') {
            console.log('Firebase quota exceeded. Using localStorage for favorites.');
            let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
            if (favoritesTVSeries.includes(tvSeriesId)) {
                favoritesTVSeries = favoritesTVSeries.filter(id => id !== tvSeriesId);
            }
            else {
                favoritesTVSeries.push(tvSeriesId);
            }
            localStorage.setItem('favoritesTVSeries', JSON.stringify(favoritesTVSeries));
            console.log('Favorites TV Series updated successfully in localStorage');
        }
        else {
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
            const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", userEmail));
            const querySnapshot = await getDocs(usersRef);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                favoritesTVSeries = userData.favoritesTVSeries || [];
            }
        }
        else {
            favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
        }

        updateFavoriteButtonTVSeries(tvSeriesId, favoritesTVSeries);
    }
    catch (error) {
        if (error.code === 'resource-exhausted') {
            console.log('Firebase quota exceeded. Using localStorage for favorites.');
            let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
            updateFavoriteButtonTVSeries(tvSeriesId, favoritesTVSeries);
        }
        else {
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
    }
    else {
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.title = 'Add to Favorites';
        favoriteBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    }
}
