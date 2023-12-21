/**
 * The main elements to display movies in.
 * @type {HTMLElement} The main element to display movies in.
 */
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
const main17 = document.getElementById('main17');
const main18 = document.getElementById('main18');
const main19 = document.getElementById('main19');
const main20 = document.getElementById('main20');
const main21 = document.getElementById('main21');
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other1");

/**
 * Fetches movies from the specified URL and displays them in the main element.
 * @param url The URL to fetch movies from
 * @param mainElement The element to display the movies in
 * @returns {Promise<void>} A promise that resolves when the movies are displayed
 */
async function getMovies(url, mainElement) {
    const numberOfMovies = calculateMoviesToDisplay();
    const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
    let allMovies = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();
        allMovies = allMovies.concat(data.results);
    }

    allMovies.sort((a, b) => b.vote_average - a.vote_average);

    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies), mainElement);
    }
    else {
        mainElement.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }
}

/**
 * Displays the specified movies in the main element.
 * @param movies The movies to display
 * @param mainElement The element to display the movies in
 */
function showMovies(movies, mainElement) {
    mainElement.innerHTML = '';
    movies.forEach(movie => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        const voteAvg = vote_average.toFixed(1);
        movieEl.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieEl.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
        });

        mainElement.appendChild(movieEl);
    });
}

/**
 * Fetches a random movie from the specified URL and redirects to the movie-details page.
 * @returns {Promise<void>} A promise that resolves when the movie is fetched
 */
async function showMovieOfTheDay() {
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

/**
 * Calculates the number of movies to display based on the screen width.
 * @returns {number} The number of movies to display
 */
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

window.addEventListener('resize', () => {
    getMovies(DATABASEURL, main);
});

/**
 * Returns the CSS class to use for the specified vote average.
 * @param vote
 * @returns {string}
 */
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
        getMovies(SEARCHPATH + searchTerm, main);
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
        getMovies(SEARCHPATH + searchTerm, main);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
});

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

/**
 * Toggles the side navigation bar.
 */
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

/**
 * Removes the side navigation bar.
 */
function removeNavBar() {
    const sideNav = document.getElementById('side-nav');
    if (sideNav.classList.contains('manual-toggle')) {
        sideNav.classList.remove('manual-toggle');
        sideNav.style.left = '-250px';
    }
}

/**
 * Scrolls to the top of the page.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * The URLs to fetch movies from.
 * @type {string}
 */
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
const KOREAN_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_original_language=ko&sort_by=vote_average.desc,popularity.desc&vote_count.gte=10&vote_average.gte=8";
const HIDDEN_GEMS_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7&popularity.lte=10";
const AWARD_WINNING_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=1000";
const CLASSIC_MOVIES_PATH = "https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=popularity.desc&release_date.lte=1980";

/**
 * Fetches movies from the specified URLs and displays them in their respective main elements.
 */
getMovies(DATABASEURL, main);
getMovies(ACTIONpath, main3);
getMovies(HORRORpath, main4);
getMovies(DOCUMENTARYRpath, main5);
getMovies(ANIMATIONpath, main6);
getMovies(SCIFIpath, main7);
getMovies(ROMANTICpath, main8);
getMovies(THRILLERpath, main9);
getMovies(MYSTERYpath, main10);
getMovies(ADVENTUREpath, main11);
getMovies(COMEDYpath, main12);
getMovies(FANTASYpath, main13);
getMovies(FAMILYpath, main14);
getMovies(TVpath, main15);
getMovies(CRIMEpath, main16);
getMovies(AWARD_WINNING_PATH, main17);
getMovies(HIDDEN_GEMS_PATH, main18);
getMovies(CLASSIC_MOVIES_PATH, main19);
getMovies(KOREAN_PATH, main21);

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
updateDirectorSpotlight();

/**
 * Changes the director in the spotlight.
 */
function changeDirector() {
    let randomIndex = Math.floor(Math.random() * directors.length);
    while(randomIndex === currentDirectorIndex) {
        randomIndex = Math.floor(Math.random() * directors.length);
    }

    currentDirectorIndex = randomIndex;
    updateDirectorSpotlight();
}

setInterval(updateDirectorSpotlight, 3600000);

/**
 * Calculates the number of movies to display based on the screen width.
 * @returns {number}
 */
function calculateMoviesToDisplay2() {
    const screenWidth = window.innerWidth;
    const moviesPerRow = Math.floor(screenWidth / 342);
    return moviesPerRow * 2;
}

/**
 * Updates the director in the spotlight.
 */
function updateDirectorSpotlight() {
    const director = directors[currentDirectorIndex];
    document.getElementById('spotlight-director-name').textContent = director.name;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&with_people=${director.id}&sort_by=popularity.desc&sort_by=vote_average.desc`;
    getDirectorSpotlight(url);
}

/**
 * Fetches movies from the specified URL and displays them in the main element.
 * @param url The URL to fetch movies from
 * @returns {Promise<void>} A promise that resolves when the movies are displayed
 */
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

/**
 * Displays the specified movies in the main element.
 * @param movies The movies to display
 */
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

/**
 * Updates the clock.
 */
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes;
    document.getElementById('clock').innerHTML = timeString;
}

setInterval(updateClock, 1000);
window.onload = updateClock;
