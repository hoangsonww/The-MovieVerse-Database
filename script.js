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
const otherTitle = document.getElementById("other1");

async function getMovies(url) {
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

function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main.appendChild(movieE1);
    });
}

window.addEventListener('resize', () => {
    getMovies(DATABASEURL);
});

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
        otherTitle.innerHTML = 'Check out other movies, too:';
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
const ACTIONpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=28&sort_by=popularity.desc&vote_count.gte=8";
const HORRORpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=27&sort_by=popularity.desc&vote_count.gte=8";
const DOCUMENTARYRpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=99&sort_by=popularity.desc&vote_count.gte=8";
const ANIMATIONpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=16&sort_by=popularity.desc&vote_count.gte=8";
const SCIFIpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=878&sort_by=popularity.desc&vote_count.gte=8";
const ROMANTICpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10749&sort_by=popularity.desc&vote_count.gte=8";
const THRILLERpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=53&sort_by=popularity.desc&vote_count.gte=8";
const MYSTERYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=9648&sort_by=popularity.desc&vote_count.gte=8";
const ADVENTUREpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=12&sort_by=popularity.desc&vote_count.gte=8";
const COMEDYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=35&sort_by=popularity.desc&vote_count.gte=8";
const FANTASYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=14&sort_by=popularity.desc&vote_count.gte=8";
const FAMILYpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10751&sort_by=popularity.desc&vote_count.gte=8";
const TVpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=10770&sort_by=popularity.desc&vote_count.gte=8";
const CRIMEpath = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_genres=80&sort_by=popularity.desc&vote_count.gte=8";

getMovies(DATABASEURL);

getMovies3(ACTIONpath);

async function getMovies3(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies3(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies3(movies) {
    main3.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main3.appendChild(movieE1);
    });
}

getMovies4(HORRORpath);

async function getMovies4(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies4(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies4(movies) {
    main4.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main4.appendChild(movieE1);
    });
}

getMovies5(DOCUMENTARYRpath);

async function getMovies5(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies5(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies5(movies) {
    main5.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main5.appendChild(movieE1);
    });
}

getMovies6(ANIMATIONpath);

async function getMovies6(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies6(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies6(movies) {
    main6.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main6.appendChild(movieE1);
    });
}

getMovies7(SCIFIpath);

async function getMovies7(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies7(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies7(movies) {
    main7.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
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
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies8(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies8(movies) {
    main8.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main8.appendChild(movieE1);
    });
}

getMovies9(THRILLERpath);

async function getMovies9(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies9(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies9(movies) {
    main9.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main9.appendChild(movieE1);
    });
}

getMovies10(MYSTERYpath);

async function getMovies10(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies10(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies10(movies) {
    main10.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main10.appendChild(movieE1);
    });
}

getMovies11(ADVENTUREpath);

async function getMovies11(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies11(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies11(movies) {
    main11.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main11.appendChild(movieE1);
    });
}

getMovies12(COMEDYpath);

async function getMovies12(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies12(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies12(movies) {
    main12.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main12.appendChild(movieE1);
    });
}

getMovies13(FANTASYpath);

async function getMovies13(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies13(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies13(movies) {
    main13.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main13.appendChild(movieE1);
    });
}

getMovies14(FAMILYpath);

async function getMovies14(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies14(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies14(movies) {
    main14.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main14.appendChild(movieE1);
    });
}

getMovies15(TVpath);

async function getMovies15(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies15(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies15(movies) {
    main15.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main15.appendChild(movieE1);
    });
}

getMovies16(CRIMEpath);

async function getMovies16(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies16(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies16(movies) {
    main16.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main16.appendChild(movieE1);
    });
}

const AWARD_WINNING_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=1000";
const main17 = document.getElementById('main17');

getMovies17(AWARD_WINNING_PATH);

async function getMovies17(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();
            allMovies = allMovies.concat(data.results);
        }
        showMovies17(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies17(movies) {
    main17.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main17.appendChild(movieE1);
    });
}

const HIDDEN_GEMS_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7&popularity.lte=10";
const main18 = document.getElementById('main18');

getMovies18(HIDDEN_GEMS_PATH);

async function getMovies18(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 3;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 1) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();

            allMovies = allMovies.concat(data.results);
        }
        showMovies18(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies18(movies) {
    main18.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main18.appendChild(movieE1);
    });
}

