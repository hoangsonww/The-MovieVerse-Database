const main = document.getElementById("most-popular");
const main2 = document.getElementById("main2");
const main3 = document.getElementById("action");
const main4 = document.getElementById("horror");
const main5 = document.getElementById("documentary");
const main6 = document.getElementById("animation");
const main7 = document.getElementById("sci-fi");
const main8 = document.getElementById("romantic");
const main9 = document.getElementById("thriller");
const main10 = document.getElementById("mystery");
const main11 = document.getElementById("adventure");
const main12 = document.getElementById("comedy");
const main13 = document.getElementById("fantasy");
const main14 = document.getElementById("family");
const main15 = document.getElementById("tv-series");
const crime_main = document.getElementById("crime");
const award_winning_main = document.getElementById('award-winning');
const hidden_gems_main = document.getElementById('hidden-gems');
const classic_main = document.getElementById('classic');
const director_main = document.getElementById('director-spotlight');
const korean_main = document.getElementById('korean');
const vietnamese_main = document.getElementById('vietnamese');
const indian_main = document.getElementById("indian");

const form = document.getElementById("form");
const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other1");
const clearButton = document.getElementById("button-clear");

let searchPerformed = false;

async function getMovies(url, mainElement, isSearch = false) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    let allMovies = [];

    if (isSearch) {
        searchPerformed = true;
        clearButton.style.display = 'block';
    }

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
        showMovies(allMovies.slice(0, numberOfMovies), mainElement);
    }
    else {
        mainElement.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }

}

function showMovies(movies, mainElement) {
    mainElement.innerHTML = '';
    movies.forEach(movie => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        const voteAvg = vote_average > 0 ? vote_average.toFixed(1) : "Unrated";

        const ratingClass = vote_average > 0 ? getClassByRate(vote_average) : "unrated";

        movieEl.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${ratingClass}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieEl.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            updateUniqueMoviesViewed(id);
            window.location.href = 'MovieVerse-Frontend/html/movie-details.html';
            updateMovieVisitCount(id, title);
        });

        mainElement.appendChild(movieEl);
    });
}

function updateUniqueMoviesViewed(movieId) {
    let viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
    if (!viewedMovies.includes(movieId)) {
        viewedMovies.push(movieId);
        localStorage.setItem('uniqueMoviesViewed', JSON.stringify(viewedMovies));
    }
}

clearButton.addEventListener('click', () => {
    window.location.reload();
});

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

const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

document.addEventListener('DOMContentLoaded', rotateUserStats);

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'MovieVerse-Frontend/html/movie-details.html';
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
    window.location.href = 'MovieVerse-Frontend/html/movie-details.html';
}

function calculateMoviesToDisplay() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 689.9) return 10; // 1 movie per row
    if (screenWidth <= 1021.24) return 20; // 2 movies per row
    if (screenWidth <= 1353.74) return 21; // 3 movies per row
    if (screenWidth <= 1684.9) return 20; // 4 movies per row
    if (screenWidth <= 2017.49) return 20; // 5 movies per row
    if (screenWidth <= 2349.99) return 18; // 6 movies per row
    if (screenWidth <= 2681.99) return 21; // 7 movies per row
    if (screenWidth <= 3014.49) return 24; // 8 movies per row
    if (screenWidth <= 3345.99) return 27; // 9 movies per row
    if (screenWidth <= 3677.99) return 20; // 10 movies per row
    if (screenWidth <= 4009.99) return 22; // 11 movies per row
    if (screenWidth <= 4340.99) return 24; // 12 movies per row
    if (screenWidth <= 4673.49) return 26; // 13 movies per row
    if (screenWidth <= 5005.99) return 28; // 14 movies per row
    if (screenWidth <= 5337.99) return 30; // 15 movies per row
    if (screenWidth <= 5669.99) return 32; // 16 movies per row
    if (screenWidth <= 6001.99) return 34; // 17 movies per row
    if (screenWidth <= 6333.99) return 36; // 18 movies per row
    if (screenWidth <= 6665.99) return 38; // 19 movies per row
    if (screenWidth <= 6997.99) return 40; // 20 movies per row
    if (screenWidth <= 7329.99) return 42; // 21 movies per row
    if (screenWidth <= 7661.99) return 44; // 22 movies per row
    if (screenWidth <= 7993.99) return 46; // 23 movies per row
    if (screenWidth <= 8325.99) return 48; // 24 movies per row
    return 20;
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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'MovieVerse-Frontend/html/search.html';
});

function toggleNav() {
    const sideNav = document.getElementById('side-nav');
    sideNav.classList.toggle('manual-toggle');
    adjustNavBar();
}

