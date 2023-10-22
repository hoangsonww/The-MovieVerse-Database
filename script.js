const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const MOVIEAPI = "https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2022-09-15&primary_release_date.lte=2022-10-22&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&page=1";
const ACTIONAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=28";
const HORRORAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=27";
const DOCUMENTARYRAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=99";
const ANIMATIONAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=16";
const SCIFIAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=878";
const ROMANTICAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10749";
const THRILLERAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=53";
const MYSTERYAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=9648";
const ADVENTUREAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=12";
const COMEDYAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=35";
const FANTASYAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=14";
const FAMILYAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10751";
const TVAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10770";
const CRIMEAPI = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=80";

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
const searchButon = document.getElementById("button-search");

getMovies(APIURL);

async function getMovies(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies(respData.results);
}

function showMovies(movies) {
    main.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
                                    vote_average
                                )}">${vote_average}</span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
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
        getMovies(SEARCHAPI + searchTerm);
        search.value='';

    }
})

searchButon.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        search.value='';

    }
})

getMovies2(MOVIEAPI);

async function getMovies2(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies2(respData.results);
}

function showMovies2(movies) {
    main2.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
                                vote_average
                             )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main2.appendChild(movieE1);
    });
}

getMovies3(ACTIONAPI);

async function getMovies3(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies3(respData.results);
}

function showMovies3(movies) {
    main3.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main3.appendChild(movieE1);
    });
}

getMovies4(HORRORAPI);

async function getMovies4(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies4(respData.results);
}

function showMovies4(movies) {
    main4.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main4.appendChild(movieE1);
    });
}

getMovies5(DOCUMENTARYRAPI);

async function getMovies5(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies5(respData.results);
}

function showMovies5(movies) {
    main5.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main5.appendChild(movieE1);
    });
}

getMovies6(ANIMATIONAPI);

async function getMovies6(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies6(respData.results);
}

function showMovies6(movies) {
    main6.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main6.appendChild(movieE1);
    });
}

getMovies7(SCIFIAPI);

async function getMovies7(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies7(respData.results);
}

function showMovies7(movies) {
    main7.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main7.appendChild(movieE1);
    });
}

getMovies8(ROMANTICAPI);

async function getMovies8(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies8(respData.results);
}

function showMovies8(movies) {
    main8.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main8.appendChild(movieE1);
    });
}

getMovies9(THRILLERAPI);

async function getMovies9(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies9(respData.results);
}

function showMovies9(movies) {
    main9.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main9.appendChild(movieE1);
    });
}

getMovies10(MYSTERYAPI);

async function getMovies10(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies10(respData.results);
}

function showMovies10(movies) {
    main10.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main10.appendChild(movieE1);
    });
}

getMovies11(ADVENTUREAPI);

async function getMovies11(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies11(respData.results);
}

function showMovies11(movies) {
    main11.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main11.appendChild(movieE1);
    });
}

getMovies12(COMEDYAPI);

async function getMovies12(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies12(respData.results);
}

function showMovies12(movies) {
    main12.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main12.appendChild(movieE1);
    });
}

getMovies13(FANTASYAPI);

async function getMovies13(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies13(respData.results);
}

function showMovies13(movies) {
    main13.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main13.appendChild(movieE1);
    });
}

getMovies14(FAMILYAPI);

async function getMovies14(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies14(respData.results);
}

function showMovies14(movies) {
    main14.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main14.appendChild(movieE1);
    });
}

getMovies15(TVAPI);

async function getMovies15(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies15(respData.results);
}

function showMovies15(movies) {
    main15.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main15.appendChild(movieE1);
    });
}

getMovies16(CRIMEAPI);

async function getMovies16(url) {
    const resp = await fetch (url);
    const respData = await resp.json();

    showMovies16(respData.results);
}

function showMovies16(movies) {
    main16.innerHTML = ' ';
    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        movieE1.innerHTML = `<img 
                                src="${IMGPATH + poster_path}" 
                                alt="${title}"
                             /> 
                             <div class="movie-info">
                                <h3>${title}</h3>
                                <span class="${getClassByRate(
            vote_average
        )}">${vote_average}
                             </span>
                             </div>
                             <div class="overview">
                                <h4>Movie Intro: </h4>
                                ${overview}
                             </div>   
                            `;
        main16.appendChild(movieE1);
    });
}

const heading = document.getElementById('my-heading');
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

let timeoutID;
let colorID;

function changeBackgroundColor(event) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    event.target.style.color = randomColor;
    timeoutID = setTimeout(resetBackgroundColor, 500);
}

function resetBackgroundColor(event) {
    event.target.style.color = 'orange';
    clearTimeout(timeoutID);
}

heading.addEventListener('mouseover', changeBackgroundColor);
heading.addEventListener('mouseout', resetBackgroundColor);

