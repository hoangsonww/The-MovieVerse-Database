const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form1");
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
    document.getElementById('clear-search-btn').style.display = 'block';
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
    document.getElementById('clear-search-btn').style.display = 'block';
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

let isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
updateSignInButton();

function handleSignInOut() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');

    if (!isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
        isSignedIn = true;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signIn();
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
        isSignedIn = false;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signOut();
    }
}

function updateSignInButton() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');
    if (isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
    }
}

function initClient() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '154461832638-fpkleb6uhogkacq9k93721o8mjr2qc8t.apps.googleusercontent.com'
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButton();
    initClient();
});

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
        document.getElementById('clear-search-btn').style.display = 'block'; // Show the button
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none'; // Hide the button if no results
    }
}

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

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
    const movieDetailsContainer = document.getElementById('director-details-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const directorId = localStorage.getItem('selectedDirectorId');
    if (directorId) {
        fetchDirectorDetails(directorId);
    }
    else {
        document.getElementById('director-details-container').innerHTML = '<p>Director details not found.</p>';
    }
});

async function fetchDirectorDetails(directorId) {
    const directorUrl = `https://api.themoviedb.org/3/person/${directorId}?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    const creditsUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=c5a20c861acf7bb8d9e987dcc7f1b558`;
    try {
        const [directorResponse, creditsResponse] = await Promise.all([
            fetch(directorUrl),
            fetch(creditsUrl)
        ]);

        const director = await directorResponse.json();
        const credits = await creditsResponse.json();

        if (director.success === false) {
            document.getElementById('director-details-container').innerHTML = '<h2>No Information is Available for this Director</h2>';
        }
        else {
            populateDirectorDetails(director, credits);
        }
    }
    catch (error) {
        console.error('Error fetching director details:', error);
        document.getElementById('director-details-container').innerHTML = '<h2>Error fetching director details</h2>';
    }
}

function populateDirectorDetails(director, credits) {
    const directorImage = document.getElementById('director-image');
    const directorName = document.getElementById('director-name');
    const directorDescription = document.getElementById('director-description');
    if (director.profile_path) {
        directorImage.src = `https://image.tmdb.org/t/p/w1280${director.profile_path}`;
        directorName.textContent = director.name;
        document.title = `${director.name} - Director's Details`;
    }
    else {
        directorImage.style.display = 'none';
        directorName.textContent = director.name;
        const noImageText = document.createElement('h2');
        noImageText.textContent = 'Image Not Available';
        noImageText.style.textAlign = 'center';
        document.querySelector('.director-left').appendChild(noImageText);
    }
    directorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${director.biography || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${director.birthday || 'N/A'}</p>
        <p><strong>Age:</strong> ${director.birthday ? calculateAge(director.birthday) : 'N/A'}</p>
        <p><strong>Place of Birth:</strong> ${director.place_of_birth || 'N/A'}</p>
        <p><strong>Known For:</strong> Directing</p>
    `;
    const filmographyHeading = document.createElement('p');
    filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
    directorDescription.appendChild(filmographyHeading);
    const movieList = document.createElement('div');
    movieList.classList.add('movie-list');
    credits.crew.forEach(movie => {
        if (movie.job === "Director") {
            const movieLink = document.createElement('span');
            movieLink.textContent = movie.title;
            movieLink.classList.add('movie-link');
            movieLink.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', movie.id);
                window.location.href = 'movie-details.html';
            });
            movieList.appendChild(movieLink);
            movieList.appendChild(document.createTextNode(', '));
        }
    });
    filmographyHeading.appendChild(movieList);
}

function calculateAge(dob) {
    const date = new Date(dob);
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
