const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form");
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const favoriteButton = document.getElementById("favorite-btn");

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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
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
        otherTitle.innerHTML = 'Check out other movies:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
});

async function getMovies(url) {
    clearMovieDetails();

    const resp = await fetch(url);
    const respData = await resp.json();

    if (respData.results.length > 0) {
        showMovies(respData.results);
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

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" /> 
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Overview: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });

        main.appendChild(movieE1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const movieId = localStorage.getItem('selectedMovieId');
    if (movieId) {
        fetchMovieDetails(movieId);
    }
    else {
        document.getElementById('movie-details-container').innerHTML = '<p>Movie details not found.</p>';
    }
});

async function fetchMovieDetails(movieId) {
    const code = 'c5a20c861acf7bb8d9e987dcc7f1b558';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${code}&append_to_response=credits,keywords,similar`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        populateMovieDetails(movie);
    }
    catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function toggleFavorite(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(movie.id)) {
        favorites = favorites.filter(favId => favId !== movie.id);
    }
    else {
        favorites.push(movie.id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(movie.id);
}

function updateFavoriteButton(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteButton = document.getElementById('favorite-btn');
    if (favorites.includes(movieId)) {
        favoriteButton.classList.add('favorited');
    }
    else {
        favoriteButton.classList.remove('favorited');
    }
}

function populateMovieDetails(movie) {
    const movieRating = movie.vote_average.toFixed(1);
    document.getElementById('movie-image').src = `https://image.tmdb.org/t/p/w1280${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;
    // document.getElementById('movie-description').textContent = movie.overview;
    document.getElementById('movie-rating').textContent = `IMDB Rating: ${movieRating}`;
    document.title = movie.title + " - Movie Details";
    const overview = movie.overview;
    const genres = movie.genres.map(genre => genre.name).join(', ');
    const releaseDate = movie.release_date;
    const runtime = movie.runtime + ' minutes';
    const budget = movie.budget === 0 ? 'Unknown' : `$${movie.budget.toLocaleString()}`;
    const revenue = movie.revenue === 0 ? 'Unknown' : `$${movie.revenue.toLocaleString()}`;
    const productionCompanies = movie.production_companies.map(pc => pc.name).join(', ');
    const tagline = movie.tagline ? movie.tagline : 'No tagline found';
    const languages = movie.spoken_languages.map(lang => lang.name).join(', ');
    const countries = movie.production_countries.map(country => country.name).join(', ');
    const originalLanguage = movie.original_language.toUpperCase();
    const popularityScore = movie.popularity.toFixed(2);
    const status = movie.status;
    const userScore = movie.vote_average;
    const voteCount = movie.vote_count.toLocaleString();
    let keywords = movie.keywords ? movie.keywords.keywords.map(kw => kw.name).join(', ') : 'None Available';
    const similarTitles = movie.similar ? movie.similar.results.map(m => m.title).join(', ') : 'None Available';

    if (keywords.length === 0) {
        keywords = 'None Available';
    }

    document.getElementById('movie-description').innerHTML += `
        <p><strong>Description: </strong>${overview}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Release Date:</strong> ${releaseDate}</p>
        <p><strong>Runtime:</strong> ${runtime}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Revenue:</strong> ${revenue}</p>
        <p><strong>Production Companies:</strong> ${productionCompanies}</p>
        <p><strong>Tagline:</strong> ${tagline}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Countries of Production:</strong> ${countries}</p>
        <p><strong>Original Language:</strong> ${originalLanguage}</p>
        <p><strong>Popularity Score:</strong> ${popularityScore}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>User Score:</strong> ${userScore} (based on ${voteCount} votes)</p>
        <p><strong>Keywords:</strong> ${keywords}</p>
    `;

    const similarMoviesHeading = document.createElement('p');
    similarMoviesHeading.innerHTML = '<strong>Similar Movies:</strong> ';
    document.getElementById('movie-description').appendChild(similarMoviesHeading);

    if (movie.similar && movie.similar.results.length > 0) {
        movie.similar.results.forEach((similarMovie, index) => {
            const movieLink = document.createElement('span');
            movieLink.textContent = similarMovie.title;
            movieLink.style.cursor = 'pointer';
            movieLink.style.textDecoration = 'underline';
            movieLink.addEventListener('mouseenter', () => {
                movieLink.style.color = '#f509d9';
            });
            movieLink.addEventListener('mouseleave', () => {
                movieLink.style.color = 'white';
            });
            movieLink.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', similarMovie.id); // Store the clicked movie's ID
                window.location.href = 'movie-details.html'; // Redirect to the details page
            });

            // Append the clickable movie link
            similarMoviesHeading.appendChild(movieLink);

            // If not the last movie, add a comma and space
            if (index < movie.similar.results.length - 1) {
                similarMoviesHeading.appendChild(document.createTextNode(', '));
            }
        });
    }
    else {
        similarMoviesHeading.appendChild(document.createTextNode('None available.'));
    }
    updateFavoriteButton(movie.id);
    favoriteButton.addEventListener('click', () => toggleFavorite(movie));
}
