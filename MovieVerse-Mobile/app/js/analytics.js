const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121);
}

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

const string = `${getMovieCode()}`;

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        console.log('Error fetching data:', error);
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
    showSpinner();
    const years = [];
    const movieCounts = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${year}`);
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

    hideSpinner();
}

async function loadGenrePopularityChart() {
    showSpinner();
    const genresResponse = await fetchData(`${BASE_URL}/genre/movie/list?${generateMovieNames()}=${string}`);
    const genres = genresResponse.genres;

    const genreNames = [];
    const genrePopularity = [];

    for (const genre of genres) {
        genreNames.push(genre.name);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&with_genres=${genre.id}`);
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

    hideSpinner();
}

async function loadMoviesByCertificationChart() {
    showSpinner();
    const certifications = ['G', 'PG', 'PG-13', 'R'];
    const movieCounts = [];

    for (const certification of certifications) {
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&certification_country=US&certification=${certification}`);
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

    hideSpinner();
}

async function loadAveragePopularityChart() {
    showSpinner();
    const years = [];
    const averagePopularity = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 4; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${year}`);
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
    showSpinner();
}

Chart.defaults.color = "black";
Chart.defaults.scale.grid.borderColor = "black";

async function loadMoviesByLanguageChart() {
    showSpinner();
    const languages = ['en', 'es', 'fr', 'de', 'it'];
    const movieCounts = [];

    for (const language of languages) {
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&with_original_language=${language}`);
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

    hideSpinner();
}

async function loadVoteCountByGenreChart() {
    showSpinner();
    const genreResponse = await fetchData(`${BASE_URL}/genre/movie/list?${generateMovieNames()}=${string}`);
    const genres = genreResponse.genres.slice(0, 5);
    const genreNames = [];
    const averageVoteCounts = [];

    for (const genre of genres) {
        genreNames.push(genre.name);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&with_genres=${genre.id}`);
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

    hideSpinner();
}

async function loadMovieReleaseDatesByMonthChart() {
    showSpinner();
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));
    const movieCounts = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${currentYear}`);
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

    hideSpinner();
}

async function loadMoviesByDecadeChart() {
    showSpinner();
    const decades = ['1980s', '1990s', '2000s', '2010s', '2020s'];
    const decadeStartYears = [1980, 1990, 2000, 2010, 2020];
    const movieCounts = [];

    for (const startYear of decadeStartYears) {
        const endYear = startYear + 9;
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`);
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

    hideSpinner();
}

async function loadMoviesByProductionCountriesChart() {
    showSpinner();
    const countries = ['US', 'GB', 'CA', 'FR', 'DE'];
    const countryNames = ['USA', 'UK', 'Canada', 'France', 'Germany'];
    const movieCounts = [];

    for (const country of countries) {
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&with_original_language=en&region=${country}`);
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

    hideSpinner();
}

async function loadTopRatedMoviesPerYearChart() {
    const years = [];
    const topMovies = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${year}&sort_by=vote_average.desc&vote_count.gte=100`);
        if (response.results.length > 0) {
            topMovies.push(response.results[0].vote_average);
        }
        else {
            topMovies.push(0);
        }
    }

    createChart('chart11', 'bar', {
        labels: years,
        datasets: [{
            label: 'Top Rated Movie Score',
            data: topMovies,
            backgroundColor: 'rgba(255, 159, 64, 1)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    });
}

async function loadTotalMovieVotesOverYearsChart() {
    const years = [];
    const totalVoteCounts = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 10; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${year}`);
        const yearlyTotalVotes = response.results.reduce((sum, movie) => sum + movie.vote_count, 0);
        totalVoteCounts.push(yearlyTotalVotes);
    }

    createChart('chartVotesOverYears', 'line', {
        labels: years,
        datasets: [{
            label: 'Total Movie Votes',
            data: totalVoteCounts,
            backgroundColor: 'rgba(255, 193, 7, 1)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
        }]
    });
}

async function loadHighlyRatedMoviesOverYearsChart() {
    const years = [];
    const highRatedMovieCounts = [];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;

    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
        const response = await fetchData(`${BASE_URL}/discover/movie?${generateMovieNames()}=${string}&primary_release_year=${year}&vote_average.gte=8`);
        highRatedMovieCounts.push(response.total_results);
    }

    createChart('chartHighlyRatedMovies', 'line', {
        labels: years,
        datasets: [{
            label: 'Highly Rated Movies (Rating >= 8)',
            data: highRatedMovieCounts,
            backgroundColor: 'rgba(0, 206, 209, 1)',
            borderColor: 'rgba(0, 206, 209, 1)',
            borderWidth: 1
        }]
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
    loadTopRatedMoviesPerYearChart();
    loadTotalMovieVotesOverYearsChart();
    loadHighlyRatedMoviesOverYearsChart();
}

document.addEventListener('DOMContentLoaded', loadAllCharts);

const BASE_URL = `https://${getMovieVerseData()}/3`;

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}=${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

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
        console.log('Error fetching movie:', error);
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
        console.log('Error fetching genre map:', error);
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
                const favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
            getValue: () => {
                const mostCommonGenreCode = getMostCommonGenre();
                const genreMapString = localStorage.getItem('genreMap');
                if (!genreMapString) {
                    console.log('No genre map found in localStorage.');
                    return 'Not Available';
                }

                let genreMap;
                try {
                    genreMap = JSON.parse(genreMapString);
                }
                catch (e) {
                    console.log('Error parsing genre map:', e);
                    return 'Not Available';
                }

                let genreObject;
                if (Array.isArray(genreMap)) {
                    genreObject = genreMap.reduce((acc, genre) => {
                        acc[genre.id] = genre.name;
                        return acc;
                    }, {});
                }
                else if (typeof genreMap === 'object' && genreMap !== null) {
                    genreObject = genreMap;
                }
                else {
                    console.log('genreMap is neither an array nor a proper object:', genreMap);
                    return 'Not Available';
                }

                return genreObject[mostCommonGenreCode] || 'Not Available';
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

const form = document.getElementById('form1');

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
