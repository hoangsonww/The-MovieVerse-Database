const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

let currentIndex = sessionStorage.getItem('currentIndex') ? parseInt(sessionStorage.getItem('currentIndex')) : 0;

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
const IMGPATH = "https://image.tmdb.org/t/p/w780";
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
        console.log('Error fetching genre map:', error);
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
                const favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
            getValue: () => {
                const mostCommonGenreCode = getMostCommonGenre();
                const genreMapString = localStorage.getItem('genreMap');
                if (!genreMapString) {
                    console.log('No genre map found in localStorage.');
                    return 'Not Available';
                }

                let genreMap;
                try {
                    genreMap = JSON.parse(genreMapString);
                }
                catch (e) {
                    console.log('Error parsing genre map:', e);
                    return 'Not Available';
                }

                let genreObject;
                if (Array.isArray(genreMap)) {
                    genreObject = genreMap.reduce((acc, genre) => {
                        acc[genre.id] = genre.name;
                        return acc;
                    }, {});
                }
                else if (typeof genreMap === 'object' && genreMap !== null) {
                    genreObject = genreMap;
                }
                else {
                    console.log('genreMap is neither an array nor a proper object:', genreMap);
                    return 'Not Available';
                }

                return genreObject[mostCommonGenreCode] || 'Not Available';
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
        localTimeDiv.scrollIntoView({ behavior: 'smooth' });
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
        star.style.color = star.dataset.value > rating ? 'white' : 'gold';
    });

    document.getElementById('rating-value').textContent = `${rating}.0/5.0`;
}

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
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
    currentIndex = 0;
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
    showSpinner();
    const baseUrl = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}`;
    const urlWithAppend = `${baseUrl}?${generateMovieNames()}${tvCode}&append_to_response=credits,keywords,similar,videos,external_ids`;

    try {
        const tvDetailsPromise = fetch(urlWithAppend).then(response => {
            if (!response.ok) throw new Error('Failed to fetch TV series details');
            return response.json();
        });

        const tvSeriesDetails = await tvDetailsPromise;
        const imdbId = tvSeriesDetails.external_ids.imdb_id;

        if (imdbId) {
            const imdbRatingPromise = fetchTVRatings(imdbId);
            const imdbRating = await imdbRatingPromise;
            populateTvSeriesDetails(tvSeriesDetails, imdbRating);
        } else {
            populateTvSeriesDetails(tvSeriesDetails, 'IMDb data unavailable but you can check it out by clicking here');
        }

        updateBrowserURL(tvSeriesDetails.name);
    } catch (error) {
        document.getElementById('movie-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>TV series details not found - Try again with another TV series</h2>
            </div>`;
        console.log('Error fetching TV series details:', error);
    } finally {
        hideSpinner();
    }
}

async function fetchTVRatings(imdbId) {
    if (!imdbId) {
        return 'IMDb data unavailable but you can check it out by clicking here';
    }

    const apiKeys = [
        await getMovieCode2(),
        '58efe859',
        '60a09d79',
        '956e468a',
        'bd55ada4',
        'cbfc076',
        'dc091ff2',
        '6e367eef',
        '2a2a3080'
    ];

    const baseURL = `https://${getMovieActor()}/?i=${imdbId}&${getMovieName()}`;

    async function tryFetch(apiKey, timeout = 5000) {
        const url = `${baseURL}${apiKey}`;
        return new Promise((resolve) => {
            const timer = setTimeout(() => resolve(null), timeout);
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error('API limit reached or other error');
                    return response.json();
                })
                .then(data => {
                    clearTimeout(timer);
                    if (!data || data.Error) throw new Error('Data fetch error');
                    resolve(data);
                })
                .catch(() => {
                    clearTimeout(timer);
                    resolve(null);
                });
        });
    }

    const requests = apiKeys.map(key => tryFetch(key));
    const responses = await Promise.all(requests);
    const data = responses.find(response => response !== null);

    return data && data.imdbRating ? data.imdbRating : 'IMDb data unavailable but you can check it out by clicking here';
}

function getLanguageName(code) {
    const language = twoLetterLangCodes.find(lang => lang.code === code);
    return language ? language.name : 'Unknown Language';
}

function getCountryName(code) {
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    return regionNames.of(code);
}

