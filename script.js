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
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies(respData.results);
}

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer" /> 
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
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
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
        search.value='';

    }
})

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        search.value='';

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
