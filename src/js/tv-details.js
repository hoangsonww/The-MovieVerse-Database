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

const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");
let initialMainContent;

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

function setStarRating(rating) {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        star.style.color = star.dataset.value > rating ? 'grey' : 'gold';
    });

    document.getElementById('rating-value').textContent = `${rating}.0/5.0`;
}

document.addEventListener('DOMContentLoaded', () => {
    const favoriteBtn = document.getElementById('favorite-btn');
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');

    setInitialStarRating(tvSeriesId);

    function toggleFavorite() {
        let favorites = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
        if (favorites.includes(tvSeriesId)) {
            favorites = favorites.filter(id => id !== tvSeriesId);
            favoriteBtn.textContent = '❤️';
            favoriteBtn.title = 'Add to Favorites';
            favoriteBtn.style.backgroundColor = 'grey';
        }
        else {
            favorites.push(tvSeriesId);
            favoriteBtn.textContent = '❤️';
            favoriteBtn.title = 'Remove from Favorites';
            favoriteBtn.style.background = 'transparent';
        }
        localStorage.setItem('favoritesTVSeries', JSON.stringify(favorites));
    }

    function updateFavoriteButtonUI() {
        let favorites = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
        if (favorites.includes(tvSeriesId)) {
            favoriteBtn.textContent = '❤️';
            favoriteBtn.title = 'Remove from Favorites';
            favoriteBtn.style.backgroundColor = 'grey';
        }
        else {
            favoriteBtn.textContent = '❤️';
            favoriteBtn.title = 'Add to Favorites';
            favoriteBtn.style.background = 'transparent';
        }
    }

    favoriteBtn.addEventListener('click', () => {
        toggleFavorite();
        updateFavoriteButtonUI();
    });

    updateFavoriteButtonUI();
});

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function setInitialStarRating(tvSeriesId) {
    const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
    const tvSeriesRating = savedRatings[tvSeriesId];
    if (tvSeriesRating) {
        setStarRating(tvSeriesRating);
    }
    else {
        setStarRating(0);
    }
}

document.querySelectorAll('.rating .star').forEach(star => {
    star.addEventListener('mouseover', (e) => {
        setStarRating(e.target.dataset.value);
    });

    star.addEventListener('mouseout', () => {
        const movieId = localStorage.getItem('selectedTvSeriesId');
        const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
        const movieRating = savedRatings[movieId] || 0;
        setStarRating(movieRating);
    });

    star.addEventListener('click', (e) => {
        const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
        if (!tvSeriesId) return;
        const rating = e.target.dataset.value;
        const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
        savedRatings[tvSeriesId] = rating;
        localStorage.setItem('tvSeriesRatings', JSON.stringify(savedRatings));
        setStarRating(rating);
        window.location.reload();
    });
});

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

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

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButton();
    initClient();
    applySettings();
});

const tvCode = `${getMovieCode()}`;

async function fetchTvDetails(tvSeriesId) {
    const baseUrl = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}`;
    const urlWithAppend = `${baseUrl}?${generateMovieNames()}${tvCode}&append_to_response=credits,keywords,similar,videos`;

    try {
        const response = await fetch(urlWithAppend);
        const tvSeriesDetails = await response.json();

        populateTvSeriesDetails(tvSeriesDetails);
    }
    catch (error) {
        console.error('Error fetching TV series details:', error);
    }
}

function populateTvSeriesDetails(tvSeries) {
    const title = tvSeries.name || 'Title not available';
    document.getElementById('movie-title').textContent = title;

    const posterPath = tvSeries.poster_path ? `https://image.tmdb.org/t/p/w1280${tvSeries.poster_path}` : 'path/to/default/poster.jpg';
    document.getElementById('movie-image').src = posterPath;
    document.getElementById('movie-image').alt = `Poster of ${title}`;

    let detailsHTML = `<p><strong>Overview:</strong> ${tvSeries.overview || 'Overview not available.'}</p>`;

    const creators = tvSeries.created_by && tvSeries.created_by.length ? tvSeries.created_by.map(creator => creator.name).join(', ') : 'Information not available';
    detailsHTML += `<p><strong>Created by:</strong> ${creators}</p>`;

    const genres = tvSeries.genres && tvSeries.genres.length ? tvSeries.genres.map(genre => genre.name).join(', ') : 'Genres not available';
    detailsHTML += `<p><strong>Genres:</strong> ${genres}</p>`;

    detailsHTML += `<p><strong>First Air Date:</strong> ${tvSeries.first_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Last Air Date:</strong> ${tvSeries.last_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Status:</strong> ${tvSeries.status || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Seasons:</strong> ${tvSeries.number_of_seasons || 0}, <strong>Episodes:</strong> ${tvSeries.number_of_episodes || 0}</p>`;

    if (tvSeries.last_episode_to_air) {
        detailsHTML += `<p><strong>Last Episode:</strong> ${tvSeries.last_episode_to_air.name || 'Title not available'} - "${tvSeries.last_episode_to_air.overview || 'Overview not available.'}"</p>`;
    }

    if (tvSeries.production_companies && tvSeries.production_companies.length) {
        let companiesHTML = tvSeries.production_companies.map(company => {
            return `<a id="prod-companies" href="javascript:void(0);" onclick="selectCompanyId(${company.id})">${company.name}</a>`;
        }).join(', ');
        detailsHTML += `<p><strong>Production Companies:</strong> ${companiesHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Production Companies:</strong> Information not available</p>`;
    }

    const networks = tvSeries.networks && tvSeries.networks.length ? tvSeries.networks.map(network => network.name).join(', ') : 'Information not available';
    detailsHTML += `<p><strong>Networks:</strong> ${networks}</p>`;

    const voteAverage = tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : 'N/A';
    const voteCount = tvSeries.vote_count ? tvSeries.vote_count.toLocaleString() : 'N/A';
    detailsHTML += `<p><strong>User Rating:</strong> <strong>${(voteAverage / 2).toFixed(1)}/5</strong> (based on <strong>${voteCount}</strong> votes)</p>`;

    const homepage = tvSeries.homepage ? `<a id="homepage" href="${tvSeries.homepage}" target="_blank">Visit</a>` : 'Not available';
    detailsHTML += `<p><strong>Homepage:</strong> ${homepage}</p>`;

    if (tvSeries.seasons && tvSeries.seasons.length) {
        const seasonsToShow = tvSeries.seasons.slice(0, 9);

        seasonsToShow.forEach(season => {
            detailsHTML += `<p><strong>${season.name || 'Season information not available'}:</strong> ${season.overview || 'Overview not available.'}</p>`;
        });
    }

    detailsHTML += `<p><strong>Tagline:</strong> ${tvSeries.tagline || 'Not available'}</p>`;

    document.getElementById('movie-description').innerHTML = detailsHTML;
}

function selectCompanyId(companyId) {
    localStorage.setItem('selectedCompanyId', companyId);
    window.location.href = 'company-details.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
    if (tvSeriesId) {
        fetchTvDetails(tvSeriesId);
    }
    else {
        document.getElementById('movie-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw;">
                <h2>TV series details not found.</h2>
            </div>`;
    }

    document.getElementById('clear-search-btn').style.display = 'none';

    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    const movieRating = savedRatings[movieId] || 0;
    setStarRating(movieRating);
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