async function populateTvSeriesDetails(tvSeries, imdbRating) {
    const title = tvSeries.name || 'Title not available';
    document.getElementById('movie-title').textContent = title;
    document.title = tvSeries.name + " - TV Series Details";

    const posterPath = `https://image.tmdb.org/t/p/w780${tvSeries.poster_path}`;
    if (tvSeries.poster_path) {
        document.getElementById('movie-image').src = posterPath;
        document.getElementById('movie-image').alt = `Poster of ${title}`;
    }
    else {
        const noImageTitle = document.createElement('h2');
        noImageTitle.textContent = 'TV Show Image Not Available';
        noImageTitle.style.textAlign = 'center';
        document.getElementById('movie-image').replaceWith(noImageTitle);
    }

    let detailsHTML = `<p><strong>Overview:</strong> ${tvSeries.overview || 'Overview not available.'}</p>`;

    detailsHTML += `<p><strong>Original Title:</strong> ${tvSeries.original_name || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Tagline:</strong> ${tvSeries.tagline || 'Not available'}</p>`;

    const genres = tvSeries.genres && tvSeries.genres.length ? tvSeries.genres.map(genre => genre.name).join(', ') : 'Genres not available';
    detailsHTML += `<p><strong>Genres:</strong> ${genres}</p>`;

    detailsHTML += `<p><strong>First Air Date:</strong> ${tvSeries.first_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Last Air Date:</strong> ${tvSeries.last_air_date || 'Not available'}</p>`;

    detailsHTML += `<p><strong>Status:</strong> ${tvSeries.status || 'Not available'}</p>`;

    const type = tvSeries.type || 'Not available';
    detailsHTML += `<p><strong>Type:</strong> ${type}</p>`;

    const networks = tvSeries.networks && tvSeries.networks.length ? tvSeries.networks.map(network => network.name).join(', ') : 'Information not available';
    detailsHTML += `<p><strong>Networks:</strong> ${networks}</p>`;

    const voteAverage = tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : 'N/A';
    const voteCount = tvSeries.vote_count ? tvSeries.vote_count.toLocaleString() : 'N/A';
    detailsHTML += `<p title="Your rating also counts - it might take a while for us to update!"><strong>MovieVerse User Rating:</strong> <strong id="user-ratings">${(voteAverage / 2).toFixed(1)}/5.0</strong> (based on <strong id="user-ratings">${voteCount}</strong> votes)</p>`;

    if (tvSeries.external_ids && tvSeries.external_ids.imdb_id) {
        const imdbId = tvSeries.external_ids.imdb_id;
        const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;
        detailsHTML += `<p title="Click to go to this TV series' IMDB page"><strong>IMDb Rating:</strong> <strong><a id="ratingImdb" href="${imdbUrl}" target="_blank">${imdbRating}</a></strong></p>`;
    }
    else {
        detailsHTML += `<p title="Click to go to this TV series' IMDB page"><strong>IMDb Rating:</strong> <strong>IMDb rating not available</strong></p>`;
    }

    let tmdbRating = tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : 'N/A';
    if (tmdbRating === 'N/A') {
        detailsHTML += `<p><strong>TMDB Rating:</strong> <a href="https://www.themoviedb.org/tv/${tvSeries.id}" id="rating" target="_blank">${tmdbRating}</a></p>`;
    }
    else {
        detailsHTML += `<p><strong>TMDB Rating:</strong> <a href="https://www.themoviedb.org/tv/${tvSeries.id}" id="rating" target="_blank">${tmdbRating}/10.0</a></p>`;
    }

    const homepage = tvSeries.homepage ? `<a id="homepage" href="${tvSeries.homepage}" target="_blank">Visit homepage</a>` : 'Not available';
    detailsHTML += `<p><strong>Homepage:</strong> ${homepage}</p>`;

    if (tvSeries.origin_country && tvSeries.origin_country.length > 0) {
        const countryNames = tvSeries.origin_country.map(code => getCountryName(code)).join(', ');
        detailsHTML += `<p><strong>Country of Origin:</strong> ${countryNames}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Country of Origin:</strong> Information not available</p>`;
    }

    const languageName = getLanguageName(tvSeries.original_language);
    detailsHTML += `<p><strong>Original Language:</strong> ${languageName}</p>`;

    const productionCountries = tvSeries.production_countries && tvSeries.production_countries.length > 0 ? tvSeries.production_countries.map(country => getCountryName(country.iso_3166_1)).join(', ') : 'Information not available';
    detailsHTML += `<p><strong>Production Countries:</strong> ${productionCountries}</p>`;

    detailsHTML += `<p><strong>Seasons:</strong> ${tvSeries.number_of_seasons || 0}, <strong>Episodes:</strong> ${tvSeries.number_of_episodes || 0}</p>`;

    if (tvSeries.last_episode_to_air) {
        const lastEpisode = tvSeries.last_episode_to_air;

        detailsHTML += `<div class="last-episode">
                            <strong>Last Episode:</strong> <em>${lastEpisode.name || 'Title not available'}</em> - ${lastEpisode.overview || 'Overview not available.'}
                        </div>`;

        if (lastEpisode.still_path) {
            detailsHTML += `<div class="last-episode-image-container" id="last-episode-image-container">
                                <img src="${IMGPATH + lastEpisode.still_path}" alt="${lastEpisode.name} Still Image" class="last-episode-image" id="last-episode-image" alt="Last Episode Image">
                            </div>`;
        }
    }

    if (tvSeries.created_by && tvSeries.created_by.length > 0) {
        const creatorsSection = document.createElement('div');
        creatorsSection.classList.add('creators-section');

        const creatorsTitle = document.createElement('p');
        creatorsTitle.innerHTML = '<strong>Creators:</strong>';
        creatorsSection.appendChild(creatorsTitle);

        const creatorsList = document.createElement('div');
        creatorsList.classList.add('creators-list');
        creatorsList.style.display = 'flex';
        creatorsList.style.flexWrap = 'wrap';
        creatorsList.style.justifyContent = 'center';
        creatorsList.style.gap = '2px';

        tvSeries.created_by.forEach(creator => {
            const creatorLink = document.createElement('a');
            creatorLink.classList.add('creator-link');
            creatorLink.href = 'javascript:void(0);';
            creatorLink.setAttribute('onclick', `handleCreatorClick(${creator.id}, '${creator.name.replace(/'/g, "\\'")}');`);

            const creatorItem = document.createElement('div');
            creatorItem.classList.add('creator-item');

            const creatorImage = document.createElement('img');
            creatorImage.classList.add('creator-image');

            if (creator.profile_path) {
                creatorImage.src = IMGPATH + creator.profile_path;
                creatorImage.alt = `${creator.name} Profile Picture`;
            } else {
                creatorImage.alt = 'Image Not Available';
                creatorImage.style.objectFit = 'cover';
                creatorImage.src = 'https://movie-verse.com/images/user-default.png';
                creatorImage.style.filter = 'grayscale(100%)';
            }

            creatorItem.appendChild(creatorImage);

            const creatorDetails = document.createElement('div');
            creatorDetails.classList.add('creator-details');

            const creatorName = document.createElement('p');
            creatorName.classList.add('creator-name');
            creatorName.textContent = creator.name;
            creatorDetails.appendChild(creatorName);

            creatorItem.appendChild(creatorDetails);
            creatorLink.appendChild(creatorItem);
            creatorsList.appendChild(creatorLink);
        });

        creatorsSection.appendChild(creatorsList);
        detailsHTML += creatorsSection.outerHTML;
    } else {
        const noCreatorsElement = document.createElement('p');
        noCreatorsElement.innerHTML = `<strong>Creators:</strong> Information not available`;
        detailsHTML += noCreatorsElement.outerHTML;
    }

    if (tvSeries.credits && tvSeries.credits.cast && tvSeries.credits.cast.length > 0) {
        const castSection = document.createElement('div');
        castSection.classList.add('cast-section');

        const castTitle = document.createElement('p');
        castTitle.innerHTML = '<strong>Notable Cast:</strong>';
        castSection.appendChild(castTitle);

        const castList = document.createElement('div');
        castList.classList.add('cast-list');
        castList.style.display = 'flex';
        castList.style.flexWrap = 'wrap';
        castList.style.justifyContent = 'center';
        castList.style.gap = '2px';

        tvSeries.credits.cast.slice(0, 12).forEach(castMember => {
            const castMemberLink = document.createElement('a');
            castMemberLink.classList.add('cast-member-link');
            castMemberLink.href = 'javascript:void(0);';
            castMemberLink.setAttribute('onclick', `selectActorId(${castMember.id}, '${castMember.name.replace(/'/g, "\\'")}');`);

            const castMemberItem = document.createElement('div');
            castMemberItem.classList.add('cast-member-item');

            const castMemberImage = document.createElement('img');
            castMemberImage.classList.add('cast-member-image');

            if (castMember.profile_path) {
                castMemberImage.src = IMGPATH + castMember.profile_path;
                castMemberImage.alt = `${castMember.name} Profile Picture`;
            }
            else {
                castMemberImage.alt = 'Image Not Available';
                castMemberImage.style.objectFit = 'cover';
                castMemberImage.src = 'https://movie-verse.com/images/user-default.png';
                castMemberImage.style.filter = 'grayscale(100%)';
            }

            castMemberItem.appendChild(castMemberImage);

            const castMemberDetails = document.createElement('div');
            castMemberDetails.classList.add('cast-member-details');

            const castMemberName = document.createElement('p');
            castMemberName.classList.add('cast-member-name');
            castMemberName.textContent = castMember.name;
            castMemberDetails.appendChild(castMemberName);

            const castMemberRole = document.createElement('p');
            castMemberRole.classList.add('cast-member-role');
            castMemberRole.textContent = castMember.character ? `(as ${castMember.character})` : '';
            castMemberRole.style.fontStyle = 'italic';
            castMemberDetails.appendChild(castMemberRole);

            castMemberItem.appendChild(castMemberDetails);
            castMemberLink.appendChild(castMemberItem);
            castList.appendChild(castMemberLink);
        });

        castSection.appendChild(castList);
        detailsHTML += castSection.outerHTML;
    } else {
        const noCastElement = document.createElement('p');
        noCastElement.innerHTML = `<strong>Cast:</strong> Information not available`;
        detailsHTML += noCastElement.outerHTML;
    }

    if (tvSeries.similar && tvSeries.similar.results && tvSeries.similar.results.length > 0) {
        const similarTvSeriesSection = document.createElement('div');
        similarTvSeriesSection.classList.add('similar-tv-series-section');

        const similarTvSeriesTitle = document.createElement('p');
        similarTvSeriesTitle.innerHTML = '<strong>Similar TV Series:</strong>';
        similarTvSeriesSection.appendChild(similarTvSeriesTitle);

        const similarTvSeriesList = document.createElement('div');
        similarTvSeriesList.classList.add('similar-tv-series-list');
        similarTvSeriesList.style.display = 'flex';
        similarTvSeriesList.style.flexWrap = 'wrap';
        similarTvSeriesList.style.justifyContent = 'center';
        similarTvSeriesList.style.gap = '10px';

        let similarTvSeries = tvSeries.similar.results.sort((a, b) => b.popularity - a.popularity);
        similarTvSeries = similarTvSeries.slice(0, 18);

        similarTvSeries.forEach(similarTv => {
            const similarTvLink = document.createElement('a');
            similarTvLink.classList.add('similar-tv-link');
            similarTvLink.href = 'javascript:void(0);';
            similarTvLink.setAttribute('onclick', `selectTvSeriesId(${similarTv.id});`);

            const similarTvItem = document.createElement('div');
            similarTvItem.classList.add('similar-tv-item');

            const similarTvImage = document.createElement('img');
            similarTvImage.classList.add('similar-tv-image');

            if (similarTv.poster_path) {
                similarTvImage.src = IMGPATH + similarTv.poster_path;
                similarTvImage.alt = `${similarTv.name} Poster`;
            } else {
                similarTvImage.alt = 'Image Not Available';
                similarTvImage.src = 'https://movie-verse.com/images/movie-default.jpg';
                similarTvImage.style.filter = 'grayscale(100%)';
                similarTvImage.style.objectFit = 'cover';
            }

            similarTvItem.appendChild(similarTvImage);

            const similarTvDetails = document.createElement('div');
            similarTvDetails.classList.add('similar-tv-details');

            const similarTvName = document.createElement('p');
            similarTvName.classList.add('similar-tv-name');
            similarTvName.textContent = similarTv.name;
            similarTvDetails.appendChild(similarTvName);

            similarTvItem.appendChild(similarTvDetails);
            similarTvLink.appendChild(similarTvItem);
            similarTvSeriesList.appendChild(similarTvLink);
        });

        similarTvSeriesSection.appendChild(similarTvSeriesList);
        detailsHTML += similarTvSeriesSection.outerHTML;
    } else {
        const noSimilarTvSeriesElement = document.createElement('p');
        noSimilarTvSeriesElement.innerHTML = `<strong>Similar TV Series:</strong> Information not available`;
        detailsHTML += noSimilarTvSeriesElement.outerHTML;
    }

    if (tvSeries.production_companies && tvSeries.production_companies.length) {
        const companiesSection = document.createElement('div');
        companiesSection.classList.add('companies-section');

        const companiesTitle = document.createElement('p');
        companiesTitle.innerHTML = '<strong>Production Companies:</strong>';
        companiesSection.appendChild(companiesTitle);

        const companiesList = document.createElement('div');
        companiesList.classList.add('companies-list');
        companiesList.style.display = 'flex';
        companiesList.style.flexWrap = 'wrap';
        companiesList.style.justifyContent = 'center';
        companiesList.style.gap = '5px';

        let productionCompanies = tvSeries.production_companies.slice(0, 6);

        productionCompanies.forEach(company => {
            const companyLink = document.createElement('a');
            companyLink.classList.add('company-link');
            companyLink.href = 'javascript:void(0);';
            companyLink.setAttribute('onclick', `selectCompanyId(${company.id});`);

            const companyItem = document.createElement('div');
            companyItem.classList.add('company-item');

            const companyLogo = document.createElement('img');
            companyLogo.classList.add('company-logo');

            if (company.logo_path) {
                companyLogo.src = IMGPATH + company.logo_path;
                companyLogo.alt = `${company.name} Logo`;
                companyLogo.style.backgroundColor = 'white';
            } else {
                companyLogo.alt = 'Logo Not Available';
                companyLogo.src = 'https://movie-verse.com/images/company-default.png';
                companyLogo.style.filter = 'grayscale(100%)';
            }

            companyItem.appendChild(companyLogo);

            const companyDetails = document.createElement('div');
            companyDetails.classList.add('company-details');

            const companyName = document.createElement('p');
            companyName.classList.add('company-name');
            companyName.textContent = company.name;
            companyDetails.appendChild(companyName);

            companyItem.appendChild(companyDetails);
            companyLink.appendChild(companyItem);
            companiesList.appendChild(companyLink);
        });

        companiesSection.appendChild(companiesList);
        detailsHTML += companiesSection.outerHTML;
    } else {
        const noCompaniesElement = document.createElement('p');
        noCompaniesElement.innerHTML = `<strong>Production Companies:</strong> Information not available`;
        detailsHTML += noCompaniesElement.outerHTML;
    }

    const tvSeriesTitleEncoded = encodeURIComponent(title);
    const streamingProviders = await fetchTvSeriesStreamingLinks(tvSeries.id);
    const streamingHTML = streamingProviders.length > 0 ? streamingProviders.map(provider => {
        let providerLink = `https://www.google.com/search?q=watch+${tvSeriesTitleEncoded}+on+${encodeURIComponent(provider.provider_name)}`;
        switch(provider.provider_name.toLowerCase()) {
            case 'netflix':
                providerLink = `https://www.netflix.com/search?q=${tvSeriesTitleEncoded}`;
                break;
            case 'disney plus':
                providerLink = `https://www.disneyplus.com/search?q=${tvSeriesTitleEncoded}`;
                break;
            case 'hbo max':
                providerLink = `https://www.hbomax.com/search?q=${tvSeriesTitleEncoded}`;
                break;
            case 'hulu':
                providerLink = `https://www.hulu.com/search?q=${tvSeriesTitleEncoded}`;
                break;
            case 'amazon prime video':
                providerLink = `https://www.amazon.com/s?k=${tvSeriesTitleEncoded}`;
                break;
            case 'apple tv plus':
                providerLink = `https://tv.apple.com/search?term=${tvSeriesTitleEncoded}`;
                break;
            case 'stan':
                providerLink = `https://www.stan.com.au/search?q=${tvSeriesTitleEncoded}`;
                break;
            case 'player':
                providerLink = `https://player.pl/szukaj?search=${tvSeriesTitleEncoded}`;
                break;
        }

        return `<a href="${providerLink}" target="_blank" title="Watch on ${provider.provider_name}" style="display: inline-flex; align-items: flex-end; vertical-align: bottom;" class="streaming-logo">
        <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name}" style="width: 50px; margin-left: 10px;">
    </a>`;
    }).join('') + `<a href="https://www.justwatch.com/us/search?q=${tvSeriesTitleEncoded}" target="_blank" title="View more streaming options on JustWatch" class="streaming-logo" style="display: inline-flex; align-items: center; vertical-align: bottom">
        <img src="../../images/justwatchlogo.webp" alt="JustWatch" style="width: 50px;">
    </a>` : 'No streaming options available.';

    detailsHTML += `<p><strong>Streaming Options:</strong> ${streamingHTML}</p>`;

    if (tvSeries.keywords && tvSeries.keywords.results && tvSeries.keywords.results.length) {
        let keywordsHTML = tvSeries.keywords.results.map(keyword => keyword.name).join(', ');
        detailsHTML += `<p><strong>Keywords:</strong> ${keywordsHTML}</p>`;
    }
    else {
        detailsHTML += `<p><strong>Keywords:</strong> Information not available</p>`;
    }

    const mediaUrl = `https://${getMovieVerseData()}/3/tv/${tvSeries.id}/images?${generateMovieNames()}${getMovieCode()}`;
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();
    const images = mediaData.backdrops;

    const detailsContainer = document.getElementById('movie-description');

    let mediaContainer = document.getElementById('media-container');
    if (!mediaContainer) {
        mediaContainer = document.createElement('div');
        mediaContainer.id = 'media-container';
        mediaContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 450px;
            margin: 20px auto;
            overflow: hidden;
            max-width: 100%;
            box-sizing: border-box;
        `;
        detailsContainer.appendChild(mediaContainer);
    }

    let mediaTitle = document.getElementById('media-title');
    if (!mediaTitle) {
        mediaTitle = document.createElement('p');
        mediaTitle.id = 'media-title';
        mediaTitle.textContent = 'Media:';
        mediaTitle.style = `
            font-weight: bold;
            align-self: start;
            margin-bottom: 5px;
        `;
    }

    let imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper) {
        imageWrapper = document.createElement('div');
        imageWrapper.id = 'image-wrapper';
        imageWrapper.style = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        `;
        mediaContainer.appendChild(imageWrapper);
    }

    let imageElement = document.getElementById('series-media-image');
    if (!imageElement) {
        imageElement = document.createElement('img');
        imageElement.id = 'series-media-image';
        imageElement.style = `
            max-width: 100%;
            max-height: 210px;
            transition: opacity 0.5s ease-in-out;
            opacity: 1;
            border-radius: 16px;
            cursor: pointer;
        `;
        imageElement.loading = 'lazy';
        imageWrapper.appendChild(imageElement);
    }

    if (images.length > 0) {
        imageElement.src = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
    }

    imageElement.addEventListener('click', function () {
        let imageUrl = this.src.replace('w780', 'w1280');

        const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <button id="prevModalButton" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-left"></i></button>
                <img src="${imageUrl}" style="max-width: 80%; max-height: 80%; border-radius: 10px; cursor: default; transition: opacity 0.5s ease-in-out;" onclick="event.stopPropagation();" alt="Media Image"/>
                <button id="nextModalButton" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-right"></i></button>
                <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('image-modal');
        const modalImage = modal.querySelector('img');
        const closeModalBtn = document.getElementById('removeBtn');

        closeModalBtn.onclick = function() {
            modal.remove();
            imageElement.src = modalImage.src.replace('w1280', 'w780'); // Update the main image on modal close
        };

        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.remove();
                imageElement.src = modalImage.src.replace('w1280', 'w780');
            }
        });

        const prevModalButton = document.getElementById('prevModalButton');
        prevModalButton.onmouseover = () => prevModalButton.style.backgroundColor = '#ff8623';
        prevModalButton.onmouseout = () => prevModalButton.style.backgroundColor = '#7378c5';
        prevModalButton.onclick = () => navigateMediaAndModal(images, imageElement, modalImage, -1);

        const nextModalButton = document.getElementById('nextModalButton');
        nextModalButton.onmouseover = () => nextModalButton.style.backgroundColor = '#ff8623';
        nextModalButton.onmouseout = () => nextModalButton.style.backgroundColor = '#7378c5';
        nextModalButton.onclick = () => navigateMediaAndModal(images, imageElement, modalImage, 1);
    });

    function navigateMediaAndModal(images, imgElement1, imgElement2, direction) {
        imgElement1.style.opacity = '0';
        imgElement2.style.opacity = '0';
        currentIndex = (currentIndex + direction + images.length) % images.length;

        setTimeout(() => {
            imgElement1.src = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
            imgElement2.src = `https://image.tmdb.org/t/p/w1280${images[currentIndex].file_path}`;
            imgElement1.style.opacity = '1';
            imgElement2.style.opacity = '1';
        }, 500);

        sessionStorage.setItem('currentIndex', currentIndex);
        updateDots(currentIndex);
    }

    let prevButton = document.getElementById('prev-media-button');
    let nextButton = document.getElementById('next-media-button');
    if (!prevButton || !nextButton) {
        prevButton = document.createElement('button');
        nextButton = document.createElement('button');
        prevButton.id = 'prev-media-button';
        nextButton.id = 'next-media-button';
        prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';

        [prevButton, nextButton].forEach(button => {
            button.style = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: #7378c5;
            color: white;
            border-radius: 8px;
            height: 30px;
            width: 30px;
            border: none;
            cursor: pointer;
        `;
            button.onmouseover = () => button.style.backgroundColor = '#ff8623';
            button.onmouseout = () => button.style.backgroundColor = '#7378c5';
        });

        prevButton.style.left = '0';
        nextButton.style.right = '0';

        imageWrapper.appendChild(prevButton);
        imageWrapper.appendChild(nextButton);
    }

    prevButton.onclick = () => navigateMedia(images, imageElement, -1);
    nextButton.onclick = () => navigateMedia(images, imageElement, 1);

    function navigateMedia(images, imgElement, direction) {
        imgElement.style.opacity = '0';
        currentIndex = (currentIndex + direction + images.length) % images.length;
        setTimeout(() => {
            imgElement.src = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
            imgElement.style.opacity = '1';
        }, 500);

        sessionStorage.setItem('currentIndex', currentIndex);
        updateDots(currentIndex);
    }

    const indicatorContainer = document.createElement('div');
    indicatorContainer.style = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 15px;
    `;

    const maxDotsPerLine = 10;
    let currentLine = document.createElement('div');
    currentLine.style.display = 'flex';

    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator';
        dot.style = `
            width: 8px;
            height: 8px;
            margin: 0 5px;
            background-color: ${index === currentIndex ? '#ff8623' : '#bbb'}; 
            border-radius: 50%;
            cursor: pointer;
            margin-bottom: 5px;
        `;
        dot.addEventListener('click', () => {
            navigateMedia(images, imageElement, index - currentIndex);
            updateDots(index);
        });

        currentLine.appendChild(dot);

        if ((index + 1) % maxDotsPerLine === 0 && index !== images.length - 1) {
            indicatorContainer.appendChild(currentLine);
            currentLine = document.createElement('div');
            currentLine.style.display = 'flex';
        }
    });

    if (currentLine.children.length > 0) {
        indicatorContainer.appendChild(currentLine);
    }

    mediaContainer.appendChild(indicatorContainer);

    function updateDots(newIndex) {
        const dots = document.querySelectorAll('.indicator');
        dots.forEach((dot, index) => {
            dot.style.backgroundColor = index === newIndex ? '#ff8623' : '#bbb';
        });
    }


    if (window.innerWidth <= 767) {
        mediaContainer.style.width = 'calc(100% - 40px)';
    }

    if (images.length === 0) {
        mediaContainer.innerHTML = '<p>No media available</p>';
    }

    document.getElementById('movie-description').innerHTML = detailsHTML;
    document.getElementById('movie-description').appendChild(mediaTitle);
    document.getElementById('movie-description').appendChild(mediaContainer);

    document.getElementById('last-episode-image').addEventListener('click', function() {
        let imageUrl = this.src.replace('w780', 'w1280');

        const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <img src="${imageUrl}" style="max-width: 80%; max-height: 80%; border-radius: 10px; cursor: default;" onclick="event.stopPropagation();" alt="Media Image"/>
                <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('image-modal');
        const closeModalBtn = document.getElementById('removeBtn');

        closeModalBtn.onclick = function() {
            modal.remove();
        }

        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.remove();
            }
        });
    });

    if (tvSeries.videos.results.find(video => video.type === 'Trailer')?.key) {
        const trailerKey = tvSeries.videos.results.find(video => video.type === 'Trailer')?.key;
        const trailerUrl = trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null;

        const trailerButton = document.createElement('button');
        trailerButton.textContent = 'Watch Trailer';
        trailerButton.id = 'trailer-button';
        trailerButton.style = `
            background-color: #7378c5;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 10px; 
            font: inherit;
          `;

        const iframeContainer = document.createElement('div');
        iframeContainer.id = 'trailer-iframe-container';
        iframeContainer.style = `
            display: none; 
            overflow: hidden;
            margin-top: 10px;
            max-height: 0; 
            transition: max-height 0.5s ease-in-out; 
            border: none;
            border-radius: 8px;
          `;

        trailerButton.addEventListener('click', () => {
            if (iframeContainer.style.display === 'none') {
                if (trailerUrl) {
                    const iframe = document.createElement('iframe');
                    iframe.src = trailerUrl;
                    iframe.title = 'YouTube video player';
                    iframe.frameborder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    iframe.allowFullscreen = true;
                    iframeContainer.appendChild(iframe);
                    iframe.style.borderRadius = '16px';
                    iframe.style.border = 'none';
                    iframe.style.width = '400px';
                    iframe.style.height = '315px';
                    trailerButton.textContent = 'Close Trailer';
                }
                else {
                    iframeContainer.innerHTML = '<p>Trailer not available.</p>';
                }
                iframeContainer.style.display = 'block';
                setTimeout(() => {
                    iframeContainer.style.maxHeight = '350px';
                }, 10);
            }
            else {
                iframeContainer.style.maxHeight = '0';
                setTimeout(() => {
                    iframeContainer.style.display = 'none';
                    iframeContainer.innerHTML = '';
                    trailerButton.textContent = 'Watch Trailer';
                }, 500);
            }
        });

        document.getElementById('movie-description').appendChild(trailerButton);
        document.getElementById('movie-description').appendChild(iframeContainer);
    }
}

