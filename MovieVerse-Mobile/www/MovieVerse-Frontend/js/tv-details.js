const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

let globalTrailerKey = '';

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");
let initialMainContent;

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

async function ensureGenreMapIsAvailable() {
    if (!localStorage.getItem('genreMap')) {
        await fetchGenreMap();
    }
}

async function fetchGenreMap() {
    const url = `https://${getMovieVerseData()}/3/genre/movie/list?${generateMovieNames()}${getMovieCode()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const genreMap = data.genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});
        localStorage.setItem('genreMap', JSON.stringify(genreMap));
    }
    catch (error) {
        console.error('Error fetching genre map:', error);
    }
}

async function rotateUserStats() {
    await ensureGenreMapIsAvailable();

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
        { label: "Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Favorite Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
            getValue: () => {
                const mostCommonGenreCode = getMostCommonGenre();
                const genreMap = JSON.parse(localStorage.getItem('genreMap')) || {};
                return genreMap[mostCommonGenreCode] || 'Not Available';
            }
        },
        { label: "Watchlists Created", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
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
    const favoriteGenresArray = JSON.parse(localStorage.getItem('favoriteGenres')) || [];
    const genreCounts = favoriteGenresArray.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {});

    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in genreCounts) {
        if (genreCounts[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = genreCounts[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

function setStarRating(rating) {
    const stars = document.querySelectorAll('.rating .star');
    stars.forEach(star => {
        star.style.color = star.dataset.value > rating ? 'grey' : 'gold';
    });

    document.getElementById('rating-value').textContent = `${rating}.0/5.0`;
}

document.addEventListener('DOMContentLoaded', () => {
    setInitialStarRating(tvSeriesId);
});

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function setInitialStarRating(tvSeriesId) {
    const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
    const tvSeriesRating = savedRatings[tvSeriesId];
    if (tvSeriesRating) {
        setStarRating(tvSeriesRating);
    }
    else {
        setStarRating(0);
    }
}

document.querySelectorAll('.rating .star').forEach(star => {
    star.addEventListener('mouseover', (e) => {
        setStarRating(e.target.dataset.value);
    });

    star.addEventListener('mouseout', () => {
        const movieId = localStorage.getItem('selectedTvSeriesId');
        const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
        const movieRating = savedRatings[movieId] || 0;
        setStarRating(movieRating);
    });

    star.addEventListener('click', (e) => {
        const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
        if (!tvSeriesId) return;
        const rating = e.target.dataset.value;
        const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
        savedRatings[tvSeriesId] = rating;
        localStorage.setItem('tvSeriesRatings', JSON.stringify(savedRatings));
        setStarRating(rating);
        window.location.reload();
    });
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

document.addEventListener("DOMContentLoaded", function() {
    applySettings();
});

const tvCode = `${getMovieCode()}`;

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

async function fetchTvDetails(tvSeriesId) {
    const baseUrl = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}`;
    const urlWithAppend = `${baseUrl}?${generateMovieNames()}${tvCode}&append_to_response=credits,keywords,similar,videos,external_ids`;

    try {
        const response = await fetch(urlWithAppend);
        const tvSeriesDetails = await response.json();
        const imdbId = tvSeriesDetails.external_ids.imdb_id;

        const imdbRating = await fetchTVRatings(imdbId);

        populateTvSeriesDetails(tvSeriesDetails, imdbRating);
        updateBrowserURL(tvSeriesDetails.name);

        const trailer = tvSeriesDetails.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
            document.getElementById('trailerButton').style.display = 'block';
            globalTrailerKey = trailer.key; // Store the trailer key in the global variable
        }
    }
    catch (error) {
        console.error('Error fetching TV series details:', error);
    }
}

async function fetchTVRatings(imdbId) {
    const omdbCode = `${getMovieCode2()}`;
    const omdb = `https://${getMovieActor()}/?i=${imdbId}&${getMovieName()}${omdbCode}`;

    try {
        const response = await fetch(omdb);
        const data = await response.json();

        let imdbRating = data.imdbRating ? data.imdbRating : 'N/A';

        return imdbRating;
    }
    catch (error) {
        console.error('Error fetching TV series ratings:', error);
        return 'N/A';
    }
}

