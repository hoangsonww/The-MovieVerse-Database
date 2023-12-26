document.getElementById('load-movies').addEventListener('click', updateMovies);
document.getElementById('start-year').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        updateMovies();
    }
});

document.getElementById('end-year').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        updateMovies();
    }
});

const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const searchTitle = document.getElementById("select-text");
const searchButton = document.getElementById("button-search");
const search = document.getElementById("search");
const main = document.getElementById("movies-container");

async function getMovies(url) {
    clearMovieDetails();
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
        showMovies(allMovies.slice(0, numberOfMovies), main);
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }
}

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('movie-details-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

const form = document.getElementById('form1');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block';
});

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block';
});

function updateMovies() {
    let startYear = document.getElementById('start-year').value;
    let endYear = document.getElementById('end-year').value;
    let currentYear = new Date().getFullYear();
    if (startYear && endYear && startYear <= endYear && endYear <= currentYear) {
        fetchMoviesByTimePeriod(startYear, endYear);
    }
    else {
        alert('Please ensure the start year is before the end year, and both are not later than the current year.');
    }
}

function showMovies(movies, mainElement) {
    mainElement.innerHTML = '';
    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const movieImage = movie.poster_path
            ? `<img src="${IMGPATH + movie.poster_path}" alt="${movie.title}" />`
            : `<div class="no-image">Image Not Available</div>`;
        const voteAvg = movie.vote_average.toFixed(1);
        const ratingClass = getClassByRate(movie.vote_average);
        movieEl.innerHTML = `
            ${movieImage}
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="${ratingClass}">${voteAvg}</span>
            </div>
            <div class="overview">
                <h4>Movie Intro: </h4>
                ${movie.overview}
            </div>`;
        movieEl.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'movie-details.html';
        });
        movieEl.style.cursor = 'pointer';
        mainElement.appendChild(movieEl);
    });
}

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

async function fetchMoviesByTimePeriod(startYear, endYear) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    const response = await fetch(url);
    const data = await response.json();
    const numberOfMovies = calculateMoviesToDisplay();
    const moviesToShow = data.results.slice(0, numberOfMovies);
    showMovies(moviesToShow, document.getElementById('movies-container'));
}

document.getElementById('load-movies').addEventListener('click', () => {
    const startYear = document.getElementById('start-year').value;
    const endYear = document.getElementById('end-year').value;
    fetchMoviesByTimePeriod(startYear, endYear);
});

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

function getClassByRate(vote) {
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

async function showMovieOfTheDay(){
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        localStorage.setItem('selectedMovieId', randomMovie.id);
        window.location.href = 'movie-details.html';
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        alert('Failed to fetch the movie of the day. Please try again later.');
    }
}

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes;
    document.getElementById('clock').innerHTML = timeString;
}

setInterval(updateClock, 1000);
window.onload = updateClock;