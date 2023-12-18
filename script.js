const main = document.getElementById("main");
const main2 = document.getElementById("main2");
const main3 = document.getElementById("main3");
const main4 = document.getElementById("main4");
const main5 = document.getElementById("main5");
const main6 = document.getElementById("main6");
const main7 = document.getElementById("main7");
const main8 = document.getElementById("main8");
const main9 = document.getElementById("main9");
const main10 = document.getElementById("main10");
const main11 = document.getElementById("main11");
const main12 = document.getElementById("main12");
const main13 = document.getElementById("main13");
const main14 = document.getElementById("main14");
const main15 = document.getElementById("main15");
const main16 = document.getElementById("main16");
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other");

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    if (respData.results.length > 0) {
        showMovies(respData.results);
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }
}

async function showMovieOfTheDay() {
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

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer" /> 
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
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
})

const DATABASEURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const ACTIONpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=28";
const HORRORpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=27";
const DOCUMENTARYRpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=99";
const ANIMATIONpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=16";
const SCIFIpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=878";
const ROMANTICpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10749";
const THRILLERpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=53";
const MYSTERYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=9648";
const ADVENTUREpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=12";
const COMEDYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=35";
const FANTASYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=14";
const FAMILYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10751";
const TVpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10770";
const CRIMEpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=80";

getMovies(DATABASEURL);

getMovies3(ACTIONpath);

async function getMovies3(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies3(respData.results);
}

function showMovies3(movies) {
    main3.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main3.appendChild(movieE1);
    });
}

getMovies4(HORRORpath);

async function getMovies4(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies4(respData.results);
}

function showMovies4(movies) {
    main4.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main4.appendChild(movieE1);
    });
}

getMovies5(DOCUMENTARYRpath);

async function getMovies5(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies5(respData.results);
}

function showMovies5(movies) {
    main5.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main5.appendChild(movieE1);
    });
}

getMovies6(ANIMATIONpath);

async function getMovies6(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies6(respData.results);
}

function showMovies6(movies) {
    main6.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main6.appendChild(movieE1);
    });
}

getMovies7(SCIFIpath);

async function getMovies7(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies7(respData.results);
}

function showMovies7(movies) {
    main7.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main7.appendChild(movieE1); // Append the movie element to main7
    });
}


getMovies8(ROMANTICpath);

async function getMovies8(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies8(respData.results);
}

function showMovies8(movies) {
    main8.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main8.appendChild(movieE1);
    });
}

getMovies9(THRILLERpath);

async function getMovies9(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies9(respData.results);
}

function showMovies9(movies) {
    main9.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main9.appendChild(movieE1);
    });
}

getMovies10(MYSTERYpath);

async function getMovies10(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies10(respData.results);
}

function showMovies10(movies) {
    main10.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main10.appendChild(movieE1);
    });
}

getMovies11(ADVENTUREpath);

async function getMovies11(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies11(respData.results);
}

function showMovies11(movies) {
    main11.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main11.appendChild(movieE1);
    });
}

getMovies12(COMEDYpath);

async function getMovies12(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies12(respData.results);
}

function showMovies12(movies) {
    main12.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main12.appendChild(movieE1);
    });
}

getMovies13(FANTASYpath);

async function getMovies13(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies13(respData.results);
}

function showMovies13(movies) {
    main13.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main13.appendChild(movieE1);
    });
}

getMovies14(FAMILYpath);

async function getMovies14(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies14(respData.results);
}

function showMovies14(movies) {
    main14.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main14.appendChild(movieE1);
    });
}

getMovies15(TVpath);

async function getMovies15(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies15(respData.results);
}

function showMovies15(movies) {
    main15.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main15.appendChild(movieE1);
    });
}

getMovies16(CRIMEpath);

async function getMovies16(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies16(respData.results);
}

function showMovies16(movies) {
    main16.innerHTML = ' ';
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
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        // Add a click event listener to each movie element
        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });
        main16.appendChild(movieE1);
    });
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

document.addEventListener('click', function () {
    const sideNav = document.getElementById('side-nav');
    if (!sideNav.classList.contains('manual-toggle')) {
        sideNav.style.left = '-250px';
    }
})

function toggleNav() {
    const sideNav = document.getElementById('side-nav');
    sideNav.classList.toggle('manual-toggle');
    if (sideNav.classList.contains('manual-toggle')) {
        sideNav.style.left = '0px';
    }
    else {
        sideNav.style.left = '-250px';
    }
}

function removeNavBar() {
    const sideNav = document.getElementById('side-nav');
    if (sideNav.classList.contains('manual-toggle')) {
        sideNav.classList.remove('manual-toggle');
        sideNav.style.left = '-250px';
    }
}

