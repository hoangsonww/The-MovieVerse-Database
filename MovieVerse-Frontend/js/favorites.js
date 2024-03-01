import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, doc, setDoc, collection, updateDoc, getDocs, getDoc, query, where, orderBy, writeBatch, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

let initialMoviesSelection = [];
let initialTVSeriesSelection = [];

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

document.addEventListener("DOMContentLoaded", function() {
    loadWatchLists();
});

const tvCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(tvCode.part1) + atob(tvCode.part2) + atob(tvCode.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

document.addEventListener('DOMContentLoaded', function() {
    adjustButtonMargin();
    document.getElementById('how-to-use-btn').addEventListener('click', function() {
        let howToUseSection = document.getElementById('how-to-use-section');
        if (howToUseSection.style.display === 'none') {
            howToUseSection.style.display = 'block';
            window.location.href = '#how-to-use-section';
            document.getElementById('how-to-use-btn').textContent = 'Hide Tutorial';
            document.getElementById('how-to-use-btn').style.marginBottom = '0';
        }
        else {
            howToUseSection.style.display = 'none';
            document.getElementById('how-to-use-btn').textContent = 'How to Use';
            document.getElementById('how-to-use-btn').style.marginBottom = '180px';
        }
    });
});

function adjustButtonMargin() {
    let howToUseSection = document.getElementById('how-to-use-section');
    if (howToUseSection.style.display === 'none' || !howToUseSection.style.display) {
        document.getElementById('how-to-use-btn').style.marginBottom = '200px';
    }
    else {
        document.getElementById('how-to-use-btn').style.marginBottom = '0';
    }
}

function rotateUserStats() {
    const stats = [
        {
            label: "Your Current Time",
            getValue: () => {
                const now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return `${hours}:${minutes}`;
            }
        },
        { label: "Most Visited Movie", getValue: getMostVisitedMovie },
        { label: "Your Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Your Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Your Unique Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Your Favorited Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Your Most Common Favorited Genre",
            getValue: getMostCommonGenre
        },
        { label: "Your Created Watchlists", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Your Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Your Unique Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Your Unique Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
            }
        },
        {
            label: "Your Unique Production Companies Discovered",
            getValue: () => {
                const viewedCompanies = JSON.parse(localStorage.getItem('uniqueCompaniesViewed')) || [];
                return viewedCompanies.length;
            }
        },
        { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy },
    ];

    let currentStatIndex = 0;

    function updateStatDisplay() {
        const currentStat = stats[currentStatIndex];
        document.getElementById('stats-label').textContent = currentStat.label + ':';
        document.getElementById('stats-display').textContent = currentStat.getValue();
        currentStatIndex = (currentStatIndex + 1) % stats.length;
    }

    updateStatDisplay();

    const localTimeDiv = document.getElementById('local-time');
    let statRotationInterval = setInterval(updateStatDisplay, 3000);

    localTimeDiv.addEventListener('click', () => {
        clearInterval(statRotationInterval);
        updateStatDisplay();
        statRotationInterval = setInterval(updateStatDisplay, 3000);
    });
}

function updateMovieVisitCount(movieId, movieTitle) {
    let movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
    if (!movieVisits[movieId]) {
        movieVisits[movieId] = { count: 0, title: movieTitle };
    }
    movieVisits[movieId].count += 1;
    localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
}

function getMostVisitedMovie() {
    const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
    let mostVisitedMovie = '';
    let maxVisits = 0;

    for (const movieId in movieVisits) {
        if (movieVisits[movieId].count > maxVisits) {
            mostVisitedMovie = movieVisits[movieId].title;
            maxVisits = movieVisits[movieId].count;
        }
    }

    return mostVisitedMovie || 'Not Available';
}

function getMostVisitedActor() {
    const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    let mostVisitedActor = '';
    let maxVisits = 0;

    for (const actorId in actorVisits) {
        if (actorVisits[actorId].count > maxVisits) {
            mostVisitedActor = actorVisits[actorId].name;
            maxVisits = actorVisits[actorId].count;
        }
    }

    return mostVisitedActor || 'Not Available';
}

function getMostVisitedDirector() {
    const directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
    let mostVisitedDirector = '';
    let maxVisits = 0;

    for (const directorId in directorVisits) {
        if (directorVisits[directorId].count > maxVisits) {
            mostVisitedDirector = directorVisits[directorId].name;
            maxVisits = directorVisits[directorId].count;
        }
    }

    return mostVisitedDirector || 'Not Available';
}