function removeNavBar() {
    const sideNav = document.getElementById('side-nav');
    if (sideNav.classList.contains('manual-toggle')) {
        sideNav.classList.remove('manual-toggle');
    }

    adjustNavBar();
}

function adjustNavBar() {
    const sideNav = document.getElementById('side-nav');
    if (sideNav.classList.contains('manual-toggle')) {
        sideNav.style.left = '0px';
    }
    else {
        sideNav.style.left = '-250px';
    }
}

document.addEventListener('mousemove', function(event) {
    const sideNav = document.getElementById('side-nav');
    if (event.clientX < 10 && !sideNav.classList.contains('manual-toggle')) {
        sideNav.style.left = '0';
    }
});

document.getElementById('side-nav').addEventListener('mouseleave', function() {
    const sideNav = document.getElementById('side-nav');
    if (!sideNav.classList.contains('manual-toggle')) {
        sideNav.style.left = '-250px';
    }
});

const DATABASEURL = `https://${getMovieVerseData()}/3/discover/movie?sort_by=popularity.desc&api_key=${getMovieCode()}`;
const IMGPATH = `https://image.tmdb.org/t/p/w1280`;
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&api_key=${getMovieCode()}&query=`;
const ACTIONpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=28&sort_by=popularity.desc&vote_count.gte=8`;
const HORRORpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=27&sort_by=popularity.desc&vote_count.gte=8`;
const DOCUMENTARYRpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=99&sort_by=popularity.desc&vote_count.gte=8`;
const ANIMATIONpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=16&sort_by=popularity.desc&vote_count.gte=8`;
const SCIFIpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=878&sort_by=popularity.desc&vote_count.gte=8`;
const ROMANTICpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=10749&sort_by=popularity.desc&vote_count.gte=8`;
const THRILLERpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=53&sort_by=popularity.desc&vote_count.gte=8`;
const MYSTERYpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=9648&sort_by=popularity.desc&vote_count.gte=8`;
const ADVENTUREpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=12&sort_by=popularity.desc&vote_count.gte=8`;
const COMEDYpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=35&sort_by=popularity.desc&vote_count.gte=8`;
const FANTASYpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=14&sort_by=popularity.desc&vote_count.gte=8`;
const FAMILYpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=10751&sort_by=popularity.desc&vote_count.gte=8`;
const TVpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=10770&sort_by=popularity.desc&vote_count.gte=8`;
const CRIMEpath = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_genres=80&sort_by=popularity.desc&vote_count.gte=8`;
const VIETNAMESE_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_original_language=vi&sort_by=popularity.desc`;
const KOREAN_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_original_language=ko&sort_by=vote_average.desc,popularity.desc&vote_count.gte=10&vote_average.gte=8`;
const INDIAN_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&with_original_language=hi&sort_by=popularity.desc`;
const HIDDEN_GEMS_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7&popularity.lte=10`;
const AWARD_WINNING_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=1000`;
const CLASSIC_MOVIES_PATH = `https://${getMovieVerseData()}/3/discover/movie?api_key=${getMovieCode()}&sort_by=popularity.desc&release_date.lte=1980`;

getMovies(DATABASEURL, main);
getMovies(ACTIONpath, main3);
getMovies(HORRORpath, main4);
getMovies(DOCUMENTARYRpath, main5);
getMovies(ANIMATIONpath, main6);
getMovies(SCIFIpath, main7);
getMovies(ROMANTICpath, main8);
getMovies(THRILLERpath, main9);
getMovies(MYSTERYpath, main10);
getMovies(ADVENTUREpath, main11);
getMovies(COMEDYpath, main12);
getMovies(FANTASYpath, main13);
getMovies(FAMILYpath, main14);
getMovies(TVpath, main15);
getMovies(CRIMEpath, crime_main);
getMovies(AWARD_WINNING_PATH, award_winning_main);
getMovies(HIDDEN_GEMS_PATH, hidden_gems_main);
getMovies(CLASSIC_MOVIES_PATH, classic_main);
getMovies(VIETNAMESE_PATH, vietnamese_main);
getMovies(KOREAN_PATH, korean_main);
getMovies(INDIAN_PATH, indian_main);

