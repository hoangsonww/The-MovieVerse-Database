const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");

const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const form = document.getElementById("form1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");

function updateBrowserURL(name) {
    const nameSlug = createNameSlug(name);
    const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + nameSlug;
    window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(name) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

form.addEventListener('submit', (e) => {
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

let initialMainContent = '';

document.addEventListener('DOMContentLoaded', () => {
    initialMainContent = document.getElementById('main').innerHTML;

    const actorId = 6193;
    if (actorId) {
        fetchActorDetails(actorId);
    }
    else {
        document.getElementById('actor-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; width: 100vw;">
                <h2>Actor details not found.</h2>
            </div>`;
    }

    document.getElementById('clear-search-btn').style.display = 'none';
});

async function fetchActorDetails(actorId) {
    const actorUrl = `https://${getMovieVerseData()}/3/person/6193?${generateMovieNames()}${getMovieCode()}`;
    const creditsUrl = `https://${getMovieVerseData()}/3/person/6193/movie_credits?${generateMovieNames()}${getMovieCode()}`;
    try {
        const [actorResponse, creditsResponse] = await Promise.all([
            fetch(actorUrl),
            fetch(creditsUrl)
        ]);

        const actor = await actorResponse.json();
        const credits = await creditsResponse.json();
        if (actor.success === false) {
            document.getElementById('actor-details-container').innerHTML = '<h2>No Information is Available for this Actor</h2>';
        }
        else {
            updateBrowserURL(actor.name);
            populateActorDetails(actor, credits);
        }
    }
    catch (error) {
        console.error('Error fetching actor details:', error);
        document.getElementById('actor-details-container').innerHTML = '<h2>Error fetching actor details</h2>';
    }
}

function populateActorDetails(actor, credits) {
    const actorImage = document.getElementById('actor-image');
    const actorName = document.getElementById('actor-name');
    const actorDescription = document.getElementById('actor-description');

    if (actor.profile_path) {
        actorImage.src = `https://image.tmdb.org/t/p/w1280${actor.profile_path}`;
        actorName.textContent = actor.name;
        document.title = `${actor.name} - Actor's Details`;
    }
    else {
        actorImage.style.display = 'none';
        actorName.textContent = actor.name;
        const noImageText = document.createElement('h2');
        noImageText.textContent = 'Image Not Available';
        noImageText.style.textAlign = 'center';
        document.querySelector('.actor-left').appendChild(noImageText);
    }

    let ageOrStatus;
    if (actor.birthday) {
        if (actor.deathday) {
            ageOrStatus = calculateAge(actor.birthday, actor.deathday) + ' (Deceased)';
        }
        else {
            ageOrStatus = calculateAge(actor.birthday) + ' (Alive)';
        }
    }
    else {
        ageOrStatus = 'Unknown';
    }

    actorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${actor.biography || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${actor.birthday || 'N/A'}</p>
        <p><strong>Date of Death:</strong> ${actor.deathday || 'N/A'}</p>
        <p><strong>Age:</strong> ${ageOrStatus}</p>
        <p><strong>Place of Birth:</strong> ${actor.place_of_birth || 'N/A'}</p>
        <p><strong>Known For:</strong> ${actor.known_for_department || 'N/A'}</p>
        <p><strong>Height:</strong> ${actor.height || 'N/A'}</p>
    `;

    const gender = document.createElement('div');
    gender.innerHTML = `<p><strong>Gender:</strong> ${actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'N/A'}</p>`;
    actorDescription.appendChild(gender);

    const popularity = document.createElement('div');
    popularity.innerHTML = `<p><strong>Popularity Score:</strong> ${actor.popularity.toFixed(2)}</p>`;
    actorDescription.appendChild(popularity);

    const filmographyHeading = document.createElement('p');
    filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
    actorDescription.appendChild(filmographyHeading);

    const movieList = document.createElement('div');
    movieList.classList.add('movie-list');
    credits.cast.forEach(movie => {
        const movieLink = document.createElement('span');
        movieLink.textContent = movie.title;
        movieLink.classList.add('movie-link');
        movieLink.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'movie-details.html';
        });
        movieList.appendChild(movieLink);
        movieList.appendChild(document.createTextNode(', '));
    });

    filmographyHeading.appendChild(movieList);
    applySettings();
}

function calculateAge(birthday, deathday = null) {
    const birthDate = new Date(birthday);
    const referenceDate = deathday ? new Date(deathday) : new Date();
    const diff = referenceDate - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ensureGenreMapIsAvailable() {
    if (!localStorage.getItem('genreMap')) {
        await fetchGenreMap();
    }
}

async function fetchGenreMap() {
    const url = `https://${getMovieVerseData()}/3/genre/movie/list?${generateMovieNames()}${getMovieCode()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const genreMap = data.genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});
        localStorage.setItem('genreMap', JSON.stringify(genreMap));
    }
    catch (error) {
        console.error('Error fetching genre map:', error);
    }
}

async function rotateUserStats() {
    await ensureGenreMapIsAvailable();

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
        { label: "Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Favorite Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
            getValue: () => {
                const mostCommonGenreCode = getMostCommonGenre();
                const genreMap = JSON.parse(localStorage.getItem('genreMap')) || {};
                return genreMap[mostCommonGenreCode] || 'Not Available';
            }
        },
        { label: "Watchlists Created", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
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
    const favoriteGenresArray = JSON.parse(localStorage.getItem('favoriteGenres')) || [];
    const genreCounts = favoriteGenresArray.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {});

    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in genreCounts) {
        if (genreCounts[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = genreCounts[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

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

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
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
    applySettings();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

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
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}

function applySettings() {
    const savedBg = localStorage.getItem('backgroundImage');
    const savedTextColor = localStorage.getItem('textColor');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }
    if (savedTextColor) {
        applyTextColor(savedTextColor);
    }
    if (savedFontSize) {
        const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
        document.body.style.fontSize = size;
    }
}

function applyTextColor(color) {
    document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li')
        .forEach(element => {
            element.style.color = color;
        });
}