function getTriviaAccuracy() {
    let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || { totalCorrect: 0, totalAttempted: 0 };
    if (triviaStats.totalAttempted === 0) {
        return 'No trivia attempted';
    }
    let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
    return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
    const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || {};
    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in favoriteGenres) {
        if (favoriteGenres[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = favoriteGenres[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        fallbackMovieSelection();
    }
}

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = document.querySelectorAll('.close-button');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
});

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.getElementById('delete-watchlist-btn').addEventListener('click', () => openModal('delete-watchlist-modal'));

async function getMovieTitle(movieId) {
    const apiKey = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${apiKey}`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        return movie.title;
    }
    catch (error) {
        return 'Unknown Movie';
    }
}

async function populateCreateModalWithFavorites() {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser') || '';

    if (!currentUserEmail) {
        const favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        const favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];

        let container = document.getElementById('favorites-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'favorites-container';
            document.getElementById('create-watchlist-form').insertBefore(container, document.querySelector('button[type="submit"]'));
        }
        else {
            container.innerHTML = '';
        }

        let moviesLabel = document.createElement('label');
        moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
        container.appendChild(moviesLabel);

        let moviesContainer = document.createElement('div');
        moviesContainer.id = 'movies-container';
        moviesContainer.style.marginTop = '-20px';
        container.appendChild(moviesContainer);

        if (favoritesMovies.length === 0) {
            moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
        }
        else {
            for (const movieId of favoritesMovies) {
                const movieTitle = await getMovieTitle(movieId);
                appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies');
            }
        }

        let tvSeriesLabel = document.createElement('label');
        tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
        container.appendChild(tvSeriesLabel);

        let tvSeriesContainer = document.createElement('div');
        tvSeriesContainer.id = 'tvseries-container';
        tvSeriesContainer.style.marginTop = '-20px';
        container.appendChild(tvSeriesContainer);

        if (favoritesTVSeries.length === 0) {
            tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
        }
        else {
            for (const seriesId of favoritesTVSeries) {
                const seriesTitle = await getTVSeriesTitle(seriesId);
                appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries');
            }
        }
        return;
    }

    const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", currentUserEmail));
    const userSnapshot = await getDocs(usersRef);

    const createForm = document.getElementById('create-watchlist-form');

    let container = document.getElementById('favorites-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'favorites-container';
        createForm.insertBefore(container, createForm.querySelector('button[type="submit"]'));
    }
    else {
        container.innerHTML = '';
    }

    if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const favoritesMovies = userData.favoritesMovies || [];
        const favoritesTVSeries = userData.favoritesTVSeries || [];

        let moviesLabel = document.createElement('label');
        moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
        container.appendChild(moviesLabel);

        let moviesContainer = document.createElement('div');
        moviesContainer.id = 'movies-container';
        moviesContainer.style.marginTop = '-20px';
        container.appendChild(moviesContainer);

        if (favoritesMovies.length === 0) {
            moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
        }
        else {
            for (const movieId of favoritesMovies) {
                const movieTitle = await getMovieTitle(movieId);
                appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies');
            }
        }

        let tvSeriesLabel = document.createElement('label');
        tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
        container.appendChild(tvSeriesLabel);

        let tvSeriesContainer = document.createElement('div');
        tvSeriesContainer.id = 'tvseries-container';
        tvSeriesContainer.style.marginTop = '-20px';
        container.appendChild(tvSeriesContainer);

        if (favoritesTVSeries.length === 0) {
            tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
        }
        else {
            for (const seriesId of favoritesTVSeries) {
                const seriesTitle = await getTVSeriesTitle(seriesId);
                appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries');
            }
        }
    }
    else {
        container.innerHTML = '<p style="text-align: center">No favorites found. Please add some favorites first.</p>';
    }
}

document.getElementById('create-watchlist-form').addEventListener('submit', async function(e) {
    showSpinner();
    e.preventDefault();

    const name = document.getElementById('new-watchlist-name').value;
    const description = document.getElementById('new-watchlist-description').value;
    const selectedMovies = Array.from(document.querySelectorAll('#movies-container input:checked')).map(checkbox => checkbox.value);
    const selectedTVSeries = Array.from(document.querySelectorAll('#tvseries-container input:checked')).map(checkbox => checkbox.value);
    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const q = query(collection(db, "watchlists"), where("userEmail", "==", currentUserEmail));
    const querySnapshot = await getDocs(q);
    let maxOrder = querySnapshot.docs.reduce((max, docSnapshot) => Math.max(max, docSnapshot.data().order || 0), 0);

    if (currentUserEmail) {
        const newWatchlistRef = doc(collection(db, 'watchlists'));
        await setDoc(newWatchlistRef, {
            userEmail: currentUserEmail,
            name,
            description,
            movies: selectedMovies,
            tvSeries: selectedTVSeries,
            pinned: false,
            createdAt: new Date().toISOString(),
            order: maxOrder + 1,
        });
    }
    else {
        const localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        localWatchlists.push({
            id: `local-${new Date().getTime()}`,
            userEmail: "",
            name,
            description,
            movies: selectedMovies,
            tvSeries: selectedTVSeries,
            pinned: false,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
    }

    closeModal('create-watchlist-modal');
    loadWatchLists();
    hideSpinner();
    window.location.reload();
});

async function getTVSeriesTitle(seriesId) {
    const apiKey = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/tv/${seriesId}?${generateMovieNames()}${apiKey}`;

    try {
        const response = await fetch(url);
        const series = await response.json();
        return series.name;
    }
    catch (error) {
        return 'Unknown Series';
    }
}

