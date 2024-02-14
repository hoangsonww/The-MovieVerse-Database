const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");

const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const form = document.getElementById("form1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const favoriteButton = document.getElementById("favorite-btn");
const searchTitle = document.getElementById("search-title");

let trailerUrlGlobal;
let initialMainContent;

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
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'search.html';
});

function handleSearch() {
    const searchQuery = document.getElementById('search').value;
    localStorage.setItem('searchQuery', searchQuery);
    window.location.href = 'search.html';
}

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

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('movie-details-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
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
            : `<div class="no-image" style="text-align: center; padding: 20px;">Movie Image Not Available</div>`;

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
            updateMovieVisitCount(id, title);
        });

        main.appendChild(movieE1);
    });
    applySettings();
}

function rotateUserStats() {
    const stats = [
        {
            label: "Your Current Time",
            getValue: () => {
                const now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return `${hours}:${minutes}`;
            }
        },
        { label: "Most Visited Movie", getValue: getMostVisitedMovie },
        { label: "Your Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Your Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Your Unique Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Your Favorited Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Your Most Common Favorited Genre",
            getValue: getMostCommonGenre
        },
        { label: "Your Created Watchlists", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Your Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Your Unique Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Your Unique Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
            }
        },
        {
            label: "Your Unique Production Companies Discovered",
            getValue: () => {
                const viewedCompanies = JSON.parse(localStorage.getItem('uniqueCompaniesViewed')) || [];
                return viewedCompanies.length;
            }
        },
        { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy },
    ];

    let currentStatIndex = 0;

    function updateStatDisplay() {
        const currentStat = stats[currentStatIndex];
        document.getElementById('stats-label').textContent = currentStat.label + ':';
        document.getElementById('stats-display').textContent = currentStat.getValue();
        currentStatIndex = (currentStatIndex + 1) % stats.length;
    }

    updateStatDisplay();

    const localTimeDiv = document.getElementById('local-time');
    let statRotationInterval = setInterval(updateStatDisplay, 3000);

    localTimeDiv.addEventListener('click', () => {
        clearInterval(statRotationInterval);
        updateStatDisplay();
        statRotationInterval = setInterval(updateStatDisplay, 3000);
    });
}

function updateMovieVisitCount(movieId, movieTitle) {
    let movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};

    if (!movieVisits[movieId]) {
        movieVisits[movieId] = { count: 0, title: movieTitle };
    }
    movieVisits[movieId].count += 1;
    localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
}

function getMostVisitedDirector() {
    const directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
    let mostVisitedDirector = '';
    let maxVisits = 0;

    for (const directorId in directorVisits) {
        if (directorVisits[directorId].count > maxVisits) {
            mostVisitedDirector = directorVisits[directorId].name;
            maxVisits = directorVisits[directorId].count;
        }
    }

    return mostVisitedDirector || 'Not Available';
}

function getMostVisitedMovie() {
    const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
    let mostVisitedMovie = '';
    let maxVisits = 0;

    for (const movieId in movieVisits) {
        if (movieVisits[movieId].count > maxVisits) {
            mostVisitedMovie = movieVisits[movieId].title;
            maxVisits = movieVisits[movieId].count;
        }
    }

    return mostVisitedMovie || 'Not Available';
}

function getMostVisitedActor() {
    const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    let mostVisitedActor = '';
    let maxVisits = 0;

    for (const actorId in actorVisits) {
        if (actorVisits[actorId].count > maxVisits) {
            mostVisitedActor = actorVisits[actorId].name;
            maxVisits = actorVisits[actorId].count;
        }
    }

    return mostVisitedActor || 'Not Available';
}