async function fetchTvSeriesStreamingLinks(tvSeriesId) {
    const url = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}/watch/providers?${generateMovieNames()}${getMovieCode()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.results || {};
        let providersMap = {};

        Object.values(results).forEach(region => {
            if (region.flatrate) {
                region.flatrate.forEach(provider => {
                    providersMap[provider.provider_id] = provider;
                });
            }
        });

        return Object.values(providersMap).slice(0, 7);
    }
    catch (error) {
        console.error('Error fetching TV series streaming links:', error);
        return [];
    }
}

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

function selectActorId(actorId, actorName) {
    const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    const uniqueActorsViewed = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];

    if (!uniqueActorsViewed.includes(actorId)) {
        uniqueActorsViewed.push(actorId);
        localStorage.setItem('uniqueActorsViewed', JSON.stringify(uniqueActorsViewed));
    }

    if (actorVisits[actorId]) {
        actorVisits[actorId].count++;
    }
    else {
        actorVisits[actorId] = { count: 1, name: actorName };
    }

    localStorage.setItem('actorVisits', JSON.stringify(actorVisits));

    localStorage.setItem('selectedActorId', actorId);
    window.location.href = 'actor-details.html';
}

function selectTvSeriesId(tvSeriesId) {
    localStorage.setItem('selectedTvSeriesId', tvSeriesId);
    window.location.href = 'tv-details.html';
}

function selectCompanyId(companyId) {
    localStorage.setItem('selectedCompanyId', companyId);
    window.location.href = 'company-details.html';
}

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

function handleCreatorClick(creatorId, creatorName) {
    localStorage.setItem('selectedDirectorId', creatorId);
    document.title = `${creatorName} - Director's Details`;
    updateUniqueDirectorsViewed(creatorId);
    updateDirectorVisitCount(creatorId, creatorName);
    window.location.href = 'director-details.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const tvSeriesId = localStorage.getItem('selectedTvSeriesId');
    if (tvSeriesId) {
        fetchTvDetails(tvSeriesId);
    }
    else {
        fetchTvDetails(100088);
    }

    document.getElementById('clear-search-btn').style.display = 'none';

    const savedRatings = JSON.parse(localStorage.getItem('tvSeriesRatings')) || {};
    const movieRating = savedRatings[tvSeriesId] || 0;
    setStarRating(movieRating);
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
        console.log('Error fetching movie:', error);
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