function appendCheckbox(container, id, title, name, isChecked = false) {
    const item = document.createElement('div');
    item.classList.add('favorite-item');
    item.style.display = 'flex';
    item.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${name}-${id}`;
    checkbox.value = id;
    checkbox.name = name;
    checkbox.checked = isChecked;

    const label = document.createElement('label');
    label.htmlFor = `${name}-${id}`;
    label.textContent = title;
    label.style.marginTop = '12px';
    label.style.marginLeft = '10px';

    item.appendChild(checkbox);
    item.appendChild(label);
    container.appendChild(item);
}


document.getElementById('create-watchlist-btn').addEventListener('click', function() {
    document.getElementById('create-watchlist-form').reset();
    populateCreateModalWithFavorites();
    openModal('create-watchlist-modal');
    updateWatchlistsCreated();
});

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

document.getElementById('edit-watchlist-btn').addEventListener('click', async function() {
    await populateEditModal();
    openModal('edit-watchlist-modal');
});

async function populateEditModal() {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    let watchlists = [];
    let favoritesMovies = [];
    let favoritesTVSeries = [];

    if (currentUserEmail) {
        const qWatchlists = query(collection(db, "watchlists"), where("userEmail", "==", currentUserEmail));
        const qUsers = query(collection(db, "MovieVerseUsers"), where("email", "==", currentUserEmail));

        const [watchlistsSnapshot, usersSnapshot] = await Promise.all([
            getDocs(qWatchlists),
            getDocs(qUsers)
        ]);

        watchlists = watchlistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (!usersSnapshot.empty) {
            const userData = usersSnapshot.docs[0].data();
            favoritesMovies = userData.favoritesMovies || [];
            favoritesTVSeries = userData.favoritesTVSeries || [];
        }
    }
    else {
        watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        favoritesMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
    }

    const editForm = document.getElementById('edit-watchlist-form');
    editForm.innerHTML = '';

    if (watchlists.length === 0) {
        const noWatchlistMsg = document.createElement('div');
        noWatchlistMsg.textContent = 'No Watchlists Available for Edit';
        noWatchlistMsg.style.textAlign = 'center';
        noWatchlistMsg.style.marginTop = '30px';
        noWatchlistMsg.style.color = 'white';
        editForm.appendChild(noWatchlistMsg);
        return;
    }

    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Select A Watch List:';
    selectLabel.setAttribute("for", "watchlist-select");
    editForm.appendChild(selectLabel);

    const select = document.createElement('select');
    select.id = 'watchlist-select';
    select.style.font = 'inherit';
    watchlists.forEach((watchlist) => {
        const option = document.createElement('option');
        option.value = watchlist.id;
        option.textContent = watchlist.name;
        select.appendChild(option);
    });

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Watch List Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'edit-watchlist-name';
    nameInput.style.font = 'inherit';
    nameInput.placeholder = 'New Watchlist Name';

    const descLabel = document.createElement('label');
    descLabel.textContent = 'Description:';
    const descInput = document.createElement('textarea');
    descInput.id = 'edit-watchlist-description';
    descInput.style.font = 'inherit';
    descInput.placeholder = 'New Watchlist Description';

    const moviesContainer = document.createElement('div');
    moviesContainer.id = 'edit-movies-container';
    const moviesLabel = document.createElement('label');
    moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
    editForm.appendChild(select);
    editForm.appendChild(nameLabel);
    editForm.appendChild(nameInput);
    editForm.appendChild(descLabel);
    editForm.appendChild(descInput);
    editForm.appendChild(moviesLabel);
    editForm.appendChild(moviesContainer);

    const tvSeriesContainer = document.createElement('div');
    tvSeriesContainer.id = 'edit-tvseries-container';
    const tvSeriesLabel = document.createElement('label');
    tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
    tvSeriesLabel.style.marginTop = '20px';
    editForm.appendChild(tvSeriesLabel);
    editForm.appendChild(tvSeriesContainer);

    const updateForm = async (watchlist) => {
        nameInput.value = watchlist.name;
        descInput.value = watchlist.description;
        moviesContainer.innerHTML = '';
        tvSeriesContainer.innerHTML = '';

        initialMoviesSelection = watchlist.movies.slice();
        initialTVSeriesSelection = watchlist.tvSeries.slice();

        if (!favoritesMovies || favoritesMovies.length === 0) {
            moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
        }
        else {
            for (const movieId of favoritesMovies) {
                const movieTitle = await getMovieTitle(movieId);
                const isChecked = watchlist.movies.includes(movieId);
                appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies', isChecked);
            }
        }

        if (!favoritesTVSeries || favoritesTVSeries.length === 0) {
            tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
        }
        else {
            for (const seriesId of favoritesTVSeries) {
                const seriesTitle = await getTVSeriesTitle(seriesId);
                const isChecked = watchlist.tvSeries.includes(seriesId);
                appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries', isChecked);
            }
        }
    };

    select.addEventListener('change', function () {
        const selectedWatchlist = watchlists.find(watchlist => watchlist.id === this.value);
        updateForm(selectedWatchlist);
    });

    selectLabel.addEventListener('click', function () {
        updateForm(watchlists[select.value]);
    });

    if (watchlists.length > 0) {
        updateForm(watchlists[0]);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Changes';
    editForm.appendChild(submitButton);

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel Changes';
    cancelButton.style.marginTop = '20px';
    cancelButton.onclick = () => closeModal('edit-watchlist-modal');
    editForm.appendChild(cancelButton);
}

document.getElementById('edit-watchlist-form').addEventListener('submit', async function(e) {
    showSpinner();

    e.preventDefault();

    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const selectedOption = document.getElementById('watchlist-select');
    const watchlistId = selectedOption.value;
    const newName = document.getElementById('edit-watchlist-name').value;
    const newDescription = document.getElementById('edit-watchlist-description').value;

    let selectedMovies;
    let selectedTVSeries;

    const currentMoviesSelection = Array.from(document.querySelectorAll('#edit-movies-container input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const currentTVSeriesSelection = Array.from(document.querySelectorAll('#edit-tvseries-container input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    const moviesSelectionChanged = !(initialMoviesSelection.length === currentMoviesSelection.length && initialMoviesSelection.every(value => currentMoviesSelection.includes(value)));
    const tvSeriesSelectionChanged = !(initialTVSeriesSelection.length === currentTVSeriesSelection.length && initialTVSeriesSelection.every(value => currentTVSeriesSelection.includes(value)));

    if (moviesSelectionChanged) {
        selectedMovies = currentMoviesSelection;
    }
    else {
        selectedMovies = initialMoviesSelection;
    }

    if (tvSeriesSelectionChanged) {
        selectedTVSeries = currentTVSeriesSelection;
    }
    else {
        selectedTVSeries = initialTVSeriesSelection;
    }

    if (currentUserEmail) {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        await updateDoc(watchlistRef, {
            name: newName,
            description: newDescription,
            movies: selectedMovies,
            tvSeries: selectedTVSeries
        });
    }
    else {
        let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        let watchlistIndex = localWatchlists.findIndex(watchlist => watchlist.id === watchlistId);
        if (watchlistIndex !== -1) {
            localWatchlists[watchlistIndex] = {
                ...localWatchlists[watchlistIndex],
                name: newName,
                description: newDescription,
                movies: selectedMovies,
                tvSeries: selectedTVSeries
            };
            localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
        }
    }

    closeModal('edit-watchlist-modal');
    loadWatchLists();
    hideSpinner();
    window.location.reload();
});

async function populateDeleteModal() {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    const deleteForm = document.getElementById('delete-watchlist-form');
    deleteForm.innerHTML = '';

    let watchlists = [];

    if (currentUserEmail) {
        const q = query(collection(db, "watchlists"), where("userEmail", "==", currentUserEmail));
        const querySnapshot = await getDocs(q);
        watchlists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    else {
        watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
    }

    if (watchlists.length === 0) {
        deleteForm.innerHTML = '<p style="margin-top: 20px">No Watchlists Available to Delete.</p>';
        return;
    }

    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.id = 'delete-watchlist-checkboxes-container';

    watchlists.forEach(watchlist => {
        appendCheckbox(checkboxesContainer, watchlist.id, watchlist.name, 'watchlistToDelete');
    });

    deleteForm.appendChild(checkboxesContainer);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete Selected';
    deleteButton.onclick = deleteSelectedWatchlists;
    deleteForm.appendChild(deleteButton);
}

async function deleteSelectedWatchlists() {
    showSpinner();
    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const selectedCheckboxes = document.querySelectorAll('#delete-watchlist-checkboxes-container input[type="checkbox"]:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

    if (currentUserEmail) {
        for (const id of selectedIds) {
            await deleteDoc(doc(db, 'watchlists', id));
        }
    }
    else {
        let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        watchlists = watchlists.filter(watchlist => !selectedIds.includes(watchlist.id));
        localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
    }

    closeModal('delete-watchlist-modal');
    loadWatchLists();
    hideSpinner();
    window.location.reload();
}

document.getElementById('delete-watchlist-btn').addEventListener('click', populateDeleteModal);

// async function updateWatchListsDisplay() {
//     const watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
//     const displaySection = document.getElementById('watchlists-display-section');
//     displaySection.innerHTML = '';
//
//     if (watchlists.length === 0) {
//         displaySection.innerHTML = '<p>No watch lists found. Start adding movies and TV series to your watchlists.</p>';
//         return;
//     }
//
//     for (const watchlist of watchlists) {
//         const watchlistDiv = document.createElement('div');
//         watchlistDiv.className = 'watchlist';
//
//         const title = document.createElement('h3');
//         title.innerText = watchlist.name;
//
//         const description = document.createElement('p');
//         description.innerText = watchlist.description;
//
//         watchlistDiv.appendChild(title);
//         watchlistDiv.appendChild(description);
//
//         if (watchlist.movies && watchlist.movies.length > 0) {
//             const moviesContainer = document.createElement('div');
//             for (const movieId of watchlist.movies) {
//                 const movieCard = await fetchMovieDetails(movieId);
//                 moviesContainer.appendChild(movieCard);
//             }
//             watchlistDiv.appendChild(moviesContainer);
//         }
//
//         if (watchlist.tvSeries && watchlist.tvSeries.length > 0) {
//             const seriesContainer = document.createElement('div');
//             for (const seriesId of watchlist.tvSeries) {
//                 const seriesCard = await fetchTVSeriesDetails(seriesId);
//                 seriesContainer.appendChild(seriesCard);
//             }
//             watchlistDiv.appendChild(seriesContainer);
//         }
//
//         displaySection.appendChild(watchlistDiv);
//     }
// }

async function fetchMovieDetails(movieId) {
    const code = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        return createMovieCard(movie);
    }
    catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error loading movie card. Please try refreshing the page.';
        return errorDiv;
    }
}

function createMovieCard(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.style.cursor = 'pointer';

    movieEl.innerHTML = `
                <img src="${IMGPATH + movie.poster_path}" alt="${movie.title}" style="cursor: pointer">
                <div class="movie-info" style="cursor: pointer">
                    <h3>${movie.title}</h3>
                    <span class="${getClassByRate(movie.vote_average.toFixed(1))}">${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="overview">
                    <h4>Movie Overview:</h4>
                    ${movie.overview}
                </div>`;
    movieEl.addEventListener('click', () => {
        localStorage.setItem('selectedMovieId', movie.id);
        window.location.href = 'movie-details.html';
        updateMovieVisitCount(movie.id, movie.title);
    });

    return movieEl;
}

function getClassByRate(vote){
    if (vote >= 8) {
        return 'green';
    }
    else if (vote >= 5) {
        return 'orange';
    }
    else {
        return 'red';
    }
}

const searchForm = document.getElementById('form');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'search.html';
});

function handleSearch() {
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'search.html';
}

async function getMovies(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    let allMovies = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();
        allMovies = allMovies.concat(data.results);
    }

    const popularityThreshold = 0.5;

    allMovies.sort((a, b) => {
        const popularityDifference = Math.abs(a.popularity - b.popularity);
        if (popularityDifference < popularityThreshold) {
            return b.vote_average - a.vote_average;
        }
        return b.popularity - a.popularity;
    });

    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies));
    }
    else {
        searchResultsMain.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }
}

function showMovies(movies){
    searchResultsMain.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        const voteAverage = vote_average.toFixed(1);
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAverage}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Overview: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
            updateMovieVisitCount(id, title);
        });

        searchResultsMain.appendChild(movieE1);
    });
}

function calculateMoviesToDisplay() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 689.9) return 10;
    if (screenWidth <= 1021.24) return 20;
    if (screenWidth <= 1353.74) return 21;
    if (screenWidth <= 1684.9) return 20;
    if (screenWidth <= 2017.49) return 20;
    if (screenWidth <= 2349.99) return 18;
    if (screenWidth <= 2681.99) return 21;
    if (screenWidth <= 3014.49) return 24;
    if (screenWidth <= 3345.99) return 27;
    if (screenWidth <= 3677.99) return 20;
    if (screenWidth <= 4009.99) return 22;
    if (screenWidth <= 4340.99) return 24;
    if (screenWidth <= 4673.49) return 26;
    if (screenWidth <= 5005.99) return 28;
    if (screenWidth <= 5337.99) return 30;
    if (screenWidth <= 5669.99) return 32;
    if (screenWidth <= 6001.99) return 34;
    if (screenWidth <= 6333.99) return 36;
    if (screenWidth <= 6665.99) return 38;
    if (screenWidth <= 6997.99) return 40;
    if (screenWidth <= 7329.99) return 42;
    if (screenWidth <= 7661.99) return 44;
    if (screenWidth <= 7993.99) return 46;
    if (screenWidth <= 8325.99) return 48;
    return 20;
}

function handleSignInOut() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    if (isSignedIn) {
        localStorage.setItem('isSignedIn', JSON.stringify(false));
        alert('You have been signed out.');
    }
    else {
        window.location.href = 'sign-in.html';
        return;
    }

    updateSignInButtonState();
}

function updateSignInButtonState() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    const signInText = document.getElementById('signInOutText');
    const signInIcon = document.getElementById('signInIcon');
    const signOutIcon = document.getElementById('signOutIcon');

    if (isSignedIn) {
        signInText.textContent = 'Sign Out';
        signInIcon.style.display = 'none';
        signOutIcon.style.display = 'inline-block';
    }
    else {
        signInText.textContent = 'Sign In';
        signInIcon.style.display = 'inline-block';
        signOutIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButtonState();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

async function loadWatchLists() {
    showSpinner();

    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const displaySection = document.getElementById('watchlists-display-section');

    if (currentUserEmail) {
        const q = query(collection(db, "watchlists"), where("userEmail", "==", currentUserEmail));
        const querySnapshot = await getDocs(q);
        const watchlists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (watchlists.length === 0) {
            displaySection.innerHTML = '<p style="text-align: center">No watch lists found. Click on "Create a Watch List" to start adding movies.</p>';
        }
        else {
            watchlists.sort((a, b) => a.order - b.order);
            watchlists.sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);
            for (const watchlist of watchlists) {
                const watchlistDiv = await createWatchListDiv(watchlist);
                if (watchlist.pinned) {
                    watchlistDiv.classList.add('pinned');
                }
                displaySection.appendChild(watchlistDiv);
            }
        }
    }
    else {
        let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        if (localWatchlists.length === 0) {
            displaySection.innerHTML = '<p style="text-align: center">No watch lists found. Start by adding movies to your watchlist.</p>';
        }
        else {
            localWatchlists.sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);
            for (const watchlist of localWatchlists) {
                const watchlistDiv = await createWatchListDiv(watchlist);
                if (watchlist.pinned) {
                    watchlistDiv.classList.add('pinned');
                }
                displaySection.appendChild(watchlistDiv);
            }
        }
    }

    let favorites = [];
    let favoritesTVSeries = [];
    if (currentUserEmail) {
        const usersRef = query(collection(db, "MovieVerseUsers"), where("email", "==", currentUserEmail));
        const userSnapshot = await getDocs(usersRef);

        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            favorites = userData.favoritesMovies || [];
            favoritesTVSeries = userData.favoritesTVSeries || [];
        }
    }
    else {
        favorites = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
        favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
    }

    if (favorites.length > 0) {
        const favoritesDiv = document.createElement('div');
        favoritesDiv.className = 'watchlist';
        favoritesDiv.id = 'favorites-watchlist';

        const title = document.createElement('h3');
        title.textContent = "Favorite Movies";
        title.className = 'watchlist-title';

        const description = document.createElement('p');
        description.textContent = "A collection of your favorite movies.";
        description.className = 'watchlist-description';

        favoritesDiv.appendChild(title);
        favoritesDiv.appendChild(description);

        const moviesContainer = document.createElement('div');
        moviesContainer.className = 'movies-container';

        for (const movieId of favorites) {
            const movieCard = await fetchMovieDetails(movieId);
            moviesContainer.appendChild(movieCard);
        }

        favoritesDiv.appendChild(moviesContainer);
        displaySection.appendChild(favoritesDiv);
    }
    else {
        const favoritesDiv = document.createElement('div');
        favoritesDiv.className = 'watchlist';
        favoritesDiv.id = 'favorites-watchlist';
        favoritesDiv.innerHTML = '<div style="text-align: center"><h3 style="text-align: center; font-size: 24px; color: #ff8623">Favorite Movies</h3><p style="text-align: center">No favorite movies added yet.</p></div>';
        displaySection.appendChild(favoritesDiv);
    }

    if (favoritesTVSeries.length > 0) {
        const favoritesDiv = document.createElement('div');
        favoritesDiv.className = 'watchlist';
        favoritesDiv.id = 'favorites-tvseries-watchlist';

        const title = document.createElement('h3');
        title.textContent = "Favorite TV Series";
        title.className = 'watchlist-title';

        const description = document.createElement('p');
        description.textContent = "A collection of your favorite TV series.";
        description.className = 'watchlist-description';

        favoritesDiv.appendChild(title);
        favoritesDiv.appendChild(description);

        const moviesContainer = document.createElement('div');
        moviesContainer.className = 'movies-container';

        for (const tvSeriesId of favoritesTVSeries) {
            const tvSeriesCard = await fetchTVSeriesDetails(tvSeriesId);
            moviesContainer.appendChild(tvSeriesCard);
        }

        favoritesDiv.appendChild(moviesContainer);
        displaySection.appendChild(favoritesDiv);
    }
    else {
        const favoritesDiv = document.createElement('div');
        favoritesDiv.className = 'watchlist';
        favoritesDiv.id = 'favorites-tvseries-watchlist';
        favoritesDiv.innerHTML = '<div style="text-align: center"><h3 style="text-align: center; font-size: 24px; color: #ff8623">Favorite TV Series</h3><p style="text-align: center">No favorite TV series added yet.</p></div>';
        displaySection.appendChild(favoritesDiv);
    }

    hideSpinner();
}

async function fetchTVSeriesDetails(tvSeriesId) {
    const code = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        return createTVSeriesCard(movie);
    }
    catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error loading movie details. Please try refreshing the page.';
        return errorDiv;
    }
}

function createTVSeriesCard(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.style.cursor = 'pointer';

    movieEl.innerHTML = `
                <img src="${IMGPATH + movie.poster_path}" alt="${movie.title}" style="cursor: pointer">
                <div class="movie-info" style="cursor: pointer">
                    <h3>${movie.name}</h3>
                    <span class="${getClassByRate(movie.vote_average.toFixed(1))}">${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="overview">
                    <h4>Movie Overview:</h4>
                    ${movie.overview}
                </div>`;
    movieEl.addEventListener('click', () => {
        localStorage.setItem('selectedTvSeriesId', movie.id);
        window.location.href = 'tv-details.html';
        updateMovieVisitCount(movie.id, movie.title);
    });

    return movieEl;
}

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

async function isListPinned(watchlistId) {
    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    if (currentUserEmail) {
        try {
            const watchlistRef = doc(db, 'watchlists', watchlistId);
            const watchlistDoc = await getDoc(watchlistRef);
            if (watchlistDoc.exists()) {
                const watchlistData = watchlistDoc.data();
                return watchlistData.pinned || false;
            }
            else {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    }
    else {
        const watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        const watchlist = watchlists.find(watchlist => watchlist.id === watchlistId);
        return watchlist ? watchlist.pinned : false;
    }
}

function addWatchListControls(watchlistDiv, watchlistId) {
    if (!watchlistId) {
        return;
    }

    const controlContainer = document.createElement('div');
    controlContainer.className = 'watchlist-controls';

    const pinBtn = document.createElement('button');
    pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';

    isListPinned(watchlistId).then(isPinned => {
        pinBtn.title = isPinned ? 'Unpin this watch list' : 'Pin this watch list';
        pinBtn.style.color = isPinned ? '#7378c5' : '#ff8623';
        pinBtn.onclick = function() { pinWatchList(watchlistDiv, watchlistId); };
    });

    const moveUpBtn = document.createElement('button');
    moveUpBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    moveUpBtn.onclick = function() { moveWatchList(watchlistDiv, true); };

    const moveDownBtn = document.createElement('button');
    moveDownBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
    moveDownBtn.onclick = function() { moveWatchList(watchlistDiv, false); };

    controlContainer.appendChild(pinBtn);
    controlContainer.appendChild(moveUpBtn);
    controlContainer.appendChild(moveDownBtn);
    watchlistDiv.appendChild(controlContainer);
}

function createWatchListDiv(watchlist) {
    const watchlistDiv = document.createElement('div');
    watchlistDiv.className = 'watchlist';
    watchlistDiv.setAttribute('data-watchlist-id', watchlist.id);

    const title = document.createElement('h3');
    title.textContent = watchlist.name;
    title.className = 'watchlist-title';

    const description = document.createElement('p');
    description.textContent = watchlist.description;
    description.className = 'watchlist-description';

    watchlistDiv.appendChild(title);
    watchlistDiv.appendChild(description);

    const moviesContainer = document.createElement('div');
    moviesContainer.className = 'movies-container';
    moviesContainer.style.flexWrap = 'wrap';

    if (watchlist.movies === undefined) {
        moviesContainer.innerHTML = '';
    }
    else {
        watchlist.movies.forEach(movieId => {
            fetchMovieDetails(movieId).then(movieCard => moviesContainer.appendChild(movieCard));
        });
    }

    if (watchlist.tvSeries === undefined) {
        moviesContainer.innerHTML = '';
    }
    else {
        watchlist.tvSeries.forEach(tvSeriesId => {
            fetchTVSeriesDetails(tvSeriesId).then(tvSeriesCard => moviesContainer.appendChild(tvSeriesCard));
        });
    }

    watchlistDiv.appendChild(moviesContainer);
    addWatchListControls(watchlistDiv, watchlist.id);
    return watchlistDiv;
}

function updateWatchlistsOrderInLS() {
    const watchlistsDivs = document.querySelectorAll('#watchlists-display-section > .watchlist');
    let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
    const newOrder = Array.from(watchlistsDivs).map(div => div.getAttribute('data-watchlist-id'));

    watchlists.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
    localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
}

async function moveWatchList(watchlistDiv, moveUp) {
    showSpinner();

    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const watchlistId = watchlistDiv.getAttribute('data-watchlist-id');

    if (currentUserEmail) {
        try {
            const watchlistsQuery = query(collection(db, "watchlists"), where("userEmail", "==", currentUserEmail), orderBy("order", "asc"));
            const snapshot = await getDocs(watchlistsQuery);
            let watchlists = snapshot.docs.map(doc => {
                return { docId: doc.id, ...doc.data() };
            });

            const index = watchlists.findIndex(watchlist => watchlist.docId === watchlistId);

            if (index === -1 || watchlists.length < 2) {
                hideSpinner();
                return;
            }

            const swapIndex = moveUp ? index - 1 : index + 1;
            if (swapIndex < 0 || swapIndex >= watchlists.length) {
                hideSpinner();
                return;
            }

            let currentOrder = watchlists[index].order;
            let swapOrder = watchlists[swapIndex].order;

            const batch = writeBatch(db);
            batch.update(doc(db, "watchlists", watchlists[index].docId), { order: swapOrder });
            batch.update(doc(db, "watchlists", watchlists[swapIndex].docId), { order: currentOrder });

            await batch.commit();
        }
        catch (error) {
            hideSpinner();
        }
        hideSpinner();
    }
    else {
        const sibling = moveUp ? watchlistDiv.previousElementSibling : watchlistDiv.nextElementSibling;
        if (sibling) {
            const parent = watchlistDiv.parentNode;
            if (moveUp) {
                parent.insertBefore(watchlistDiv, sibling);
            }
            else {
                parent.insertBefore(sibling, watchlistDiv);
            }
            updateWatchlistsOrderInLS();
        }
        hideSpinner();
    }

    loadWatchLists();
    window.location.reload();
}

async function pinWatchList(watchlistDiv, watchlistId) {
    showSpinner();
    const isPinned = watchlistDiv.classList.contains('pinned');
    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    if (currentUserEmail) {
        const watchlistRef = doc(db, 'watchlists', watchlistId);
        await updateDoc(watchlistRef, {
            pinned: !isPinned
        });
        hideSpinner();
    }
    else {
        let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
        watchlists.forEach(watchlist => {
            if (watchlist.id === watchlistId) {
                watchlist.pinned = !isPinned;
            }
        });

        localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
        hideSpinner();
    }

    loadWatchLists();
    window.location.reload();
}

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

document.addEventListener('DOMContentLoaded', () => {
    applySettings();

    function applySettings() {
        const savedBg = localStorage.getItem('backgroundImage');
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');

        if (savedBg) {
            document.body.style.backgroundImage = `url('${savedBg}')`;
        }
        if (savedTextColor) {
            document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
                element.style.color = savedTextColor;
            });
        }
        if (savedFontSize) {
            const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
            document.body.style.fontSize = size;
        }
    }
});

function updateWatchlistsCreated() {
    let watchlistsCount = parseInt(localStorage.getItem('watchlistsCreated')) || 0;
    watchlistsCount++;
    localStorage.setItem('watchlistsCreated', watchlistsCount.toString());
}