function getTriviaAccuracy() {
    let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || { totalCorrect: 0, totalAttempted: 0 };
    if (triviaStats.totalAttempted === 0) {
        return 'No trivia attempted';
    }

    let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
    return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
    const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || {};
    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in favoriteGenres) {
        if (favoriteGenres[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = favoriteGenres[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

function setStarRating(rating) {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        star.style.color = star.dataset.value > rating ? 'white' : 'gold';
    });

    document.getElementById('rating-value').textContent = `${rating}.0/5.0`;
}

document.querySelectorAll('.rating .star').forEach(star => {
    star.addEventListener('mouseover', (e) => {
        setStarRating(e.target.dataset.value);
    });

    star.addEventListener('mouseout', () => {
        const movieId = localStorage.getItem('selectedMovieId');
        const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const movieRating = savedRatings[movieId] || 0;
        setStarRating(movieRating);
    });

    star.addEventListener('click', (e) => {
        const movieId = localStorage.getItem('selectedMovieId');
        const rating = e.target.dataset.value;
        const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        savedRatings[movieId] = rating;
        localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
        setStarRating(rating);
        updateAverageMovieRating(movieId, rating);
        window.location.reload();
    });
});

function updateUniqueDirectorsViewed(directorId) {
    let viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
    if (!viewedDirectors.includes(directorId)) {
        viewedDirectors.push(directorId);
        localStorage.setItem('uniqueDirectorsViewed', JSON.stringify(viewedDirectors));
    }
}

function updateActorVisitCount(actorId, actorName) {
    let actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    if (!actorVisits[actorId]) {
        actorVisits[actorId] = { count: 0, name: actorName };
    }

    actorVisits[actorId].count += 1;
    localStorage.setItem('actorVisits', JSON.stringify(actorVisits));
}

function updateDirectorVisitCount(directorId, directorName) {
    let directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
    if (!directorVisits[directorId]) {
        directorVisits[directorId] = { count: 0, name: directorName };
    }

    directorVisits[directorId].count += 1;
    localStorage.setItem('directorVisits', JSON.stringify(directorVisits));
}

document.addEventListener('DOMContentLoaded', () => {
    initialMainContent = document.getElementById('main').innerHTML;

    const movieId = localStorage.getItem('selectedMovieId');
    if (movieId) {
        fetchMovieDetails(movieId);
    }
    else {
        document.getElementById('movie-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw;">
                <h2>Movie details not found.</h2>
            </div>`;
    }

    document.getElementById('clear-search-btn').style.display = 'none';

    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    const movieRating = savedRatings[movieId] || 0;
    setStarRating(movieRating);
});

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

function handleSignInOut() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    if (isSignedIn) {
        localStorage.setItem('isSignedIn', JSON.stringify(false));
        alert('You have been signed out.');
    }
    else {
        window.location.href = 'sign-in.html';
        return;
    }

    updateSignInButtonState();
}

function updateSignInButtonState() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    const signInText = document.getElementById('signInOutText');
    const signInIcon = document.getElementById('signInIcon');
    const signOutIcon = document.getElementById('signOutIcon');

    if (isSignedIn) {
        signInText.textContent = 'Sign Out';
        signInIcon.style.display = 'none';
        signOutIcon.style.display = 'inline-block';
    }
    else {
        signInText.textContent = 'Sign In';
        signInIcon.style.display = 'inline-block';
        signOutIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButtonState();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

const twoLetterLangCodes = [
    { "code": "aa", "name": "Afar" },
    { "code": "ab", "name": "Abkhazian" },
    { "code": "ae", "name": "Avestan" },
    { "code": "af", "name": "Afrikaans" },
    { "code": "ak", "name": "Akan" },
    { "code": "am", "name": "Amharic" },
    { "code": "an", "name": "Aragonese" },
    { "code": "ar", "name": "Arabic" },
    { "code": "as", "name": "Assamese" },
    { "code": "av", "name": "Avaric" },
    { "code": "ay", "name": "Aymara" },
    { "code": "az", "name": "Azerbaijani" },
    { "code": "ba", "name": "Bashkir" },
    { "code": "be", "name": "Belarusian" },
    { "code": "bg", "name": "Bulgarian" },
    { "code": "bh", "name": "Bihari languages" },
    { "code": "bi", "name": "Bislama" },
    { "code": "bm", "name": "Bambara" },
    { "code": "bn", "name": "Bengali" },
    { "code": "bo", "name": "Tibetan" },
    { "code": "br", "name": "Breton" },
    { "code": "bs", "name": "Bosnian" },
    { "code": "ca", "name": "Catalan; Valencian" },
    { "code": "ce", "name": "Chechen" },
    { "code": "ch", "name": "Chamorro" },
    { "code": "co", "name": "Corsican" },
    { "code": "cr", "name": "Cree" },
    { "code": "cs", "name": "Czech" },
    {
        "code": "cu",
        "name": "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic"
    },
    { "code": "cv", "name": "Chuvash" },
    { "code": "cy", "name": "Welsh" },
    { "code": "da", "name": "Danish" },
    { "code": "de", "name": "German" },
    { "code": "dv", "name": "Divehi; Dhivehi; Maldivian" },
    { "code": "dz", "name": "Dzongkha" },
    { "code": "ee", "name": "Ewe" },
    { "code": "el", "name": "Greek, Modern (1453-)" },
    { "code": "en", "name": "English" },
    { "code": "eo", "name": "Esperanto" },
    { "code": "es", "name": "Spanish; Castilian" },
    { "code": "et", "name": "Estonian" },
    { "code": "eu", "name": "Basque" },
    { "code": "fa", "name": "Persian" },
    { "code": "ff", "name": "Fulah" },
    { "code": "fi", "name": "Finnish" },
    { "code": "fj", "name": "Fijian" },
    { "code": "fo", "name": "Faroese" },
    { "code": "fr", "name": "French" },
    { "code": "fy", "name": "Western Frisian" },
    { "code": "ga", "name": "Irish" },
    { "code": "gd", "name": "Gaelic; Scomttish Gaelic" },
    { "code": "gl", "name": "Galician" },
    { "code": "gn", "name": "Guarani" },
    { "code": "gu", "name": "Gujarati" },
    { "code": "gv", "name": "Manx" },
    { "code": "ha", "name": "Hausa" },
    { "code": "he", "name": "Hebrew" },
    { "code": "hi", "name": "Hindi" },
    { "code": "ho", "name": "Hiri Motu" },
    { "code": "hr", "name": "Croatian" },
    { "code": "ht", "name": "Haitian; Haitian Creole" },
    { "code": "hu", "name": "Hungarian" },
    { "code": "hy", "name": "Armenian" },
    { "code": "hz", "name": "Herero" },
    {
        "code": "ia",
        "name": "Interlingua (International Auxiliary Language Association)"
    },
    { "code": "id", "name": "Indonesian" },
    { "code": "ie", "name": "Interlingue; Occidental" },
    { "code": "ig", "name": "Igbo" },
    { "code": "ii", "name": "Sichuan Yi; Nuosu" },
    { "code": "ik", "name": "Inupiaq" },
    { "code": "io", "name": "Ido" },
    { "code": "is", "name": "Icelandic" },
    { "code": "it", "name": "Italian" },
    { "code": "iu", "name": "Inuktitut" },
    { "code": "ja", "name": "Japanese" },
    { "code": "jv", "name": "Javanese" },
    { "code": "ka", "name": "Georgian" },
    { "code": "kg", "name": "Kongo" },
    { "code": "ki", "name": "Kikuyu; Gikuyu" },
    { "code": "kj", "name": "Kuanyama; Kwanyama" },
    { "code": "kk", "name": "Kazakh" },
    { "code": "kl", "name": "Kalaallisut; Greenlandic" },
    { "code": "km", "name": "Central Khmer" },
    { "code": "kn", "name": "Kannada" },
    { "code": "ko", "name": "Korean" },
    { "code": "kr", "name": "Kanuri" },
    { "code": "ks", "name": "Kashmiri" },
    { "code": "ku", "name": "Kurdish" },
    { "code": "kv", "name": "Komi" },
    { "code": "kw", "name": "Cornish" },
    { "code": "ky", "name": "Kirghiz; Kyrgyz" },
    { "code": "la", "name": "Latin" },
    { "code": "lb", "name": "Luxembourgish; Letzeburgesch" },
    { "code": "lg", "name": "Ganda" },
    { "code": "li", "name": "Limburgan; Limburger; Limburgish" },
    { "code": "ln", "name": "Lingala" },
    { "code": "lo", "name": "Lao" },
    { "code": "lt", "name": "Lithuanian" },
    { "code": "lu", "name": "Luba-Katanga" },
    { "code": "lv", "name": "Latvian" },
    { "code": "mg", "name": "Malagasy" },
    { "code": "mh", "name": "Marshallese" },
    { "code": "mi", "name": "Maori" },
    { "code": "mk", "name": "Macedonian" },
    { "code": "ml", "name": "Malayalam" },
    { "code": "mn", "name": "Mongolian" },
    { "code": "mr", "name": "Marathi" },
    { "code": "ms", "name": "Malay" },
    { "code": "mt", "name": "Maltese" },
    { "code": "my", "name": "Burmese" },
    { "code": "na", "name": "Nauru" },
    {
        "code": "nb",
        "name": "Bokmål, Norwegian; Norwegian Bokmål"
    },
    { "code": "nd", "name": "Ndebele, North; North Ndebele" },
    { "code": "ne", "name": "Nepali" },
    { "code": "ng", "name": "Ndonga" },
    { "code": "nl", "name": "Dutch; Flemish" },
    { "code": "nn", "name": "Norwegian Nynorsk; Nynorsk, Norwegian" },
    { "code": "no", "name": "Norwegian" },
    { "code": "nr", "name": "Ndebele, South; South Ndebele" },
    { "code": "nv", "name": "Navajo; Navaho" },
    { "code": "ny", "name": "Chichewa; Chewa; Nyanja" },
    { "code": "oc", "name": "Occitan (post 1500)" },
    { "code": "oj", "name": "Ojibwa" },
    { "code": "om", "name": "Oromo" },
    { "code": "or", "name": "Oriya" },
    { "code": "os", "name": "Ossetian; Ossetic" },
    { "code": "pa", "name": "Panjabi; Punjabi" },
    { "code": "pi", "name": "Pali" },
    { "code": "pl", "name": "Polish" },
    { "code": "ps", "name": "Pushto; Pashto" },
    { "code": "pt", "name": "Portuguese" },
    { "code": "qu", "name": "Quechua" },
    { "code": "rm", "name": "Romansh" },
    { "code": "rn", "name": "Rundi" },
    { "code": "ro", "name": "Romanian; Moldavian; Moldovan" },
    { "code": "ru", "name": "Russian" },
    { "code": "rw", "name": "Kinyarwanda" },
    { "code": "sa", "name": "Sanskrit" },
    { "code": "sc", "name": "Sardinian" },
    { "code": "sd", "name": "Sindhi" },
    { "code": "se", "name": "Northern Sami" },
    { "code": "sg", "name": "Sango" },
    { "code": "si", "name": "Sinhala; Sinhalese" },
    { "code": "sk", "name": "Slovak" },
    { "code": "sl", "name": "Slovenian" },
    { "code": "sm", "name": "Samoan" },
    { "code": "sn", "name": "Shona" },
    { "code": "so", "name": "Somali" },
    { "code": "sq", "name": "Albanian" },
    { "code": "sr", "name": "Serbian" },
    { "code": "ss", "name": "Swati" },
    { "code": "st", "name": "Sotho, Southern" },
    { "code": "su", "name": "Sundanese" },
    { "code": "sv", "name": "Swedish" },
    { "code": "sw", "name": "Swahili" },
    { "code": "ta", "name": "Tamil" },
    { "code": "te", "name": "Telugu" },
    { "code": "tg", "name": "Tajik" },
    { "code": "th", "name": "Thai" },
    { "code": "ti", "name": "Tigrinya" },
    { "code": "tk", "name": "Turkmen" },
    { "code": "tl", "name": "Tagalog" },
    { "code": "tn", "name": "Tswana" },
    { "code": "to", "name": "Tonga (Tonga Islands)" },
    { "code": "tr", "name": "Turkish" },
    { "code": "ts", "name": "Tsonga" },
    { "code": "tt", "name": "Tatar" },
    { "code": "tw", "name": "Twi" },
    { "code": "ty", "name": "Tahitian" },
    { "code": "ug", "name": "Uighur; Uyghur" },
    { "code": "uk", "name": "Ukrainian" },
    { "code": "ur", "name": "Urdu" },
    { "code": "uz", "name": "Uzbek" },
    { "code": "ve", "name": "Venda" },
    { "code": "vi", "name": "Vietnamese" },
    { "code": "vo", "name": "Volapük" },
    { "code": "wa", "name": "Walloon" },
    { "code": "wo", "name": "Wolof" },
    { "code": "xh", "name": "Xhosa" },
    { "code": "yi", "name": "Yiddish" },
    { "code": "yo", "name": "Yoruba" },
    { "code": "za", "name": "Zhuang; Chuang" },
    { "code": "zh", "name": "Chinese" },
    { "code": "zu", "name": "Zulu" }
];

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButton();
    initClient();
    applySettings();
});

async function fetchMovieDetails(movieId) {
    const code = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;
    const url2 = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=videos`;
    const imdbUrl = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=external_ids`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        const imdbId = movie.imdb_id;

        fetchMovieRatings(imdbId, movie);

        const response2 = await fetch(url2);
        const movie2 = await response2.json();
        const trailers = movie2.videos.results.filter(video => video.type === 'Trailer');

        if (trailers.length > 0) {
            const trailerUrl = `https://www.youtube.com/watch?v=${trailers[0].key}`;
            trailerButton = createTrailerButton(trailerUrl);
            positionTrailerButton();
        }
        updateBrowserURL(movie.title);
    }
    catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function getRatingDetails(rating) {
    let details = { color: 'black', text: rating, description: '' };

    switch (rating) {
        case 'R':
            details = {
                color: 'red',
                text: 'R (Restricted)',
                description: ' - No one 17 and under admitted'
            };
            break;
        case 'PG-13':
            details = {
                color: 'yellow',
                text: 'PG-13 (Parents Strongly Cautioned)',
                description: ' - May be inappropriate for children under 13'
            };
            break;
        case 'PG':
            details = {
                color: 'orange',
                text: 'PG (Parental Guidance Suggested)',
                description: ' - May not be suitable for children'
            };
            break;
        case 'G':
            details = {
                color: 'green',
                text: 'G (General Audiences)',
                description: ' - All ages admitted'
            };
            break;
        case 'NC-17':
            details = {
                color: 'darkred',
                text: 'NC-17 (Adults Only)',
                description: ' - No one 17 and under admitted'
            };
            break;
        case 'TV-Y':
            details = {
                color: 'lightgreen',
                text: 'TV-Y (All Children)',
                description: ' - Appropriate for all children'
            };
            break;
        case 'TV-Y7':
            details = {
                color: 'lightblue',
                text: 'TV-Y7 (Directed to Older Children)',
                description: ' - Suitable for children ages 7 and up'
            };
            break;
        case 'TV-G':
            details = {
                color: 'green',
                text: 'TV-G (General Audience)',
                description: ' - Suitable for all ages'
            };
            break;
        case 'TV-PG':
            details = {
                color: 'orange',
                text: 'TV-PG (Parental Guidance Suggested)',
                description: ' - May not be suitable for younger children'
            };
            break;
        case 'TV-14':
            details = {
                color: 'yellow',
                text: 'TV-14 (Parents Strongly Cautioned)',
                description: ' - May be inappropriate for children under 14'
            };
            break;
        case 'TV-MA':
            details = {
                color: 'red',
                text: 'TV-MA (Mature Audience Only)',
                description: ' - Specifically designed to be viewed by adults'
            };
            break;
        case 'NR':
            details = {
                color: 'grey',
                text: 'NR (Not Rated)',
                description: ' - Movie has not been officially rated'
            };
            break;
        case 'UR':
        case 'Unrated':
            details = {
                color: 'grey',
                text: 'UR (Unrated)',
                description: ' - Contains content not used in the rated version'
            };
            break;
        default:
            details = {
                color: 'white',
                text: rating,
                description: ' - Rating information not available'
            };
            break;
    }

    return details;
}

function getMovieCode2() {
    const encodedKey = "MmJhOGU1MzY=";
    return atob(encodedKey);
}

async function fetchMovieRatings(imdbId, tmdbMovieData) {
    const omdbApiKey = `${getMovieCode2()}`;
    const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`;

    try {
        const response = await fetch(omdbUrl);
        const data = await response.json();

        let imdbRating = data.imdbRating ? data.imdbRating : 'N/A';

        if (imdbRating === 'N/A' && tmdbMovieData.vote_average) {
            imdbRating = (tmdbMovieData.vote_average / 2).toFixed(1) * 2;
        }

        const rtRatingObj = data.Ratings.find(rating => rating.Source === "Rotten Tomatoes");
        let rtRating = rtRatingObj ? rtRatingObj.Value : 'N/A';

        let metascore = data.Metascore ? `${data.Metascore}/100` : 'N/A';
        let awards = data.Awards;
        let rated = data.Rated ? data.Rated : 'Rating information unavailable';

        if (awards === 'N/A') {
            awards = 'No awards information available';
        }

        if (metascore === 'N/A/100') {
            const metacriticsRatingValue = imdbRating !== 'N/A' ? parseFloat(imdbRating) : (tmdbMovieData.vote_average / 2);
            metascore = calculateFallbackMetacriticsRating(metacriticsRatingValue, tmdbMovieData.vote_average) + '/100';
        }

        if (rtRating === 'N/A') {
            const imdbRatingValue = imdbRating !== 'N/A' ? parseFloat(imdbRating) : (tmdbMovieData.vote_average / 2);
            rtRating = calculateFallbackRTRating(imdbRatingValue, tmdbMovieData.vote_average)
        }
        populateMovieDetails(tmdbMovieData, imdbRating, rtRating, metascore, awards, rated);
    }
    catch (error) {
        console.error('Error fetching movie ratings:', error);
        const fallbackImdbRating = (tmdbMovieData.vote_average / 2).toFixed(1) * 2;
        populateMovieDetails(tmdbMovieData, fallbackImdbRating, 'N/A', 'No metascore information available', 'No awards information available');
    }
}

function updateBrowserURL(title) {
    const nameSlug = createNameSlug(title);
    const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + nameSlug;
    window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(title) {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}

function calculateFallbackRTRating(imdbRating, tmdbRating) {
    const normalizedImdbRating = imdbRating * 10;
    const normalizedTmdbRating = tmdbRating * 10;

    const weightImdb = 0.8;
    const weightTmdb = 0.1;

    return ((normalizedImdbRating * weightImdb) + (normalizedTmdbRating * weightTmdb)).toFixed(0) + '%'; // Calculate fallback RT rating out of 100% scale (in case data is not available from OMDB)
}

function calculateFallbackMetacriticsRating(imdbRating, tmdbRating) {
    const normalizedImdbRating = imdbRating * 10;
    const normalizedTmdbRating = tmdbRating * 10;

    const weightImdb = 0.8;
    const weightTmdb = 0.1;

    return ((normalizedImdbRating * weightImdb) + (normalizedTmdbRating * weightTmdb)).toFixed(0); // Calculate fallback Metacritics rating out of 100 scale (in case data is not available from OMDB)
}

let trailerIframeDisplayed = false;

function createTrailerButton(trailerUrl) {
    const trailerButton = document.createElement('button');
    trailerButton.textContent = 'Watch Trailer';
    trailerButton.title = 'Click to watch the trailer of this movie';

    trailerButton.addEventListener('click', function() {
        if (!trailerIframeDisplayed) {
            showTrailerIframe(trailerUrl);
            trailerButton.textContent = 'Close Trailer';
            trailerButton.title = 'Click to close the trailer';
        }
        else {
            closeTrailerIframe();
            trailerButton.textContent = 'Watch Trailer';
            trailerButton.title = 'Click to watch the trailer of this movie';
        }
    });

    trailerButton.classList.add('trailer-button');
    trailerButton.style.font = 'inherit';

    return trailerButton;
}

function closeTrailerIframe() {
    const iframeContainer = document.querySelector('.trailer-button + div');

    if (iframeContainer) {
        iframeContainer.style.height = '0';
        setTimeout(() => iframeContainer.remove(), 500);
    }
    trailerIframeDisplayed = false;
}

function getYouTubeVideoId(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
}

function positionTrailerButton() {
    if (!trailerButton)
        return;

    if (window.innerWidth <= 900) {
        const movieDescription = document.getElementById('movie-description');
        movieDescription.parentNode.insertBefore(trailerButton, movieDescription);
    }
    else {
        const movieRating = document.getElementById('movie-rating');
        movieRating.parentNode.insertBefore(trailerButton, movieRating.nextSibling);
    }
}

document.addEventListener('DOMContentLoaded', positionTrailerButton);

function showTrailerIframe(trailerUrl) {
    trailerUrlGlobal = trailerUrl;

    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'relative';
    iframeContainer.style.width = '400px';
    iframeContainer.style.margin = '0 auto';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.height = '0';
    iframeContainer.style.transition = 'height 0.5s ease-in-out';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${getYouTubeVideoId(trailerUrl)}?autoplay=1`);
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '315');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', true);

    iframeContainer.appendChild(iframe);

    const trailerButton = document.querySelector('.trailer-button');
    trailerButton.parentNode.insertBefore(iframeContainer, trailerButton.nextSibling);

    setTimeout(() => iframeContainer.style.height = '315px', 50);

    trailerIframeDisplayed = true;
}

function toggleFavorite(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || {};

    if (favorites.includes(movie.id)) {
        favorites = favorites.filter(favId => favId !== movie.id);
        movie.genres.forEach(genre => {
            favoriteGenres[genre.name] = favoriteGenres[genre.name] ? favoriteGenres[genre.name] - 1 : 0;
        });
    }
    else {
        favorites.push(movie.id);
        movie.genres.forEach(genre => {
            favoriteGenres[genre.name] = favoriteGenres[genre.name] ? favoriteGenres[genre.name] + 1 : 1;
        });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));

    updateFavoriteButton(movie.id);
}

function updateFavoriteButton(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteButton = document.getElementById('favorite-btn');

    if (favorites.includes(movieId)) {
        favoriteButton.classList.add('favorited');
        favoriteButton.style.backgroundColor = 'grey';
        favoriteButton.title = 'Remove from favorites';
    }
    else {
        favoriteButton.classList.remove('favorited');
        favoriteButton.style.background = 'transparent';
        favoriteButton.title = 'Add to favorites';
    }
}

function getRtSlug(title) {
    return title.toLowerCase()
        .replace(/:/g, '')
        .replace(/part one/g, 'part_1')
        .replace(/-/g, '')
        .replace(/&/g, 'and')
        .replace(/ /g, '_')
        .replace(/[^\w-]/g, '');
}

function createMetacriticSlug(title) {
    return title.toLowerCase()
        .replace(/part\sone/g, 'part-1')
        .replace(/:|_|-|\s/g, '-')
        .replace(/&/g, 'and')
        .replace(/--+/g, '-')
        .replace(/[^\w-]/g, '');
}

function populateMovieDetails(movie, imdbRating, rtRating, metascore, awards, rated) {
    document.getElementById('movie-image').src = `https://image.tmdb.org/t/p/w1280${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;

    const movieRating = movie.vote_average.toFixed(1);
    const imdbLink = `https://www.imdb.com/title/${movie.imdb_id}`;

    const rtLink = rtRating !== 'N/A' ? `https://www.rottentomatoes.com/m/${getRtSlug(movie.title)}` : '#';
    const metaCriticsLink = metascore !== 'N/A' ? `https://www.metacritic.com/movie/${createMetacriticSlug(movie.title)}` : '#';

    const ratingDetails = getRatingDetails(rated);
    const ratedElement = rated ? `<p id="movie-rated-element"><strong>Rated:</strong> <span style="color: ${ratingDetails.color};"><strong>${ratingDetails.text}</strong>${ratingDetails.description}</span></p>` : '';

    document.getElementById('movie-rating').innerHTML = `
        <a id="imdbRatingLink" href="${imdbLink}" target="_blank" title="Click to go to this movie's IMDb page!" style="text-decoration: none; color: inherit">IMDB Rating: ${imdbRating}</a>
    `;
    document.getElementById('movie-rating').style.marginTop = '120px';
    document.title = movie.title + " - Movie Details";

    const movieImage = document.getElementById('movie-image');
    const movieDescription = document.getElementById('movie-description');

    const metascoreElement = metascore ? `<p><strong>Metascore:</strong> <a id="metacritics" href="${metaCriticsLink}">${metascore}</a></p>` : '';
    const awardsElement = awards ? `<p><strong>Awards:</strong> ${awards}</p>` : '';

    if (movie.poster_path) {
        movieImage.src = IMGPATH + movie.poster_path;
        movieImage.alt = movie.title;
    }
    else {
        movieImage.style.display = 'none';
        const noImageText = document.createElement('h2');
        noImageText.textContent = 'Movie Image Not Available';
        noImageText.style.textAlign = 'center';
        document.querySelector('.movie-left').appendChild(noImageText);
    }

    const fullLanguage = twoLetterLangCodes.find(lang => lang.code === movie.original_language).name;
    const overview = movie.overview;
    const genres = movie.genres.map(genre => genre.name).join(', ');
    const releaseDate = movie.release_date;

    const budget = movie.budget === 0 ? 'Information Not Available' : `$${movie.budget.toLocaleString()}`;
    const revenue = movie.revenue <= 1000 ? 'Information Not Available' : `$${movie.revenue.toLocaleString()}`;
    const tagline = movie.tagline ? movie.tagline : 'No tagline found';
    const languages = movie.spoken_languages.map(lang => lang.name).join(', ');

    const countries = movie.production_countries.map(country => country.name).join(', ');
    const originalLanguage = fullLanguage;
    const popularityScore = movie.popularity.toFixed(0);
    const status = movie.status;

    const voteCount = movie.vote_count.toLocaleString();
    let keywords = movie.keywords ? movie.keywords.keywords.map(kw => kw.name).join(', ') : 'None Available';
    const similarTitles = movie.similar ? movie.similar.results.map(m => m.title).join(', ') : 'None Available';
    const scaledRating = (movie.vote_average / 2).toFixed(1);

    if (keywords.length === 0) {
        keywords = 'None Available';
    }

    const popularityThreshold = 80;
    const isPopular = movie.popularity >= popularityThreshold;
    const popularityText = isPopular ? `${popularityScore} (This movie is popular)` : `${popularityScore} (This movie is unpopular)`;

    const adultContentIndicator = movie.adult
        ? `<span class="adult-indicator">Adult Content</span>`
        : `<span class="general-indicator">General Audience</span>`;

    const movieStatus = `<p><strong>Status:</strong> ${movie.status}</p>`;

    const runtime = movie.runtime > 0
        ? movie.runtime + ' minutes'
        : 'Runtime Info Not Available';

    document.getElementById('movie-description').innerHTML += `
        <p id="descriptionP"><strong>Description: </strong>${overview}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        ${ratedElement}
        ${movieStatus}
        <p><strong>Release Date:</strong> ${releaseDate}</p>
        <p><strong>Runtime:</strong> ${runtime}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Revenue:</strong> ${revenue}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Countries of Production:</strong> ${countries}</p>
        <p><strong>Original Language:</strong> ${originalLanguage}</p>
        <p><strong>Popularity Score:</strong> <span class="${isPopular ? 'popular' : ''}">${popularityText}</span></p>
        <p style="cursor: pointer" title="Your rating also counts - it might take a while for us to update!"><strong>Averaged User Ratings:</strong> <span id="userRatings">${scaledRating}/5.0 (based on <strong>${movie.vote_count}</strong> votes)</span></p>
        ${awardsElement}
        ${metascoreElement}
        <p><strong>Rotten Tomatoes:</strong> <a href="${rtLink}" id="rating">${rtRating}</a></p>
        <p><strong>Tagline:</strong> ${tagline}</p>
    `;

    if (movie.credits && movie.credits.crew) {
        const director = movie.credits.crew.find(member => member.job === 'Director');
        if (director) {
            const directorAge = director.birthday ? calculateAge(director.birthday) : 'N/A';
            const directorElement = document.createElement('p');
            directorElement.innerHTML = `<strong>Director:</strong> <a href="../html/director-details.html" class="director-link">${director.name}</a>`;
            directorElement.querySelector('.director-link').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('selectedDirectorId', director.id);
                document.title = `${director.name} - Director's Details`;
                window.location.href = 'director-details.html';
                updateUniqueDirectorsViewed(director.id);
                updateDirectorVisitCount(director.id, director.name);
            });
            document.getElementById('movie-description').appendChild(directorElement);
        }
    }

    const castHeading = document.createElement('p');
    castHeading.innerHTML = '<strong>Cast:</strong> ';
    document.getElementById('movie-description').appendChild(castHeading);

    if (movie.credits && movie.credits.cast.length > 0) {
        const topTenCast = movie.credits.cast.slice(0, 10);
        topTenCast.forEach((actor, index) => {
            const actorLink = document.createElement('span');
            actorLink.textContent = actor.name;
            actorLink.classList.add('actor-link');
            actorLink.addEventListener('click', () => {
                localStorage.setItem('selectedActorId', actor.id);
                window.location.href = 'actor-details.html';
                updateUniqueActorsViewed(actor.id);
                updateActorVisitCount(actor.id, actor.name);
            });

            castHeading.appendChild(actorLink);

            if (index < topTenCast.length - 1) {
                castHeading.appendChild(document.createTextNode(', '));
            }
        });
    }
    else {
        castHeading.appendChild(document.createTextNode('None available.'));
    }

    const productionCompanies = movie.production_companies;
    const productionCompaniesElement = document.createElement('p');
    productionCompaniesElement.innerHTML = '<strong>Production Companies:</strong> ';

    if (productionCompanies.length === 0) {
        productionCompaniesElement.innerHTML += 'None available.';
    }
    productionCompanies.forEach((company, index) => {
        const companyLink = document.createElement('a');
        companyLink.textContent = company.name;
        companyLink.style.cursor = 'pointer';
        companyLink.style.textDecoration = 'underline';
        companyLink.href = '#';
        companyLink.classList.add('company-link');
        companyLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('selectedCompanyId', company.id);
            window.location.href = 'company-details.html';
            updateUniqueCompaniesViewed(company.id);
        });

        productionCompaniesElement.appendChild(companyLink);

        if (index < productionCompanies.length - 1) {
            productionCompaniesElement.appendChild(document.createTextNode(', '));
        }
    });

    document.getElementById('movie-description').appendChild(productionCompaniesElement);
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
                movieLink.style.color = getSavedTextColor();
            });

            movieLink.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', similarMovie.id);
                window.location.href = 'movie-details.html';
            });

            similarMoviesHeading.appendChild(movieLink);

            if (index < movie.similar.results.length - 1) {
                similarMoviesHeading.appendChild(document.createTextNode(', '));
            }
        });
    }
    else {
        similarMoviesHeading.appendChild(document.createTextNode('None available.'));
    }

    const keywordsElement = document.createElement('p');
    keywordsElement.innerHTML = `<strong>Keywords:</strong> ${keywords}`;

    movieDescription.appendChild(keywordsElement);
    updateFavoriteButton(movie.id);

    favoriteButton.addEventListener('click', () => {
        toggleFavorite(movie);
        updateMoviesFavorited(movie.id);
        window.location.reload();
    });

    updateMoviesFavorited(movie.id);
    applySettings();
}

