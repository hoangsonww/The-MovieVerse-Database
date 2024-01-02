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

    // Sort movies by vote_average in descending order
    allMovies.sort((a, b) => b.vote_average - a.vote_average);

    // Display the sorted movies
    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies));
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
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
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });

        main.appendChild(movieE1);
    });
}

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('actor-details-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const actorId = localStorage.getItem('selectedActorId');
    if (actorId) {
        fetchActorDetails(actorId);
    }
    else {
        document.getElementById('actor-details-container').innerHTML = '<p>Actor details not found.</p>';
    }
});

async function fetchActorDetails(actorId) {
    const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    const creditsUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;

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

    // Check if actor image is available
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
    document.getElementById('actor-image').src = `https://image.tmdb.org/t/p/w1280${actor.profile_path}`;
    document.getElementById('actor-name').textContent = actor.name;

    actorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${actor.biography || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${actor.birthday || 'N/A'}</p>
        <p><strong>Age:</strong> ${actor.birthday ? calculateAge(actor.birthday) : 'N/A'}</p>
        <p><strong>Place of Birth:</strong> ${actor.place_of_birth || 'N/A'}</p>
        <p><strong>Known For:</strong> ${actor.known_for_department || 'N/A'}</p>
        <p><strong>Height:</strong> ${actor.height || 'N/A'}</p>
    `;
    const filmographyHeading = document.createElement('p');
    filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
    document.getElementById('actor-description').appendChild(filmographyHeading);

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

    // Add Gender
    const gender = document.createElement('div');
    gender.innerHTML = `
        <p><strong>Gender:</strong> ${actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'N/A'}</p>
    `;
    document.getElementById('actor-description').appendChild(gender);

    // Add Popularity Score
    const popularity = document.createElement('div');
    popularity.innerHTML = `
        <p><strong>Popularity Score:</strong> ${actor.popularity.toFixed(2)}</p>
    `;
    document.getElementById('actor-description').appendChild(popularity);
}

async function showMovieOfTheDay(){
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        // Store the selected movie ID in localStorage and redirect to movie-details page
        localStorage.setItem('selectedMovieId', randomMovie.id);
        window.location.href = 'movie-details.html';
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        alert('Failed to fetch the movie of the day. Please try again later.');
    }

}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    return currentDate.getFullYear() - birthDate.getFullYear();
}