const directors = [
    { name: "Alfred Hitchcock", id: "2636" },
    { name: "Steven Spielberg", id: "488" },
    { name: "Martin Scorsese", id: "1032" },
    { name: "Quentin Tarantino", id: "138" },
    { name: "Christopher Nolan", id: "525" },
    { name: "Stanley Kubrick", id: "240" },
    { name: "Bong Joon-ho", id: "21684" },
    { name: "David Fincher", id: "7467" },
    { name: "James Cameron", id: "2710" },
    { name: "Francis Ford Coppola", id: "1776" },
    { name: "Tim Burton", id: "510" },
    { name: "Ridley Scott", id: "578" },
    { name: "Joel Coen", id: "1223" },
    { name: "Spike Lee", id: "5281" },
    { name: "Woody Allen", id: "1243" },
    { name: "Peter Jackson", id: "108" },
    { name: "Oliver Stone", id: "1152" },
    { name: "David Lynch", id: "5602" },
    { name: "Roman Polanski", id: "3556" },
    { name: "Wes Anderson", id: "5655"},
    { name: "Sergio Leone", id: "4385" },
    { name: "Akira Kurosawa", id: "5026" },
    { name: "Federico Fellini", id: "4415" },
    { name: "John Ford", id: "8500" },
    { name: "Fritz Lang", id: "68" },
    { name: "Frank Capra", id: "2662" },
];

let currentDirectorIndex = 0;
updateDirectorSpotlight();

function changeDirector() {
    let randomIndex = Math.floor(Math.random() * directors.length);
    while(randomIndex === currentDirectorIndex) {
        randomIndex = Math.floor(Math.random() * directors.length);
    }

    currentDirectorIndex = randomIndex;
    updateDirectorSpotlight();
}

setInterval(updateDirectorSpotlight, 3600000);

function updateDirectorSpotlight() {
    const director = directors[currentDirectorIndex];
    document.getElementById('spotlight-director-name').textContent = director.name;
    const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_people=${director.id}&sort_by=popularity.desc&sort_by=vote_average.desc`;
    getDirectorSpotlight(url);
}

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

async function getDirectorSpotlight(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        allMovies = respData.results.slice(0, numberOfMovies);
        showMoviesDirectorSpotlight(allMovies);
    }
}

function showMoviesDirectorSpotlight(movies) {
    director_main.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'MovieVerse-Frontend/html/movie-details.html';
            updateMovieVisitCount(id, title);
        });

        director_main.appendChild(movieE1);
    });
}

function handleSignInOut() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    if (isSignedIn) {
        localStorage.setItem('isSignedIn', JSON.stringify(false));
        alert('You have been signed out.');
    }
    else {
        window.location.href = 'MovieVerse-Frontend/html/sign-in.html';
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

    const mobileSignInText = document.getElementById('mobileSignInOutText');
    const mobileSignInIcon = document.getElementById('mobileSignInIcon');
    const mobileSignOutIcon = document.getElementById('mobileSignOutIcon');

    if (isSignedIn) {
        mobileSignInText.textContent = 'Sign Out';
        mobileSignInIcon.style.display = 'none';
        mobileSignOutIcon.style.display = 'inline-block';
    }
    else {
        mobileSignInText.textContent = 'Sign In';
        mobileSignInIcon.style.display = 'inline-block';
        mobileSignOutIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    checkAndClearLocalStorage();
    updateSignInButtonState();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

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

function handleSearch() {
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'MovieVerse-Frontend/html/search.html';
}


function checkAndClearLocalStorage() {
    const hasCleared = localStorage.getItem('hasUserClearedMovieVerseData2');
    if (!hasCleared) {
        clearMovieVerseLocalStorage();
        localStorage.setItem('hasUserClearedMovieVerseData2', 'true');
        window.location.reload();
    }
}

function clearMovieVerseLocalStorage() {
    localStorage.removeItem('favorites');
    localStorage.removeItem('localWatchlists');
    localStorage.removeItem('selectedMovieId');
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('selectedDirectorId');
    localStorage.removeItem('selectedActorId');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedTvSeriesId');
    localStorage.removeItem('movieVisits');
    localStorage.removeItem('actorVisits');
    localStorage.removeItem('directorVisits');
    localStorage.removeItem('movieRatings');
    localStorage.removeItem('triviaStats');
    localStorage.removeItem('uniqueMoviesViewed');
    localStorage.removeItem('uniqueDirectorsViewed');
    localStorage.removeItem('uniqueActorsViewed');
    localStorage.removeItem('uniqueCompaniesViewed');
    localStorage.removeItem('favoriteGenres');
    localStorage.removeItem('watchlistsCreated');
    localStorage.removeItem('averageMovieRating');
    localStorage.removeItem('backgroundImage');
    localStorage.removeItem('textColor');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('moviesFavorited');
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('selectedTVSeriesId');
    localStorage.removeItem('favoritesTVSeries');
    localStorage.removeItem('currentlySignedInMovieVerseUser');
    localStorage.removeItem('hasUserClearedMovieVerseData');
    localStorage.removeItem('selectedCategory');
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('watchlists');
    localStorage.removeItem('favoritesMovies');
}
