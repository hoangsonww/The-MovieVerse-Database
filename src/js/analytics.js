async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function createChart(canvasId, chartType, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: chartType,
        data: data,
        options: options
    });
}

async function loadMoviesByYearChart() {
    const years = [];
    const movieCounts = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&primary_release_year=${year}`);
        movieCounts.push(response.total_results);
    }

    createChart('chart1', 'line', {
        labels: years,
        datasets: [{
            label: 'Number of Movies Released',
            data: movieCounts,
            backgroundColor: 'rgba(0,148,255,1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    });
}

async function loadGenrePopularityChart() {
    const genresResponse = await fetchData(`${BASE_URL}/genre/movie/list?api_key=${string}`);
    const genres = genresResponse.genres;

    const genreNames = [];
    const genrePopularity = [];

    for (const genre of genres) {
        genreNames.push(genre.name);
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&with_genres=${genre.id}`);
        genrePopularity.push(response.results.reduce((acc, movie) => acc + movie.popularity, 0) / response.results.length);
    }

    createChart('chart2', 'bar', {
        labels: genreNames,
        datasets: [{
            label: 'Average Popularity',
            data: genrePopularity,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    });
}

async function loadMoviesByCertificationChart() {
    const certifications = ['G', 'PG', 'PG-13', 'R'];
    const movieCounts = [];

    for (const certification of certifications) {
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&certification_country=US&certification=${certification}`);
        movieCounts.push(response.total_results);
    }

    createChart('chart3', 'bar', {
        labels: certifications,
        datasets: [{
            label: 'Number of Movies',
            data: movieCounts,
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    });
}

async function loadAveragePopularityChart() {
    const years = [];
    const averagePopularity = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 4; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&primary_release_year=${year}`);
        const totalPopularity = response.results.reduce((sum, movie) => sum + movie.popularity, 0);
        averagePopularity.push(totalPopularity / response.results.length);
    }

    createChart('chart4', 'line', {
        labels: years,
        datasets: [{
            label: 'Average Popularity',
            data: averagePopularity,
            backgroundColor: 'rgba(255, 159, 64, 1)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    });
}

Chart.defaults.color = "black";
Chart.defaults.scale.grid.borderColor = "black";

async function loadMoviesByLanguageChart() {
    const languages = ['en', 'es', 'fr', 'de', 'it'];
    const movieCounts = [];

    for (const language of languages) {
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&with_original_language=${language}`);
        movieCounts.push(response.total_results);
    }

    createChart('chart5', 'bar', {
        labels: languages.map(lang => lang.toUpperCase()),
        datasets: [{
            label: 'Number of Movies',
            data: movieCounts,
            backgroundColor: 'rgba(153, 102, 255, 1)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }],
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function loadVoteCountByGenreChart() {
    const genreResponse = await fetchData(`${BASE_URL}/genre/movie/list?api_key=${string}`);
    const genres = genreResponse.genres.slice(0, 5); // Limiting to 5 genres
    const genreNames = [];
    const averageVoteCounts = [];

    for (const genre of genres) {
        genreNames.push(genre.name);
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&with_genres=${genre.id}`);
        const totalVotes = response.results.reduce((sum, movie) => sum + movie.vote_count, 0);
        averageVoteCounts.push(totalVotes / response.results.length);
    }

    createChart('chart6', 'bar', {
        labels: genreNames,
        datasets: [{
            label: 'Average Vote Count',
            data: averageVoteCounts,
            backgroundColor: 'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    });
}

async function loadMovieReleaseDatesByMonthChart() {
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));
    const movieCounts = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&primary_release_year=${currentYear}`);
    response.results.forEach(movie => {
        const releaseDate = new Date(movie.release_date);
        movieCounts[releaseDate.getMonth()]++;
    });

    createChart('chart7', 'bar', {
        labels: months,
        datasets: [{
            label: 'Movies Released',
            data: movieCounts,
            backgroundColor: 'rgba(123, 239, 178, 1)',
            borderColor: 'rgba(123, 239, 178, 1)',
            borderWidth: 1
        }]
    });
}

async function loadMoviesByDecadeChart() {
    const decades = ['1980s', '1990s', '2000s', '2010s', '2020s'];
    const decadeStartYears = [1980, 1990, 2000, 2010, 2020];
    const movieCounts = [];

    for (const startYear of decadeStartYears) {
        const endYear = startYear + 9;
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`);
        movieCounts.push(response.total_results);
    }

    createChart('chart8', 'bar', {
        labels: decades,
        datasets: [{
            label: 'Number of Movies',
            data: movieCounts,
            backgroundColor: 'rgb(255,0,0)',
            borderColor: 'rgb(255,0,0)',
            borderWidth: 1
        }],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });
}

async function loadMoviesByProductionCountriesChart() {
    const countries = ['US', 'GB', 'CA', 'FR', 'DE'];
    const countryNames = ['USA', 'UK', 'Canada', 'France', 'Germany'];
    const movieCounts = [];

    for (const country of countries) {
        const response = await fetchData(`${BASE_URL}/discover/movie?api_key=${string}&with_original_language=en&region=${country}`);
        movieCounts.push(response.total_results);
    }

    createChart('chart9', 'bar', {
        labels: countryNames,
        datasets: [{
            label: 'Number of Movies',
            data: movieCounts,
            backgroundColor: 'rgba(0,32,255,0.75)',
            borderColor: 'rgb(0,21,255)',
            borderWidth: 1
        }],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });
}

function loadAllCharts() {
    loadMoviesByYearChart();
    loadGenrePopularityChart();
    loadMoviesByCertificationChart();
    loadAveragePopularityChart();
    loadMoviesByLanguageChart();
    loadVoteCountByGenreChart();
    loadMovieReleaseDatesByMonthChart();
    loadMoviesByDecadeChart();
    loadMoviesByProductionCountriesChart();
}

document.addEventListener('DOMContentLoaded', loadAllCharts);

const BASE_URL = 'https://api.themoviedb.org/3';

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

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

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

document.addEventListener('DOMContentLoaded', () => {
    applySettings();

    function applySettings() {
        const defaultBg = '../../images/universe-1.png';
        const savedBg = localStorage.getItem('backgroundImage') || defaultBg;
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');
        document.body.style.backgroundImage = `url('${savedBg}')`;

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
        { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy }
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

const string = 'c5a20c861acf7bb8d9e987dcc7f1b558';
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