function getLanguageName(code) {
    const language = twoLetterLangCodes.find(lang => lang.code === code);
    return language ? language.name : 'Unknown Language';
}

function getCountryName(code) {
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    return regionNames.of(code);
}

function populateTvSeriesDetails(tvSeries, imdbRating) {
    const title = tvSeries.name || 'Title not available';
    document.getElementById('movie-title').textContent = title;
    document.title = tvSeries.name + " - TV Series";

    const posterPath = tvSeries.poster_path ? `https://image.tmdb.org/t/p/w1280${tvSeries.poster_path}` : 'path/to/default/poster.jpg';
    document.getElementById('movie-image').src = posterPath;
    document.getElementById('movie-image').alt = `Poster of ${title}`;

    let detailsHTML = `<p><strong>Overview:</strong> ${tvSeries.overview || 'Overview not available.'}</p>`;

    const genres = tvSeries.genres && tvSeries.genres.length ? tvSeries.genres.map(genre => genre.name).join(', ') : 'Genres not available';
    detailsHTML += `<p><strong>Genres:</strong> ${genres}</p>`;

    detailsHTML += `<p><strong>First Air Date:</strong> ${tvSeries.first_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Last Air Date:</strong> ${tvSeries.last_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Status:</strong> ${tvSeries.status || 'Not available'}</p>`;

    const networks = tvSeries.networks && tvSeries.networks.length ? tvSeries.networks.map(network => network.name).join(', ') : 'Information not available';
    detailsHTML += `<p><strong>Networks:</strong> ${networks}</p>`;

    const voteAverage = tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : 'N/A';
    const voteCount = tvSeries.vote_count ? tvSeries.vote_count.toLocaleString() : 'N/A';
    detailsHTML += `<p><strong>User Rating:</strong> <strong>${(voteAverage / 2).toFixed(1)}/5.0</strong> (based on <strong>${voteCount}</strong> votes)</p>`;

    if (tvSeries.external_ids && tvSeries.external_ids.imdb_id) {
        const imdbId = tvSeries.external_ids.imdb_id;
        const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;
        detailsHTML += `<p title="Click to go to this TV series' IMDB page"><strong>IMDb Rating:</strong> <strong><a id="ratingImdb" href="${imdbUrl}" target="_blank">${imdbRating}</a></strong></p>`;
    }
    else {
        detailsHTML += `<p title="Click to go to this TV series' IMDB page"><strong>IMDb Rating:</strong> N/A</p>`;
    }

    const homepage = tvSeries.homepage ? `<a id="homepage" href="${tvSeries.homepage}" target="_blank">Visit</a>` : 'Not available';
    detailsHTML += `<p><strong>Homepage:</strong> ${homepage}</p>`;

    if (tvSeries.created_by && tvSeries.created_by.length) {
        const creatorsLinks = tvSeries.created_by.map(creator =>
            `<a id="director-link" href="javascript:void(0);" onclick="handleCreatorClick(${creator.id})">${creator.name}</a>`
        ).join(', ');
        detailsHTML += `<p><strong>Directors:</strong> ${creatorsLinks}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Directors:</strong> Information not available</p>`;
    }

    if (tvSeries.credits && tvSeries.credits.cast && tvSeries.credits.cast.length) {
        let castHTML = tvSeries.credits.cast.slice(0, 100).map(castMember => {
            return `<a id="cast-info" href="javascript:void(0);" onclick="selectActorId(${castMember.id})">${castMember.name}</a>`;
        }).join(', ');
        detailsHTML += `<p><strong>Cast:</strong> ${castHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Cast:</strong> Information not available</p>`;
    }

    if (tvSeries.production_companies && tvSeries.production_companies.length) {
        let companiesHTML = tvSeries.production_companies.map(company => {
            return `<a id="prod-companies" href="javascript:void(0);" onclick="selectCompanyId(${company.id})">${company.name}</a>`;
        }).join(', ');
        detailsHTML += `<p><strong>Production Companies:</strong> ${companiesHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Production Companies:</strong> Information not available</p>`;
    }

    if (tvSeries.similar && tvSeries.similar.results && tvSeries.similar.results.length) {
        let similarTVHTML = tvSeries.similar.results.slice(0, 5).map(similarTv => {
            return `<a id="similar-tv" href="javascript:void(0);" onclick="selectTvSeriesId(${similarTv.id})">${similarTv.name}</a>`;
        }).join(', ');
        detailsHTML += `<p><strong>Similar TV Series:</strong> ${similarTVHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Similar TV Series:</strong> Information not available</p>`;
    }

    detailsHTML += `<p><strong>Tagline:</strong> ${tvSeries.tagline || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Seasons:</strong> ${tvSeries.number_of_seasons || 0}, <strong>Episodes:</strong> ${tvSeries.number_of_episodes || 0}</p>`;

    // if (tvSeries.seasons && tvSeries.seasons.length) {
    //     const seasonsToShow = tvSeries.seasons.slice(0, 3);
    //
    //     seasonsToShow.forEach(season => {
    //         detailsHTML += `<p><strong>${season.name || 'Season information not available'}:</strong> ${season.overview || 'Overview not available.'}</p>`;
    //     });
    // }

    if (tvSeries.origin_country && tvSeries.origin_country.length > 0) {
        const countryNames = tvSeries.origin_country.map(code => getCountryName(code)).join(', ');
        detailsHTML += `<p><strong>Country of Origin:</strong> ${countryNames}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Country of Origin:</strong> Information not available</p>`;
    }

    const languageName = getLanguageName(tvSeries.original_language);
    detailsHTML += `<p><strong>Original Language:</strong> ${languageName}</p>`;

    if (tvSeries.last_episode_to_air) {
        detailsHTML += `<p><strong>Last Episode:</strong> ${tvSeries.last_episode_to_air.name || 'Title not available'} - "${tvSeries.last_episode_to_air.overview || 'Overview not available.'}"</p>`;
    }

    if (tvSeries.keywords && tvSeries.keywords.results && tvSeries.keywords.results.length) {
        let keywordsHTML = tvSeries.keywords.results.map(keyword => keyword.name).join(', ');
        detailsHTML += `<p><strong>Keywords:</strong> ${keywordsHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Keywords:</strong> Information not available</p>`;
    }

    document.getElementById('movie-description').innerHTML = detailsHTML;
}