const CLASSIC_MOVIES_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=popularity.desc&release_date.lte=1980";
const main19 = document.getElementById('main19');

getMovies19(CLASSIC_MOVIES_PATH);

async function getMovies19(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 3;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 1) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();

            allMovies = allMovies.concat(data.results);
        }
        showMovies19(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies19(movies) {
    main19.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main19.appendChild(movieE1);
    });
}

const KOREAN_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_original_language=ko&sort_by=vote_average.desc,popularity.desc&vote_count.gte=10&vote_average.gte=8";
const main21 = document.getElementById('main21');

getMovies21(KOREAN_PATH);

async function getMovies21(url) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 3;
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 1) {
        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();

            allMovies = allMovies.concat(data.results);
        }
        showMovies21(allMovies.slice(0, numberOfMovies));
    }
}

function showMovies21(movies) {
    main21.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main21.appendChild(movieE1);
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

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const directors = [
    { name: "Alfred Hitchcock", id: "2636" },
    { name: "Steven Spielberg", id: "488" },
    { name: "Martin Scorsese", id: "1032" },
    { name: "Quentin Tarantino", id: "138" },
    { name: "Christopher Nolan", id: "525" },
    { name: "Stanley Kubrick", id: "976" },
    { name: "David Fincher", id: "7467" },
    { name: "James Cameron", id: "2710" },
    { name: "Francis Ford Coppola", id: "115" },
    { name: "Tim Burton", id: "510" },
    { name: "Ridley Scott", id: "578" },
    { name: "Joel Coen", id: "10544" },
    { name: "Clint Eastwood", id: "1571" },
    { name: "Spike Lee", id: "110" },
    { name: "Woody Allen", id: "1243" },
    { name: "Peter Jackson", id: "1392" },
    { name: "Oliver Stone", id: "1178" },
    { name: "David Lynch", id: "7470" },
    { name: "Roman Polanski", id: "119" },
    { name: "Wes Anderson", id: "565"},
    { name: "Sergio Leone", id: "1159" },
    { name: "Akira Kurosawa", id: "1911" },
    { name: "Federico Fellini", id: "490" },
    { name: "Ingmar Bergman", id: "52" },
    { name: "Billy Wilder", id: "711" },
    { name: "John Ford", id: "226" },
    { name: "Orson Welles", id: "336" },
    { name: "David Lean", id: "2449" },
    { name: "Fritz Lang", id: "24" },
    { name: "Frank Capra", id: "1487" },
    { name: "John Huston", id: "617" },
    { name: "Stanley Kubrick", id: "976" },
];

let currentDirectorIndex = 0;
const main20 = document.getElementById('main20');

updateDirectorSpotlight();

function changeDirector() {
    currentDirectorIndex = (currentDirectorIndex + 1) % directors.length;
    updateDirectorSpotlight();
}

setInterval(updateDirectorSpotlight, 3600000);

function calculateMoviesToDisplay2() {
    const screenWidth = window.innerWidth;
    // Assuming each movie takes equal width, calculate number of movies per row
    const moviesPerRow = Math.floor(screenWidth / 342); // 342px per movie (width + margins)
    return moviesPerRow * 2; // 2 rows
}

function updateDirectorSpotlight() {
    const director = directors[currentDirectorIndex];
    document.getElementById('spotlight-director-name').textContent = director.name;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_people=${director.id}&sort_by=popularity.desc&sort_by=vote_average.desc`;
    getDirectorSpotlight(url);
}

async function getDirectorSpotlight(url) {
    const numberOfMovies = calculateMoviesToDisplay2();
    const resp = await fetch(url);
    const respData = await resp.json();
    let allMovies = [];

    if (respData.results.length > 0) {
        allMovies = respData.results.slice(0, numberOfMovies);
        showMoviesDirectorSpotlight(allMovies);
    }
}

function showMoviesDirectorSpotlight(movies) {
    main20.innerHTML = ' ';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        voteAvg = vote_average.toFixed(1);
        movieE1.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        main20.appendChild(movieE1);
    });
}

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    // Add leading zero to minutes if less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Format the time in HH:MM format
    var timeString = hours + ':' + minutes;

    // Update the clock element
    document.getElementById('clock').innerHTML = timeString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initialize the clock on page load
window.onload = updateClock;
