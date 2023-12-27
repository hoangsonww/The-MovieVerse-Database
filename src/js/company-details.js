const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form");
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");

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
    const searchTerm = search.value.trim();

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
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
});

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
        showMovies(allMovies.slice(0, numberOfMovies));
        document.getElementById('clear-search-btn').style.display = 'block';
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none';
    }
}

document.getElementById('clear-search-btn').addEventListener('click', () => {
    window.location.reload();
});

function clearMovieDetails() {
    const companyDetailsContainer = document.getElementById('company-details-container');
    if (companyDetailsContainer) {
        companyDetailsContainer.innerHTML = '';
    }
}

function showMovies(movies){
    main.innerHTML = '';
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
        });

        main.appendChild(movieE1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const companyId = localStorage.getItem('selectedCompanyId');
    if (companyId) {
        fetchCompanyDetails(companyId);
        fetchCompanyMovies(companyId);
    }
});

async function fetchCompanyDetails(companyId) {
    const url = `https://api.themoviedb.org/3/company/${companyId}?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    try {
        const response = await fetch(url);
        const company = await response.json();

        const logoImg = document.getElementById('company-logo');
        if (company.logo_path) {
            logoImg.src = `https://image.tmdb.org/t/p/w500${company.logo_path}`;
        }
        else {
            logoImg.style.display = 'none';
            const logoFallbackText = document.createElement('p');
            logoFallbackText.textContent = 'Logo Not Available';
            logoImg.parentNode.insertBefore(logoFallbackText, logoImg);
        }

        document.getElementById('company-name').textContent = company.name || 'Name Not Available';
        document.getElementById('company-headquarters').textContent = company.headquarters || 'Headquarters Not Available';
        document.getElementById('company-country').textContent = company.origin_country || 'Country Not Available';
        document.title = `${company.name} - Company Details`;

        const homepage = company.homepage || '#';
        const companyWebsite = document.getElementById('company-website');
        if (homepage !== '#') {
            companyWebsite.href = homepage;
            companyWebsite.textContent = homepage;
        }
        else {
            companyWebsite.textContent = 'Website Not Available';
        }
    }
    catch (error) {
        console.error('Error fetching company details:', error);
    }
}

async function fetchCompanyMovies(companyId) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_companies=${companyId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length === 0) {
            const companyMoviesContainer = document.getElementById('company-movies-container');
            companyMoviesContainer.innerHTML = `<p>No movies found for this company.</p>`;
            return;
        }
        displayCompanyMovies(data.results);
    }
    catch (error) {
        console.error('Error fetching movies:', error);
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

function displayCompanyMovies(movies) {
    const moviesList = document.getElementById('company-movies-list');
    movies.forEach((movie, index) => {
        const movieContainer = document.createElement('span');

        const movieLink = document.createElement('span');
        movieLink.textContent = movie.title;
        movieLink.style.cursor = 'pointer';
        movieLink.style.textDecoration = 'underline';
        movieLink.addEventListener('mouseenter', () => {
            movieLink.style.color = '#f509d9';
        });
        movieLink.addEventListener('mouseleave', () => {
            movieLink.style.color = 'white';
        });
        movieLink.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'movie-details.html';
        });

        movieContainer.appendChild(movieLink);

        if (index < movies.length - 1) {
            movieContainer.appendChild(document.createTextNode(','));
        }

        moviesList.appendChild(movieContainer);
    });
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