function selectActorId(actorId) {
    localStorage.setItem('selectedActorId', actorId);
    window.location.href = 'actor-details.html'
}

function selectTvSeriesId(tvSeriesId) {
    localStorage.setItem('selectedTvSeriesId', tvSeriesId);
    window.location.href = 'tv-details.html';
}

function selectCompanyId(companyId) {
    localStorage.setItem('selectedCompanyId', companyId);
    window.location.href = 'company-details.html';
}

function handleCreatorClick(creatorId) {
    localStorage.setItem('selectedDirectorId', creatorId);
    window.location.href = 'director-details.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
    if (tvSeriesId) {
        fetchTvDetails(tvSeriesId);
    }
    else {
        document.getElementById('movie-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw;">
                <h2>TV series details not found.</h2>
            </div>`;
    }

    document.getElementById('clear-search-btn').style.display = 'none';

    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    const movieRating = savedRatings[movieId] || 0;
    setStarRating(movieRating);
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('trailerButton').addEventListener('click', () => {
        const trailerContainer = document.getElementById('trailerContainer');
        const isOpen = trailerContainer.style.maxHeight !== '0px';

        if (isOpen) {
            trailerContainer.style.maxHeight = '0';
        }
        else {
            const trailerIframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${globalTrailerKey}" frameborder="0" allowfullscreen></iframe>`;
            trailerContainer.innerHTML = trailerIframe;
            trailerContainer.style.maxWidth = '400px';
            trailerContainer.style.maxHeight = '315px';
            trailerContainer.style.borderRadius = '8px';
        }
    });
});

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

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
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

function getMovieCode2() {
    const encodedKey = "MmJhOGU1MzY=";
    return atob(encodedKey);
}

function getMovieName() {
    const moviename = "YXBpa2V5PQ==";
    return atob(moviename);
}

function getMovieActor() {
    const actor = "d3d3Lm9tZGJhcGkuY29t";
    return atob(actor);
}

function applyTextColor(color) {
    document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li')
        .forEach(element => {
            element.style.color = color;
        });
}

function updateBrowserURL(title) {
    const nameSlug = createNameSlug(title);
    const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + nameSlug;
    window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(title) {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}