function getSavedTextColor() {
    return localStorage.getItem('textColor') || 'white';
}

function updateMoviesFavorited(movieId) {
    let favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
    if (!favoritedMovies.includes(movieId)) {
        favoritedMovies.push(movieId);
        localStorage.setItem('moviesFavorited', JSON.stringify(favoritedMovies));
    }
}

function updateAverageMovieRating(movieId, newRating) {
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};

    savedRatings[movieId] = newRating;
    localStorage.setItem('movieRatings', JSON.stringify(savedRatings));

    let totalRating = 0;
    let totalMoviesRated = 0;

    for (let id in savedRatings) {
        totalRating += parseFloat(savedRatings[id]);
        totalMoviesRated++;
    }
    let averageRating = totalMoviesRated > 0 ? (totalRating / totalMoviesRated) : 0;
    localStorage.setItem('averageMovieRating', averageRating.toFixed(1).toString());
}

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}

function updateUniqueActorsViewed(actorId) {
    let viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
    if (!viewedActors.includes(actorId)) {
        viewedActors.push(actorId);
        localStorage.setItem('uniqueActorsViewed', JSON.stringify(viewedActors));
    }
}

function updateUniqueCompaniesViewed(companyId) {
    let viewedCompanies = JSON.parse(localStorage.getItem('uniqueCompaniesViewed')) || [];
    if (!viewedCompanies.includes(companyId)) {
        viewedCompanies.push(companyId);
        localStorage.setItem('uniqueCompaniesViewed', JSON.stringify(viewedCompanies));
    }
}

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function applySettings() {
    const savedBg = localStorage.getItem('backgroundImage');
    const savedTextColor = localStorage.getItem('textColor');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }
    if (savedTextColor) {
        applyTextColor(savedTextColor);
    }
    if (savedFontSize) {
        const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
        document.body.style.fontSize = size;
    }
}

function applyTextColor(color) {
    document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li')
        .forEach(element => {
            element.style.color = color;
        });
}