const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
let currentIndex = sessionStorage.getItem("currentIndex")
  ? parseInt(sessionStorage.getItem("currentIndex"))
  : 0;

function showSpinner() {
  document.getElementById("myModal").classList.add("modal-visible");
}

function hideSpinner() {
  document.getElementById("myModal").classList.remove("modal-visible");
}

const movieCode = {
  part1: "YzVhMjBjODY=",
  part2: "MWFjZjdiYjg=",
  part3: "ZDllOTg3ZGNjN2YxYjU1OA==",
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
const IMGPATH = "https://image.tmdb.org/t/p/w780";
const IMGPATH2 = "https://image.tmdb.org/t/p/w185";
const favoriteButton = document.getElementById("favorite-btn");
const searchTitle = document.getElementById("search-title");

let trailerUrlGlobal;
let initialMainContent;
let trailerButton;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchQuery = document.getElementById("search").value;
  localStorage.setItem("searchQuery", searchQuery);
  window.location.href = "search.html";
});

function handleSearch() {
  const searchQuery = document.getElementById("search").value;
  localStorage.setItem("searchQuery", searchQuery);
  window.location.href = "search.html";
}

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem("genreMap")) {
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
    localStorage.setItem("genreMap", JSON.stringify(genreMap));
    console.log(genreMap);
  } catch (error) {
    console.log("Error fetching genre map:", error);
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
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutes}`;
      },
    },
    { label: "Most Visited Movie", getValue: getMostVisitedMovie },
    { label: "Most Visited Director", getValue: getMostVisitedDirector },
    { label: "Most Visited Actor", getValue: getMostVisitedActor },
    {
      label: "Movies Discovered",
      getValue: () => {
        const viewedMovies =
          JSON.parse(localStorage.getItem("uniqueMoviesViewed")) || [];
        return viewedMovies.length;
      },
    },
    {
      label: "Favorite Movies",
      getValue: () => {
        const favoritedMovies =
          JSON.parse(localStorage.getItem("moviesFavorited")) || [];
        return favoritedMovies.length;
      },
    },
    {
      label: "Favorite Genre",
      getValue: () => {
        const mostCommonGenreCode = getMostCommonGenre();
        const genreMapString = localStorage.getItem("genreMap");
        if (!genreMapString) {
          console.log("No genre map found in localStorage.");
          return "Not Available";
        }

        let genreMap;
        try {
          genreMap = JSON.parse(genreMapString);
        } catch (e) {
          console.log("Error parsing genre map:", e);
          return "Not Available";
        }

        let genreObject;
        if (Array.isArray(genreMap)) {
          genreObject = genreMap.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {});
        } else if (typeof genreMap === "object" && genreMap !== null) {
          genreObject = genreMap;
        } else {
          console.log(
            "genreMap is neither an array nor a proper object:",
            genreMap,
          );
          return "Not Available";
        }

        return genreObject[mostCommonGenreCode] || "Not Available";
      },
    },
    {
      label: "Watchlists Created",
      getValue: () => localStorage.getItem("watchlistsCreated") || 0,
    },
    {
      label: "Average Movie Rating",
      getValue: () => localStorage.getItem("averageMovieRating") || "Not Rated",
    },
    {
      label: "Directors Discovered",
      getValue: () => {
        const viewedDirectors =
          JSON.parse(localStorage.getItem("uniqueDirectorsViewed")) || [];
        return viewedDirectors.length;
      },
    },
    {
      label: "Actors Discovered",
      getValue: () => {
        const viewedActors =
          JSON.parse(localStorage.getItem("uniqueActorsViewed")) || [];
        return viewedActors.length;
      },
    },
    { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy },
  ];

  let currentStatIndex = 0;

  function updateStatDisplay() {
    const currentStat = stats[currentStatIndex];
    document.getElementById("stats-label").textContent =
      currentStat.label + ":";
    document.getElementById("stats-display").textContent =
      currentStat.getValue();
    currentStatIndex = (currentStatIndex + 1) % stats.length;
  }

  updateStatDisplay();

  const localTimeDiv = document.getElementById("local-time");
  let statRotationInterval = setInterval(updateStatDisplay, 3000);

  localTimeDiv.addEventListener("click", () => {
    clearInterval(statRotationInterval);
    updateStatDisplay();
    statRotationInterval = setInterval(updateStatDisplay, 3000);
    localTimeDiv.scrollIntoView({ behavior: "smooth" });
  });
}

function updateMovieVisitCount(movieId, movieTitle) {
  let movieVisits = JSON.parse(localStorage.getItem("movieVisits")) || {};
  let uniqueMoviesViewed =
    JSON.parse(localStorage.getItem("uniqueMoviesViewed")) || [];

  if (!movieVisits[movieId]) {
    movieVisits[movieId] = { count: 0, title: movieTitle };
  }
  movieVisits[movieId].count += 1;

  if (!uniqueMoviesViewed.includes(movieId)) {
    uniqueMoviesViewed.push(movieId);
  }

  localStorage.setItem("movieVisits", JSON.stringify(movieVisits));
  localStorage.setItem(
    "uniqueMoviesViewed",
    JSON.stringify(uniqueMoviesViewed),
  );
}

function getMostVisitedDirector() {
  const directorVisits =
    JSON.parse(localStorage.getItem("directorVisits")) || {};
  let mostVisitedDirector = "";
  let maxVisits = 0;

  for (const directorId in directorVisits) {
    if (directorVisits[directorId].count > maxVisits) {
      mostVisitedDirector = directorVisits[directorId].name;
      maxVisits = directorVisits[directorId].count;
    }
  }

  return mostVisitedDirector || "Not Available";
}

function getMostVisitedMovie() {
  const movieVisits = JSON.parse(localStorage.getItem("movieVisits")) || {};
  let mostVisitedMovie = "";
  let maxVisits = 0;

  for (const movieId in movieVisits) {
    if (movieVisits[movieId].count > maxVisits) {
      mostVisitedMovie = movieVisits[movieId].title;
      maxVisits = movieVisits[movieId].count;
    }
  }

  return mostVisitedMovie || "Not Available";
}

function getMostVisitedActor() {
  const actorVisits = JSON.parse(localStorage.getItem("actorVisits")) || {};
  let mostVisitedActor = "";
  let maxVisits = 0;

  for (const actorId in actorVisits) {
    if (actorVisits[actorId].count > maxVisits) {
      mostVisitedActor = actorVisits[actorId].name;
      maxVisits = actorVisits[actorId].count;
    }
  }

  return mostVisitedActor || "Not Available";
}

function getTriviaAccuracy() {
  let triviaStats = JSON.parse(localStorage.getItem("triviaStats")) || {
    totalCorrect: 0,
    totalAttempted: 0,
  };
  if (triviaStats.totalAttempted === 0) {
    return "No trivia attempted";
  }

  let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
  return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
  const favoriteGenresArray =
    JSON.parse(localStorage.getItem("favoriteGenres")) || [];
  const genreCounts = favoriteGenresArray.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  let mostCommonGenre = "";
  let maxCount = 0;

  for (const genre in genreCounts) {
    if (genreCounts[genre] > maxCount) {
      mostCommonGenre = genre;
      maxCount = genreCounts[genre];
    }
  }

  return mostCommonGenre || "Not Available";
}

document.addEventListener("DOMContentLoaded", rotateUserStats);

function updateUniqueDirectorsViewed(directorId) {
  let viewedDirectors =
    JSON.parse(localStorage.getItem("uniqueDirectorsViewed")) || [];
  if (!viewedDirectors.includes(directorId)) {
    viewedDirectors.push(directorId);
    localStorage.setItem(
      "uniqueDirectorsViewed",
      JSON.stringify(viewedDirectors),
    );
  }
}

function updateActorVisitCount(actorId, actorName) {
  let actorVisits = JSON.parse(localStorage.getItem("actorVisits")) || {};
  if (!actorVisits[actorId]) {
    actorVisits[actorId] = { count: 0, name: actorName };
  }
  actorVisits[actorId].count += 1;
  localStorage.setItem("actorVisits", JSON.stringify(actorVisits));
}

function updateDirectorVisitCount(directorId, directorName) {
  let directorVisits = JSON.parse(localStorage.getItem("directorVisits")) || {};
  if (!directorVisits[directorId]) {
    directorVisits[directorId] = { count: 0, name: directorName };
  }
  directorVisits[directorId].count += 1;
  localStorage.setItem("directorVisits", JSON.stringify(directorVisits));
}

document.addEventListener("DOMContentLoaded", () => {
  showSpinner();
  initialMainContent = document.getElementById("main").innerHTML;
  currentIndex = 0;

  const movieId = localStorage.getItem("selectedMovieId");
  if (movieId) {
    fetchMovieDetails(movieId);
  } else {
    fetchMovieDetails(1011985);
  }

  hideSpinner();
});

function handleSignInOut() {
  const isSignedIn = JSON.parse(localStorage.getItem("isSignedIn")) || false;

  if (isSignedIn) {
    localStorage.setItem("isSignedIn", JSON.stringify(false));
    alert("You have been signed out.");
  } else {
    window.location.href = "sign-in.html";
    return;
  }

  updateSignInButtonState();
}

function updateSignInButtonState() {
  const isSignedIn = JSON.parse(localStorage.getItem("isSignedIn")) || false;

  const signInText = document.getElementById("signInOutText");
  const signInIcon = document.getElementById("signInIcon");
  const signOutIcon = document.getElementById("signOutIcon");

  if (isSignedIn) {
    signInText.textContent = "Sign Out";
    signInIcon.style.display = "none";
    signOutIcon.style.display = "inline-block";
  } else {
    signInText.textContent = "Sign In";
    signInIcon.style.display = "inline-block";
    signOutIcon.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  showSpinner();
  updateSignInButtonState();
  document
    .getElementById("googleSignInBtn")
    .addEventListener("click", handleSignInOut);
  hideSpinner();
});

const twoLetterLangCodes = [
  { code: "aa", name: "Afar" },
  { code: "ab", name: "Abkhazian" },
  { code: "ae", name: "Avestan" },
  { code: "af", name: "Afrikaans" },
  { code: "ak", name: "Akan" },
  { code: "am", name: "Amharic" },
  { code: "an", name: "Aragonese" },
  { code: "ar", name: "Arabic" },
  { code: "as", name: "Assamese" },
  { code: "av", name: "Avaric" },
  { code: "ay", name: "Aymara" },
  { code: "az", name: "Azerbaijani" },
  { code: "ba", name: "Bashkir" },
  { code: "be", name: "Belarusian" },
  { code: "bg", name: "Bulgarian" },
  { code: "bh", name: "Bihari languages" },
  { code: "bi", name: "Bislama" },
  { code: "bm", name: "Bambara" },
  { code: "bn", name: "Bengali" },
  { code: "bo", name: "Tibetan" },
  { code: "br", name: "Breton" },
  { code: "bs", name: "Bosnian" },
  { code: "ca", name: "Catalan; Valencian" },
  { code: "ce", name: "Chechen" },
  { code: "ch", name: "Chamorro" },
  { code: "co", name: "Corsican" },
  { code: "cr", name: "Cree" },
  { code: "cs", name: "Czech" },
  {
    code: "cu",
    name: "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic",
  },
  { code: "cv", name: "Chuvash" },
  { code: "cy", name: "Welsh" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "dv", name: "Divehi; Dhivehi; Maldivian" },
  { code: "dz", name: "Dzongkha" },
  { code: "ee", name: "Ewe" },
  { code: "el", name: "Greek, Modern (1453-)" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "es", name: "Spanish; Castilian" },
  { code: "et", name: "Estonian" },
  { code: "eu", name: "Basque" },
  { code: "fa", name: "Persian" },
  { code: "ff", name: "Fulah" },
  { code: "fi", name: "Finnish" },
  { code: "fj", name: "Fijian" },
  { code: "fo", name: "Faroese" },
  { code: "fr", name: "French" },
  { code: "fy", name: "Western Frisian" },
  { code: "ga", name: "Irish" },
  { code: "gd", name: "Gaelic; Scomttish Gaelic" },
  { code: "gl", name: "Galician" },
  { code: "gn", name: "Guarani" },
  { code: "gu", name: "Gujarati" },
  { code: "gv", name: "Manx" },
  { code: "ha", name: "Hausa" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "ho", name: "Hiri Motu" },
  { code: "hr", name: "Croatian" },
  { code: "ht", name: "Haitian; Haitian Creole" },
  { code: "hu", name: "Hungarian" },
  { code: "hy", name: "Armenian" },
  { code: "hz", name: "Herero" },
  {
    code: "ia",
    name: "Interlingua (International Auxiliary Language Association)",
  },
  { code: "id", name: "Indonesian" },
  { code: "ie", name: "Interlingue; Occidental" },
  { code: "ig", name: "Igbo" },
  { code: "ii", name: "Sichuan Yi; Nuosu" },
  { code: "ik", name: "Inupiaq" },
  { code: "io", name: "Ido" },
  { code: "is", name: "Icelandic" },
  { code: "it", name: "Italian" },
  { code: "iu", name: "Inuktitut" },
  { code: "ja", name: "Japanese" },
  { code: "jv", name: "Javanese" },
  { code: "ka", name: "Georgian" },
  { code: "kg", name: "Kongo" },
  { code: "ki", name: "Kikuyu; Gikuyu" },
  { code: "kj", name: "Kuanyama; Kwanyama" },
  { code: "kk", name: "Kazakh" },
  { code: "kl", name: "Kalaallisut; Greenlandic" },
  { code: "km", name: "Central Khmer" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "kr", name: "Kanuri" },
  { code: "ks", name: "Kashmiri" },
  { code: "ku", name: "Kurdish" },
  { code: "kv", name: "Komi" },
  { code: "kw", name: "Cornish" },
  { code: "ky", name: "Kirghiz; Kyrgyz" },
  { code: "la", name: "Latin" },
  { code: "lb", name: "Luxembourgish; Letzeburgesch" },
  { code: "lg", name: "Ganda" },
  { code: "li", name: "Limburgan; Limburger; Limburgish" },
  { code: "ln", name: "Lingala" },
  { code: "lo", name: "Lao" },
  { code: "lt", name: "Lithuanian" },
  { code: "lu", name: "Luba-Katanga" },
  { code: "lv", name: "Latvian" },
  { code: "mg", name: "Malagasy" },
  { code: "mh", name: "Marshallese" },
  { code: "mi", name: "Maori" },
  { code: "mk", name: "Macedonian" },
  { code: "ml", name: "Malayalam" },
  { code: "mn", name: "Mongolian" },
  { code: "mr", name: "Marathi" },
  { code: "ms", name: "Malay" },
  { code: "mt", name: "Maltese" },
  { code: "my", name: "Burmese" },
  { code: "na", name: "Nauru" },
  {
    code: "nb",
    name: "Bokmål, Norwegian; Norwegian Bokmål",
  },
  { code: "nd", name: "Ndebele, North; North Ndebele" },
  { code: "ne", name: "Nepali" },
  { code: "ng", name: "Ndonga" },
  { code: "nl", name: "Dutch; Flemish" },
  { code: "nn", name: "Norwegian Nynorsk; Nynorsk, Norwegian" },
  { code: "no", name: "Norwegian" },
  { code: "nr", name: "Ndebele, South; South Ndebele" },
  { code: "nv", name: "Navajo; Navaho" },
  { code: "ny", name: "Chichewa; Chewa; Nyanja" },
  { code: "oc", name: "Occitan (post 1500)" },
  { code: "oj", name: "Ojibwa" },
  { code: "om", name: "Oromo" },
  { code: "or", name: "Oriya" },
  { code: "os", name: "Ossetian; Ossetic" },
  { code: "pa", name: "Panjabi; Punjabi" },
  { code: "pi", name: "Pali" },
  { code: "pl", name: "Polish" },
  { code: "ps", name: "Pushto; Pashto" },
  { code: "pt", name: "Portuguese" },
  { code: "qu", name: "Quechua" },
  { code: "rm", name: "Romansh" },
  { code: "rn", name: "Rundi" },
  { code: "ro", name: "Romanian; Moldavian; Moldovan" },
  { code: "ru", name: "Russian" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "sa", name: "Sanskrit" },
  { code: "sc", name: "Sardinian" },
  { code: "sd", name: "Sindhi" },
  { code: "se", name: "Northern Sami" },
  { code: "sg", name: "Sango" },
  { code: "si", name: "Sinhala; Sinhalese" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sm", name: "Samoan" },
  { code: "sn", name: "Shona" },
  { code: "so", name: "Somali" },
  { code: "sq", name: "Albanian" },
  { code: "sr", name: "Serbian" },
  { code: "ss", name: "Swati" },
  { code: "st", name: "Sotho, Southern" },
  { code: "su", name: "Sundanese" },
  { code: "sv", name: "Swedish" },
  { code: "sw", name: "Swahili" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "tg", name: "Tajik" },
  { code: "th", name: "Thai" },
  { code: "ti", name: "Tigrinya" },
  { code: "tk", name: "Turkmen" },
  { code: "tl", name: "Tagalog" },
  { code: "tn", name: "Tswana" },
  { code: "to", name: "Tonga (Tonga Islands)" },
  { code: "tr", name: "Turkish" },
  { code: "ts", name: "Tsonga" },
  { code: "tt", name: "Tatar" },
  { code: "tw", name: "Twi" },
  { code: "ty", name: "Tahitian" },
  { code: "ug", name: "Uighur; Uyghur" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "ve", name: "Venda" },
  { code: "vi", name: "Vietnamese" },
  { code: "vo", name: "Volapük" },
  { code: "wa", name: "Walloon" },
  { code: "wo", name: "Wolof" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "za", name: "Zhuang; Chuang" },
  { code: "zh", name: "Chinese" },
  { code: "zu", name: "Zulu" },
];

document.addEventListener("DOMContentLoaded", function () {
  applySettings();
});

async function fetchMovieDetails(movieId) {
  showSpinner();
  const code = `${getMovieCode()}`;
  const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;
  const url2 = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=videos`;

  try {
    showSpinner();
    const response = await fetch(url);
    const movie = await response.json();
    const imdbId = movie.imdb_id;

    fetchMovieRatings(imdbId, movie);
    updateBrowserURL(movie.title);
  } catch (error) {
    document.getElementById("movie-details-container").innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Movie details currently unavailable - please try again</h2>
            </div>`;
    console.log("Error fetching movie details:", error);
  } finally {
    hideSpinner();
  }
}

function getRatingDetails(rating) {
  let details = { color: "black", text: rating, description: "" };

  switch (rating) {
    case "R":
      details = {
        color: "red",
        text: "R (Restricted)",
        description: " - No one 17 and under admitted",
      };
      break;
    case "PG-13":
      details = {
        color: "yellow",
        text: "PG-13 (Parents Strongly Cautioned)",
        description: " - May be inappropriate for children under 13",
      };
      break;
    case "PG":
      details = {
        color: "orange",
        text: "PG (Parental Guidance Suggested)",
        description: " - May not be suitable for children",
      };
      break;
    case "G":
      details = {
        color: "green",
        text: "G (General Audiences)",
        description: " - All ages admitted",
      };
      break;
    case "NC-17":
      details = {
        color: "darkred",
        text: "NC-17 (Adults Only)",
        description: " - No one 17 and under admitted",
      };
      break;
    case "TV-Y":
      details = {
        color: "lightgreen",
        text: "TV-Y (All Children)",
        description: " - Appropriate for all children",
      };
      break;
    case "TV-Y7":
      details = {
        color: "lightblue",
        text: "TV-Y7 (Directed to Older Children)",
        description: " - Suitable for children ages 7 and up",
      };
      break;
    case "TV-G":
      details = {
        color: "green",
        text: "TV-G (General Audience)",
        description: " - Suitable for all ages",
      };
      break;
    case "TV-PG":
      details = {
        color: "orange",
        text: "TV-PG (Parental Guidance Suggested)",
        description: " - May not be suitable for younger children",
      };
      break;
    case "TV-14":
      details = {
        color: "yellow",
        text: "TV-14 (Parents Strongly Cautioned)",
        description: " - May be inappropriate for children under 14",
      };
      break;
    case "TV-MA":
      details = {
        color: "red",
        text: "TV-MA (Mature Audience Only)",
        description: " - Specifically designed to be viewed by adults",
      };
      break;
    case "NR":
      details = {
        color: "white",
        text: "NR (Not Rated)",
        description: " - Movie has not been officially rated",
      };
      break;
    case "UR":
    case "Unrated":
      details = {
        color: "white",
        text: "UR (Unrated)",
        description: " - Contains content not used in the rated version",
      };
      break;
    default:
      details = {
        color: "white",
        text: rating,
        description: " - Rating information not available",
      };
      break;
  }

  return details;
}

async function fetchMovieRatings(imdbId, tmdbMovieData) {
  showSpinner();
  document.body.offsetHeight;

  const req = [
    await getMovieCode2(),
    "58efe859",
    "60a09d79",
    "956e468a",
    "bd55ada4",
    "cbfc076",
    "dc091ff2",
    "6e367eef",
    "2a2a3080",
    "d20a931f",
    "531a4313",
  ];
  const baseURL = `https://${getMovieActor()}/?i=${imdbId}&${getMovieName()}`;

  async function tryFetch(req) {
    const url = `${baseURL}${req}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API limit reached or other error");
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async function fetchWithTimeout(req, timeout = 5000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), timeout);
      tryFetch(req)
        .then((data) => {
          clearTimeout(timer);
          resolve(data);
        })
        .catch(() => {
          clearTimeout(timer);
          resolve(null);
        });
    });
  }

  const requests = req.map((key) => fetchWithTimeout(key));
  const responses = await Promise.all(requests);
  const data = responses.find((response) => response !== null);

  if (!data) {
    populateMovieDetails(
      tmdbMovieData,
      tmdbMovieData.vote_average,
      "N/A",
      "View on Metacritics",
    );
    return;
  }

  let imdbRating = data.imdbRating ? data.imdbRating : "N/A";
  if (imdbRating === "N/A" || imdbRating === "0.0" || imdbRating === null) {
    imdbRating = "N/A";
  }

  let rtRating = "N/A";
  let metascore = data.Metascore ? `${data.Metascore}/100` : "N/A";
  let awards = data.Awards;
  let rated = data.Rated ? data.Rated : "Rating information unavailable";

  if (awards === "N/A") {
    awards = "Awards information unavailable";
  }
  if (metascore === "N/A/100") {
    const metacriticsRatingValue =
      imdbRating !== "N/A"
        ? parseFloat(imdbRating)
        : tmdbMovieData.vote_average / 2;
    metascore =
      calculateFallbackMetacriticsRating(
        metacriticsRatingValue,
        tmdbMovieData.vote_average,
      ) + "/100";
  }
  if (rtRating === "N/A") {
    const imdbRatingValue =
      imdbRating !== "N/A"
        ? parseFloat(imdbRating)
        : tmdbMovieData.vote_average / 2;
    rtRating = calculateFallbackRTRating(
      imdbRatingValue,
      tmdbMovieData.vote_average,
    );
  }

  populateMovieDetails(
    tmdbMovieData,
    imdbRating,
    rtRating,
    metascore,
    awards,
    rated,
  );

  hideSpinner();
}

function updateBrowserURL(title) {
  const nameSlug = createNameSlug(title);
  const newURL =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    nameSlug;
  window.history.replaceState({ path: newURL }, "", newURL);
}

function createNameSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]/g, "");
}

function calculateFallbackRTRating(imdbRating, tmdbRating) {
  const normalizedImdbRating = imdbRating * 10;
  const normalizedTmdbRating = tmdbRating * 10;

  const weightImdb = 0.8;
  const weightTmdb = 0.1;

  return (
    (
      normalizedImdbRating * weightImdb +
      normalizedTmdbRating * weightTmdb
    ).toFixed(0) + "%"
  );
}

function calculateFallbackMetacriticsRating(imdbRating, tmdbRating) {
  const normalizedImdbRating = imdbRating * 10;
  const normalizedTmdbRating = tmdbRating * 10;

  const weightImdb = 0.8;
  const weightTmdb = 0.1;

  return (
    normalizedImdbRating * weightImdb +
    normalizedTmdbRating * weightTmdb
  ).toFixed(0);
}

let trailerIframeDisplayed = false;

function createTrailerButton(trailerUrl) {
  const trailerButton = document.createElement("button");
  trailerButton.textContent = "Watch Trailer";
  trailerButton.title = "Click to watch the trailer of this movie";
  trailerButton.id = "trailerButton";

  trailerButton.addEventListener("click", function () {
    if (!trailerIframeDisplayed) {
      showTrailerIframe(trailerUrl);
      trailerButton.textContent = "Close Trailer";
      trailerButton.title = "Click to close the trailer";
    } else {
      closeTrailerIframe();
      trailerButton.textContent = "Watch Trailer";
      trailerButton.title = "Click to watch the trailer of this movie";
    }
  });

  trailerButton.classList.add("trailer-button");
  trailerButton.style.font = "inherit";

  return trailerButton;
}

function closeTrailerIframe() {
  const iframeContainer = document.querySelector(".trailer-button + div");

  if (iframeContainer) {
    iframeContainer.style.height = "0";
    setTimeout(() => iframeContainer.remove(), 500);
  }
  trailerIframeDisplayed = false;
}

function getYouTubeVideoId(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("v");
}

function showTrailerIframe(trailerUrl) {
  trailerUrlGlobal = trailerUrl;

  const iframeContainer = document.createElement("div");
  iframeContainer.style.position = "relative";
  iframeContainer.style.width = "400px";
  iframeContainer.style.margin = "0 auto";
  iframeContainer.style.overflow = "hidden";
  iframeContainer.style.height = "0";
  iframeContainer.style.transition = "height 0.5s ease-in-out";
  iframeContainer.style.borderRadius = "8px";

  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "src",
    `https://www.youtube.com/embed/${getYouTubeVideoId(trailerUrl)}?autoplay=1`,
  );
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "315");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  );
  iframe.setAttribute("allowfullscreen", true);

  iframeContainer.appendChild(iframe);

  const trailerButton = document.querySelector(".trailer-button");
  trailerButton.parentNode.insertBefore(
    iframeContainer,
    trailerButton.nextSibling,
  );
  trailerButton.id = "trailerButton";

  setTimeout(() => (iframeContainer.style.height = "315px"), 50);

  trailerIframeDisplayed = true;
}

function getRtSlug(title) {
  return title
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/part one/g, "part_1")
    .replace(/-/g, "")
    .replace(/&/g, "and")
    .replace(/ /g, "_")
    .replace(/[^\w-]/g, "");
}

function createMetacriticSlug(title) {
  return title
    .toLowerCase()
    .replace(/part\sone/g, "part-1")
    .replace(/:|_|-|\s/g, "-")
    .replace(/&/g, "and")
    .replace(/--+/g, "-")
    .replace(/[^\w-]/g, "");
}

async function fetchStreamingLinks(movieId) {
  const url = `https://${getMovieVerseData()}/3/movie/${movieId}/watch/providers?${generateMovieNames()}${getMovieCode()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results || {};
    let providersMap = {};

    Object.values(results).forEach((region) => {
      if (region.flatrate) {
        region.flatrate.forEach((provider) => {
          providersMap[provider.provider_id] = provider;
        });
      }
    });

    return Object.values(providersMap).slice(0, 7);
  } catch (error) {
    console.error("Error fetching streaming links:", error);
  }
}

let globalRatingPercentage = 0;

async function populateMovieDetails(
  movie,
  imdbRating,
  rtRating,
  metascore,
  awards,
  rated,
) {
  showSpinner();
  document.getElementById("movie-title").textContent = movie.title;

  const imdbLink = `https://www.imdb.com/title/${movie.imdb_id}`;
  const streamingProviders = await fetchStreamingLinks(movie.id);
  const movieTitleEncoded = encodeURIComponent(movie.title);

  const streamingHTML =
    streamingProviders.length > 0
      ? streamingProviders
          .map((provider) => {
            let providerLink;
            switch (provider.provider_name.toLowerCase()) {
              case "netflix":
                providerLink = `https://www.netflix.com/search?q=${movieTitleEncoded}`;
                break;
              case "disney plus":
                providerLink = `https://www.disneyplus.com/search?q=${movieTitleEncoded}`;
                break;
              case "hbo max":
                providerLink = `https://www.hbomax.com/search?q=${movieTitleEncoded}`;
                break;
              case "hulu":
                providerLink = `https://www.hulu.com/search?q=${movieTitleEncoded}`;
                break;
              case "amazon prime video":
                providerLink = `https://www.amazon.com/s?k=${movieTitleEncoded}`;
                break;
              case "apple tv plus":
                providerLink = `https://tv.apple.com/search?term=${movieTitleEncoded}`;
                break;
              case "stan":
                providerLink = `https://www.stan.com.au/search?q=${movieTitleEncoded}`;
                break;
              case "player":
                providerLink = `https://player.pl/szukaj?search=${movieTitleEncoded}`;
                break;
              default:
                providerLink = `https://www.google.com/search?q=watch+${movieTitleEncoded}+on+${encodeURIComponent(provider.provider_name)}`;
                break;
            }

            return `<a href="${providerLink}" target="_blank" title="Watch on ${provider.provider_name}" style="display: inline-flex; align-items: flex-end; vertical-align: bottom;" class="streaming-logo">
                    <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name}" style="width: 50px; margin-left: 10px;" loading="lazy">
                </a>`;
          })
          .join("") +
        `<a href="https://www.justwatch.com/us/search?q=${movieTitleEncoded}" target="_blank" title="View more streaming options on JustWatch" style="display: inline-flex; align-items: center; vertical-align: bottom;" class="streaming-logo">
                        <img src="../../images/justwatchlogo.webp" alt="JustWatch" style="width: 50px;" loading="lazy">
                    </a>`
      : "No streaming options available.";

  const metaCriticsLink =
    metascore !== "N/A"
      ? `https://www.metacritic.com/search/${createMetacriticSlug(movie.title)}`
      : "#";
  const ratingDetails = getRatingDetails(rated);
  const ratedElement = rated
    ? `<p id="movie-rated-element"><strong>Rated:</strong> <span style="color: ${ratingDetails.color};"><strong>${ratingDetails.text}</strong>${ratingDetails.description}</span></p>`
    : "";

  document.getElementById("movie-rating").innerHTML = ``;
  document.title = movie.title + " - Movie Details";

  const movieDescription = document.getElementById("movie-description");
  const metascoreElement = metascore
    ? `<p style="margin-bottom: 0"><strong>Metascore:</strong> <a id="metacritics" href="${metaCriticsLink}" title="Click to search/view on Metacritics" target="_blank">${metascore}</a></p>`
    : "";
  const awardsElement = awards
    ? `<p><strong>Awards:</strong> ${awards}</p>`
    : "";

  const overview = movie.overview ? movie.overview : "No overview available";
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  const releaseDate = movie.release_date || "Release date not available";
  const releaseDateObj = new Date(releaseDate);
  const currentDate = new Date();

  let timeAgoString = "";
  if (releaseDateObj > currentDate) {
    timeAgoString = "0 months";
  } else {
    const timeDiff = currentDate - releaseDateObj;
    let years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    let remainingMonths = Math.round(
      (timeDiff % (1000 * 60 * 60 * 24 * 365.25)) /
        (1000 * 60 * 60 * 24 * 30.44),
    );

    if (remainingMonths >= 12) {
      years += 1;
      remainingMonths -= 12;
    }
    if (years > 0) {
      timeAgoString += `${years} year${years > 1 ? "s" : ""}`;
      if (remainingMonths > 0) {
        timeAgoString += ` and `;
      }
    }
    if (remainingMonths > 0 || years === 0) {
      timeAgoString += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
    }
  }

  const releaseDateWithTimeAgo = `${releaseDate} (${timeAgoString} ago)`;
  const budget =
    movie.budget === 0
      ? "Information Not Available"
      : `$${movie.budget.toLocaleString()}`;
  const revenue =
    movie.revenue <= 1000
      ? "Information Not Available"
      : `$${movie.revenue.toLocaleString()}`;
  const tagline = movie.tagline ? movie.tagline : "No tagline found";
  const languages = movie.spoken_languages.map((lang) => lang.name).join(", ");

  const countries = movie.production_countries
    .map((country) => country.name)
    .join(", ");
  const popularityScore = movie.popularity.toFixed(0);

  let keywords = movie.keywords
    ? movie.keywords.keywords
        .map(
          (kw) =>
            `<a class="keyword-link" href="javascript:void(0);" onclick="handleKeywordClick('${kw.name.replace(/'/g, "\\'")}')" title="Click to search for movies with the keyword '${kw.name}'">${kw.name}</a>`,
        )
        .join(", ")
    : "None Available";

  if (keywords.length === 0) {
    keywords = "No keywords have been added";
  }

  const scaledRating = (movie.vote_average / 2).toFixed(1);
  const ratingPercentage = (scaledRating / 5) * 100;
  globalRatingPercentage = ratingPercentage;
  const voteCount = movie.vote_count ? movie.vote_count : "0";

  let ratingColor;
  if (scaledRating <= 1) {
    ratingColor = "#FF0000";
  } else if (scaledRating < 2) {
    ratingColor = "#FFA500";
  } else if (scaledRating < 3) {
    ratingColor = "#FFFF00";
  } else if (scaledRating < 4) {
    ratingColor = "#2196F3";
  } else {
    ratingColor = "#4CAF50";
  }

  const ratingHTML = `
    <div class="rating-container" title="Your rating also counts - it might take a while for us to update!">
      <strong>MovieVerse Rating:</strong>
      <div class="rating-bar" onclick="handleRatingClick()">
        <div class="rating-fill" style="width: 0; background-color: ${ratingColor};" id="rating-fill"></div>
      </div>
      <span class="rating-text"><strong>${scaledRating}/5.0</strong> (<strong id="user-votes">${voteCount}</strong> votes)</span>
    </div>
  `;

  const popularityThreshold = 80;
  const isPopular = movie.popularity >= popularityThreshold;
  const popularityText = isPopular
    ? `${popularityScore} (This movie is <strong>popular</strong>)`
    : `${popularityScore} (This movie is <strong>unpopular</strong>)`;

  const movieStatus = `<p><strong>Status:</strong> ${movie.status}</p>`;
  const runtime =
    movie.runtime > 0
      ? movie.runtime + " minutes"
      : "Runtime Info Not Available";

  const originalTitle =
    movie.original_title !== movie.title
      ? `<p><strong>Original Title:</strong> ${movie.original_title}</p>`
      : `<p><strong>Original Title:</strong> ${movie.title}</p>`;
  const tmdbRating = movie.vote_average.toFixed(1);

  document.getElementById("movie-description").innerHTML += `
        <p><strong>Description: </strong>${overview}</p>
        ${originalTitle}
        <p><strong>Tagline:</strong> ${tagline}</p>
        <p><strong>Genres:</strong> ${genres}</p>
        ${ratedElement}
        ${movieStatus}
        <p><strong>Release Date:</strong> ${releaseDateWithTimeAgo}</p>
        <p><strong>Runtime:</strong> ${runtime}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Revenue:</strong> ${revenue}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Countries of Production:</strong> ${countries}</p>
        <p><strong>Popularity Score:</strong> <span class="${isPopular ? "popular" : ""}">${popularityText}</span></p>
        ${ratingHTML}
        ${awardsElement}
        <p><strong>TMDb Rating:</strong> <a href="https://www.themoviedb.org/movie/${movie.id}" id="rating" target="_blank">${tmdbRating}/10.0</a></p>
        ${metascoreElement}
    `;

  if (movie.credits && movie.credits.crew) {
    const directors = movie.credits.crew.filter(
      (member) => member.job === "Director",
    );

    if (directors.length > 0) {
      const directorSection = document.createElement("div");
      directorSection.classList.add("director-section");
      directorSection.style.textAlign = "center";

      const directorTitle = document.createElement("p");
      directorTitle.innerHTML = "<strong>Director:</strong>";
      directorTitle.style.padding = "0";
      directorSection.appendChild(directorTitle);

      const directorList = document.createElement("div");
      directorList.classList.add("director-list");

      directors.forEach((director) => {
        const directorLink = document.createElement("a");
        directorLink.classList.add("director-link");
        directorLink.href = "javascript:void(0);";
        directorLink.style.textDecoration = "none";
        directorLink.setAttribute(
          "onclick",
          `handleDirectorClick(${director.id}, '${director.name.replace(/'/g, "\\'")}');`,
        );

        const directorItem = document.createElement("div");
        directorItem.classList.add("cast-item");

        const directorImage = document.createElement("img");
        directorImage.classList.add("cast-image");

        if (director.profile_path) {
          directorImage.src = IMGPATH2 + director.profile_path;
          directorImage.alt = `${director.name} Profile Picture`;
        } else {
          directorImage.alt = "Image Not Available";
          directorImage.src = "https://movie-verse.com/images/user-default.png";
          directorImage.style.filter = "grayscale(100%)";
          directorImage.style.objectFit = "cover";
        }

        directorItem.appendChild(directorImage);

        const directorDetails = document.createElement("div");
        directorDetails.classList.add("cast-details");

        const directorName = document.createElement("p");
        directorName.classList.add("actor-name");
        directorName.textContent = director.name;
        directorDetails.appendChild(directorName);

        directorItem.appendChild(directorDetails);
        directorLink.appendChild(directorItem);
        directorList.appendChild(directorLink);
      });

      directorSection.appendChild(directorList);
      document.getElementById("movie-description").appendChild(directorSection);
    } else {
      const noDirectorsElement = document.createElement("p");
      noDirectorsElement.innerHTML = `<strong>Director:</strong> Information not available`;
      document
        .getElementById("movie-description")
        .appendChild(noDirectorsElement);
    }
  }

  const castSection = document.createElement("div");
  castSection.classList.add("cast-section");

  const castTitle = document.createElement("p");
  castTitle.innerHTML = "<strong>Notable Cast:</strong>";
  castSection.appendChild(castTitle);

  if (movie.credits && movie.credits.cast.length > 0) {
    const castList = document.createElement("div");
    castList.classList.add("cast-list");
    castList.style.display = "flex";
    castList.style.flexWrap = "wrap";
    castList.style.justifyContent = "center";
    castList.style.gap = "3px";
    const topTwelveCast = movie.credits.cast.slice(0, 12);

    topTwelveCast.forEach((actor) => {
      const castItemLink = document.createElement("a");
      castItemLink.classList.add("actor-link");
      castItemLink.href = "javascript:void(0);";
      castItemLink.setAttribute(
        "onclick",
        `selectActorId(${actor.id}, '${actor.name.replace(/'/g, "\\'")}');`,
      );

      const castItem = document.createElement("div");
      castItem.classList.add("cast-item");

      const actorImage = document.createElement("img");
      actorImage.classList.add("cast-image");

      if (actor.profile_path) {
        actorImage.src = IMGPATH2 + actor.profile_path;
        actorImage.alt = `${actor.name} Profile Picture`;
      } else {
        actorImage.alt = "Image Not Available";
        actorImage.src = "https://movie-verse.com/images/user-default.png";
        actorImage.style.filter = "grayscale(100%)";
        actorImage.style.objectFit = "cover";
      }

      castItem.appendChild(actorImage);

      const actorDetails = document.createElement("div");
      actorDetails.classList.add("cast-details");

      const actorName = document.createElement("p");
      actorName.classList.add("actor-name");
      actorName.textContent = actor.name;
      actorDetails.appendChild(actorName);

      const character = actor.character ? ` (as ${actor.character})` : "";
      const actorRole = document.createElement("p");
      actorRole.classList.add("actor-role");
      actorRole.textContent = character;
      actorDetails.appendChild(actorRole);

      castItem.appendChild(actorDetails);
      castItemLink.appendChild(castItem);
      castList.appendChild(castItemLink);
    });

    castSection.appendChild(castList);
  } else {
    castSection.appendChild(document.createTextNode("None available."));
  }

  document.getElementById("movie-description").appendChild(castSection);

  if (
    movie.similar &&
    movie.similar.results &&
    movie.similar.results.length > 0
  ) {
    const similarMoviesSection = document.createElement("div");
    similarMoviesSection.classList.add("similar-movies-section");

    const similarMoviesTitle = document.createElement("p");
    similarMoviesTitle.innerHTML = "<strong>Similar Movies:</strong>";
    similarMoviesSection.appendChild(similarMoviesTitle);

    const similarMoviesList = document.createElement("div");
    similarMoviesList.classList.add("similar-movies-list");
    similarMoviesList.style.display = "flex";
    similarMoviesList.style.flexWrap = "wrap";
    similarMoviesList.style.justifyContent = "center";
    similarMoviesList.style.gap = "3px";

    let topTenSimilarMovies = movie.similar.results;
    topTenSimilarMovies = topTenSimilarMovies.sort(
      (a, b) => b.popularity - a.popularity,
    );
    topTenSimilarMovies = topTenSimilarMovies.slice(0, 18);
    topTenSimilarMovies.forEach((similarMovie) => {
      const similarMovieLink = document.createElement("a");
      similarMovieLink.classList.add("similar-movie-link");
      similarMovieLink.href = "javascript:void(0);";
      similarMovieLink.setAttribute(
        "onclick",
        `handleSimilarMovieClick(${similarMovie.id}, '${similarMovie.title.replace(/'/g, "\\'")}');`,
      );

      const similarMovieItem = document.createElement("div");
      similarMovieItem.classList.add("cast-item");

      const similarMovieImage = document.createElement("img");
      similarMovieImage.classList.add("cast-image");

      if (similarMovie.poster_path) {
        similarMovieImage.src = IMGPATH2 + similarMovie.poster_path;
        similarMovieImage.alt = `${similarMovie.title} Poster`;
        similarMovieImage.style.objectFit = "fill";
      } else {
        similarMovieImage.alt = "Image Not Available";
        similarMovieImage.src =
          "https://movie-verse.com/images/movie-default.jpg";
        similarMovieImage.style.filter = "grayscale(100%)";
        similarMovieImage.style.objectFit = "cover";
      }

      similarMovieItem.appendChild(similarMovieImage);

      const similarMovieDetails = document.createElement("div");
      similarMovieDetails.classList.add("cast-details");

      const similarMovieTitle = document.createElement("p");
      similarMovieTitle.classList.add("actor-name");
      similarMovieTitle.textContent = similarMovie.title;
      similarMovieDetails.appendChild(similarMovieTitle);

      similarMovieItem.appendChild(similarMovieDetails);
      similarMovieLink.appendChild(similarMovieItem);
      similarMoviesList.appendChild(similarMovieLink);
    });

    similarMoviesSection.appendChild(similarMoviesList);
    document
      .getElementById("movie-description")
      .appendChild(similarMoviesSection);
  } else {
    const noSimilarMoviesElement = document.createElement("p");
    noSimilarMoviesElement.innerHTML = `<strong>Similar Movies:</strong> None available`;
    document
      .getElementById("movie-description")
      .appendChild(noSimilarMoviesElement);
  }

  if (movie.production_companies && movie.production_companies.length > 0) {
    const companiesSection = document.createElement("div");
    companiesSection.classList.add("companies-section");

    const companiesTitle = document.createElement("p");
    companiesTitle.innerHTML = "<strong>Production Companies:</strong>";
    companiesSection.appendChild(companiesTitle);

    const companiesList = document.createElement("div");
    companiesList.classList.add("companies-list");
    companiesList.style.display = "flex";
    companiesList.style.flexWrap = "wrap";
    companiesList.style.justifyContent = "center";
    companiesList.style.gap = "5px";

    let productionCompanies = movie.production_companies.slice(0, 6);

    productionCompanies.forEach((company) => {
      const companyLink = document.createElement("a");
      companyLink.classList.add("company-link");
      companyLink.href = "javascript:void(0);";
      companyLink.setAttribute(
        "onclick",
        `handleCompanyClick(${company.id}, '${company.name.replace(/'/g, "\\'")}');`,
      );

      const companyItem = document.createElement("div");
      companyItem.classList.add("company-item");

      const companyLogo = document.createElement("img");
      companyLogo.classList.add("company-logo");

      const IMGPATH3 = "https://image.tmdb.org/t/p/w300";

      if (company.logo_path) {
        companyLogo.src = IMGPATH3 + company.logo_path;
        companyLogo.alt = `${company.name} Logo`;
        companyLogo.style.backgroundColor = "white";
      } else {
        companyLogo.alt = "Logo Not Available";
        companyLogo.src = "https://movie-verse.com/images/company-default.png";
        companyLogo.style.filter = "grayscale(100%)";
        companyLogo.style.objectFit = "cover";
      }

      companyItem.appendChild(companyLogo);

      const companyDetails = document.createElement("div");
      companyDetails.classList.add("company-details");

      const companyName = document.createElement("p");
      companyName.classList.add("company-name");
      companyName.textContent = company.name;
      companyDetails.appendChild(companyName);

      companyItem.appendChild(companyDetails);
      companyLink.appendChild(companyItem);
      companiesList.appendChild(companyLink);
    });

    companiesSection.appendChild(companiesList);
    document.getElementById("movie-description").appendChild(companiesSection);
  } else {
    const noCompaniesElement = document.createElement("p");
    noCompaniesElement.innerHTML = `<strong>Production Companies:</strong> Information not available`;
    document
      .getElementById("movie-description")
      .appendChild(noCompaniesElement);
  }

  document.getElementById("movie-description").innerHTML += `
        <p><strong>Streaming Options:</strong> ${streamingHTML}</p>`;

  const homepage = document.createElement("p");
  homepage.innerHTML = movie.homepage
    ? `<strong>Homepage:</strong> <a id="rating-link" href="${movie.homepage}" target="_blank">Visit Homepage</a>`
    : `<strong>Homepage:</strong> Information unavailable`;
  movieDescription.appendChild(homepage);

  const keywordsElement = document.createElement("p");
  keywordsElement.innerHTML = `<strong>Keywords:</strong> ${keywords}`;
  movieDescription.appendChild(keywordsElement);

  createImdbRatingCircle(imdbRating, imdbLink);

  const mediaUrl = `https://${getMovieVerseData()}/3/movie/${movie.id}/images?${generateMovieNames()}${getMovieCode()}`;
  const mediaResponse = await fetch(mediaUrl);
  const mediaData = await mediaResponse.json();
  const images = mediaData.backdrops.slice(0, 80);

  const detailsContainer = document.getElementById("movie-description");

  const mediaContainer = document.createElement("div");
  mediaContainer.id = "media-container";
  mediaContainer.style = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 90vw; 
        max-width: 450px;
        margin: 20px auto;
        overflow: hidden;
        box-sizing: border-box;
        border-radius: 16px;
    `;

  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = "Media:";
  mediaTitle.style = `
        font-weight: bold;
        align-self: start;
        margin-bottom: 5px;
    `;

  detailsContainer.appendChild(mediaTitle);
  detailsContainer.appendChild(mediaContainer);

  const imageWrapper = document.createElement("div");
  imageWrapper.style = `
        width: 100%;
        max-height: 210px; 
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    `;

  const imageElement = document.createElement("img");
  imageElement.style = `
        width: 100%;
        height: auto;
        transition: opacity 0.5s ease-in-out;
        opacity: 1;
        cursor: pointer;
        object-fit: contain;
        border-radius: 16px;
    `;

  imageWrapper.appendChild(imageElement);
  mediaContainer.appendChild(imageWrapper);

  if (images.length > 0) {
    imageElement.src = `https://image.tmdb.org/t/p/w780${images[0].file_path}`;
  }

  let modalOpen = false;

  imageElement.addEventListener("click", function () {
    let imageUrl = this.src.replace("w780", "w1280");
    modalOpen = true;
    const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <button id="prevModalButton" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-left"></i></button>
                <img src="${imageUrl}" style="max-width: 80%; max-height: 95%; border-radius: 16px; cursor: default; transition: opacity 0.5s ease-in-out;" onclick="event.stopPropagation();" loading="lazy" alt="Movie Image">
                <button id="nextModalButton" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-right"></i></button>
                <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const modal = document.getElementById("image-modal");
    const modalImage = modal.querySelector("img");
    const closeModalBtn = document.getElementById("removeBtn");

    closeModalBtn.onclick = function () {
      modal.remove();
      modalOpen = false;
      imageElement.src = modalImage.src.replace("w1280", "w780");
    };

    modal.addEventListener("click", function (event) {
      if (event.target === this) {
        this.remove();
        modalOpen = false;
        imageElement.src = modalImage.src.replace("w1280", "w780");
      }
    });

    const prevModalButton = document.getElementById("prevModalButton");
    prevModalButton.onmouseover = () =>
      (prevModalButton.style.backgroundColor = "#ff8623");
    prevModalButton.onmouseout = () =>
      (prevModalButton.style.backgroundColor = "#7378c5");
    prevModalButton.onclick = () =>
      navigateMediaAndModal(images, imageElement, modalImage, -1);

    const nextModalButton = document.getElementById("nextModalButton");
    nextModalButton.onmouseover = () =>
      (nextModalButton.style.backgroundColor = "#ff8623");
    nextModalButton.onmouseout = () =>
      (nextModalButton.style.backgroundColor = "#7378c5");
    nextModalButton.onclick = () =>
      navigateMediaAndModal(images, imageElement, modalImage, 1);
  });

  function navigateMediaAndModal(images, imgElement1, imgElement2, direction) {
    imgElement1.style.opacity = "0";
    imgElement2.style.opacity = "0";
    currentIndex = (currentIndex + direction + images.length) % images.length;

    const newSrc1 = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
    const newSrc2 = `https://image.tmdb.org/t/p/w1280${images[currentIndex].file_path}`;
    const tempImage1 = new Image();
    const tempImage2 = new Image();
    tempImage1.src = newSrc1;
    tempImage2.src = newSrc2;

    tempImage1.onload = () => {
      tempImage2.onload = () => {
        setTimeout(() => {
          imgElement1.src = newSrc1;
          imgElement2.src = newSrc2;
          imgElement1.style.opacity = "1";
          imgElement2.style.opacity = "1";
        }, 500);
      };
    };

    sessionStorage.setItem("currentIndex", currentIndex);
    updateDots(currentIndex);
    resetRotationInterval();
  }

  const prevButton = document.createElement("button");
  prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  prevButton.style = `
        position: absolute;
        left: 5px; 
        top: 50%;
        transform: translateY(-50%);
        background-color: #7378c5;
        color: white;
        border-radius: 8px;
        height: 30px;
        width: 30px;
        border: none;
        cursor: pointer;
        z-index: 10;
    `;
  prevButton.onmouseover = () => (prevButton.style.backgroundColor = "#ff8623");
  prevButton.onmouseout = () => (prevButton.style.backgroundColor = "#7378c5");
  prevButton.onclick = () => navigateMedia(images, imageElement, -1);
  imageWrapper.appendChild(prevButton);

  const nextButton = document.createElement("button");
  nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
  nextButton.style = `
        position: absolute;
        right: 5px; 
        top: 50%;
        transform: translateY(-50%);
        background-color: #7378c5;
        color: white;
        border-radius: 8px;
        height: 30px;
        width: 30px;
        border: none;
        cursor: pointer;
        z-index: 10;
    `;
  nextButton.onmouseover = () => (nextButton.style.backgroundColor = "#ff8623");
  nextButton.onmouseout = () => (nextButton.style.backgroundColor = "#7378c5");
  nextButton.onclick = () => navigateMedia(images, imageElement, 1);
  imageWrapper.appendChild(nextButton);

  let rotationInterval;

  if (images.length === 0) {
    mediaContainer.innerHTML = "<p>No media available</p>";
  } else if (images.length > 1) {
    startRotationInterval();
  }

  function startRotationInterval() {
    rotationInterval = setInterval(() => {
      if (!modalOpen) {
        navigateMedia(images, imageElement, 1);
      }
    }, 3000);
  }

  function resetRotationInterval() {
    clearInterval(rotationInterval);
    startRotationInterval();
  }

  function navigateMedia(images, imgElement, direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    imgElement.style.opacity = "0";

    const newSrc = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
    const tempImage = new Image();
    tempImage.src = newSrc;

    tempImage.onload = () => {
      setTimeout(() => {
        imgElement.src = newSrc;
        imgElement.style.opacity = "1";
      }, 420);
    };

    sessionStorage.setItem("currentIndex", currentIndex);
    updateDots(currentIndex);
    resetRotationInterval();
  }

  const indicatorContainer = document.createElement("div");
  indicatorContainer.style = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 15px;
    `;

  const maxDotsPerLine = 10;
  let currentLine = document.createElement("div");
  currentLine.style.display = "flex";

  images.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "indicator";
    dot.style = `
            width: 8px;
            height: 8px;
            margin: 0 5px;
            background-color: ${index === currentIndex ? "#ff8623" : "#bbb"}; 
            border-radius: 50%;
            cursor: pointer;
            margin-bottom: 5px;
        `;
    dot.addEventListener("click", () => {
      navigateMedia(images, imageElement, index - currentIndex);
      updateDots(index);
    });
    dot.addEventListener(
      "mouseover",
      () => (dot.style.backgroundColor = "#6a6a6a"),
    );
    dot.addEventListener(
      "mouseout",
      () =>
        (dot.style.backgroundColor =
          index === currentIndex ? "#ff8623" : "#bbb"),
    );

    currentLine.appendChild(dot);

    if ((index + 1) % maxDotsPerLine === 0 && index !== images.length - 1) {
      indicatorContainer.appendChild(currentLine);
      currentLine = document.createElement("div");
      currentLine.style.display = "flex";
    }
  });

  if (currentLine.children.length > 0) {
    indicatorContainer.appendChild(currentLine);
  }

  mediaContainer.appendChild(indicatorContainer);

  function updateDots(newIndex) {
    const dots = document.querySelectorAll(".indicator");
    dots.forEach((dot, index) => {
      dot.style.backgroundColor = index === newIndex ? "#ff8623" : "#bbb";
    });
  }

  async function getInitialPoster(movieId) {
    const response = await fetch(
      `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${getMovieCode()}`,
    );
    const data = await response.json();
    return data.poster_path;
  }

  async function getAdditionalPosters(movieId) {
    const response = await fetch(
      `https://${getMovieVerseData()}/3/movie/${movieId}/images?${generateMovieNames()}${getMovieCode()}`,
    );
    const data = await response.json();
    return data.posters.map((poster) => poster.file_path);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function rotateImages(movieImage, imagePaths, interval = 4000) {
    const uniqueImagePaths = [...new Set(imagePaths)];

    if (uniqueImagePaths.length <= 1) return;

    let currentIndex = 0;

    const preloadNextImage = (nextIndex) => {
      return loadImage(IMGPATH + uniqueImagePaths[nextIndex]);
    };

    const updateImage = async () => {
      const nextIndex = (currentIndex + 1) % uniqueImagePaths.length;
      const nextImageSrc = IMGPATH + uniqueImagePaths[nextIndex];

      try {
        const img = await preloadNextImage(nextIndex);
        movieImage.style.opacity = "0";
        await new Promise((resolve) => setTimeout(resolve, 1000));
        movieImage.src = img.src;
        movieImage.alt = `Poster ${nextIndex + 1}`;
        movieImage.style.opacity = "1";
        currentIndex = nextIndex;
      } catch (error) {
        console.error("Failed to load image:", nextImageSrc);
        movieImage.style.opacity = "1";
      }
    };

    setInterval(updateImage, interval);
  }

  const movieImage = document.getElementById("movie-image");
  const movie_id = movie.id;

  await (async () => {
    const initialPoster = await getInitialPoster(movie_id);

    if (initialPoster) {
      movieImage.src = IMGPATH + initialPoster;
      movieImage.alt = "Movie Title";
      movieImage.loading = "lazy";
      movieImage.style.transition =
        "transform 0.3s ease-in-out, opacity 1s ease-in-out";
      movieImage.style.opacity = "1";

      const additionalPosters = await getAdditionalPosters(movie_id);
      let allPosters = [initialPoster, ...additionalPosters];
      allPosters = allPosters.sort(() => 0.5 - Math.random()).slice(0, 10);
      rotateImages(movieImage, allPosters);
    } else {
      const noImageContainer = document.createElement("div");
      noImageContainer.id = "no-image-container";
      noImageContainer.style.textAlign = "center";

      const noImageText = document.createElement("h2");
      noImageText.textContent = "Movie Image Not Available";
      noImageContainer.appendChild(noImageText);

      if (movieImage.parentNode) {
        movieImage.parentNode.replaceChild(noImageContainer, movieImage);
      } else {
        document.body.appendChild(noImageContainer);
      }
    }
  })();

  const movieId = movie.id;
  const code = `${getMovieCode()}`;
  const url2 = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=videos`;

  try {
    const response2 = await fetch(url2);
    const movie2 = await response2.json();
    const trailers = movie2.videos.results.filter(
      (video) => video.type === "Trailer",
    );

    if (trailers.length > 0) {
      const trailerUrl = `https://www.youtube.com/watch?v=${trailers[0].key}`;
      trailerButton = createTrailerButton(trailerUrl);
      detailsContainer.appendChild(trailerButton);
    }

    updateBrowserURL(movie.title);
  } catch (error) {
    document.getElementById("movie-details-container").innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Movie details not found - Try again with a different movie</h2>
            </div>`;
    console.log("Error fetching movie details:", error);
  }

  setTimeout(() => {
    document.getElementById("rating-fill").style.width = `${ratingPercentage}%`;
  }, 100);

  hideSpinner();
}

function handleRatingClick() {
  const ratingFill = document.getElementById("rating-fill");

  ratingFill.style.transition = "none";
  ratingFill.style.width = "0";

  setTimeout(() => {
    ratingFill.style.transition = "width 1s ease-in-out";
    ratingFill.style.width = `${globalRatingPercentage}%`;
  }, 50);
}

function createImdbRatingCircle(imdbRating, imdbId) {
  if (imdbRating === "N/A" || imdbRating === null || imdbRating === undefined) {
    imdbRating = "N/A";
  } else {
    imdbRating = parseFloat(imdbRating);
    if (!isNaN(imdbRating)) {
      imdbRating = imdbRating.toFixed(1);
    } else {
      imdbRating = "N/A";
    }
  }

  let circleContainer = document.getElementById("imdbRatingCircleContainer");
  if (!circleContainer) {
    circleContainer = document.createElement("div");
    circleContainer.id = "imdbRatingCircleContainer";
    circleContainer.className = "progress-container";
    const imdbLink = `${imdbId}`;
    circleContainer.innerHTML = `
            <a href="${imdbLink}" target="_blank" style="text-decoration: none; color: inherit;">
                <div style="margin-top: 0; font-size: 2.2rem; font-weight: bold" id="rating-header" class="rating-header" title="Click to view on IMDb">IMDb Rating</div>
            </a>
            <svg class="progress-ring" width="100" height="100" onclick="retriggerAnimation(${imdbRating})" style="cursor: pointer">
                <circle class="progress-ring__circle" stroke="white" stroke-width="10" fill="transparent" r="40" cx="50" cy="50" />
                <circle class="progress-ring__progress" r="40" cx="50" cy="50" />
                <text id="imdbRatingText" class="circle-text" x="50" y="52" text-anchor="middle" fill="yellow" style="font-weight: bold; font-size: 25px">${imdbRating}</text>
            </svg>
        `;

    if (imdbRating === "N/A") {
      circleContainer.innerHTML += `<p style="color: white; margin-top: 10px;">Rating information currently unavailable</p>`;
    }

    document.getElementById("movie-description").appendChild(circleContainer);
  } else {
    const text = document.getElementById("imdbRatingText");
    text.textContent = `${imdbRating}`;
  }

  const circle = circleContainer.querySelector(".progress-ring__progress");
  const text = document.getElementById("imdbRatingText");
  setProgress(circle, text, imdbRating);
}

function setProgress(circle, text, rating) {
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;

  circle.style.transition = "none";
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  circle.getBoundingClientRect();

  setTimeout(() => {
    const offset = circumference - (rating / 10) * circumference;
    circle.style.transition =
      "stroke-dashoffset 0.6s ease-out, stroke 0.6s ease";
    circle.style.strokeDashoffset = offset;
    circle.style.setProperty(
      "--progress-color",
      rating <= 5 ? "#FF0000" : rating >= 7.5 ? "#4CAF50" : "#2196F3",
    );
    text.textContent = `${rating}`;
  }, 10);
}

function retriggerAnimation(imdbRating) {
  const circle = document.querySelector(".progress-ring__progress");
  const text = document.getElementById("imdbRatingText");
  setProgress(circle, text, imdbRating);
}

function getSavedTextColor() {
  return localStorage.getItem("textColor") || "white";
}

function handleKeywordClick(keyword) {
  localStorage.setItem("searchQuery", keyword);
  window.location.href = "search.html";
}

function handleActorClick(actorId, actorName) {
  selectActorId(actorId, actorName);
}

function handleDirectorClick(directorId, directorName) {
  localStorage.setItem("selectedDirectorId", directorId);
  document.title = `${directorName} - Director's Details`;
  updateUniqueDirectorsViewed(directorId);
  updateDirectorVisitCount(directorId, directorName);
  window.location.href = "director-details.html";
}

function selectActorId(actorId, actorName) {
  const actorVisits = JSON.parse(localStorage.getItem("actorVisits")) || {};
  const uniqueActorsViewed =
    JSON.parse(localStorage.getItem("uniqueActorsViewed")) || [];

  if (!uniqueActorsViewed.includes(actorId)) {
    uniqueActorsViewed.push(actorId);
    localStorage.setItem(
      "uniqueActorsViewed",
      JSON.stringify(uniqueActorsViewed),
    );
  }

  if (actorVisits[actorId]) {
    actorVisits[actorId].count++;
  } else {
    actorVisits[actorId] = { count: 1, name: actorName };
  }

  localStorage.setItem("actorVisits", JSON.stringify(actorVisits));
  localStorage.setItem("selectedActorId", actorId);
  window.location.href = "actor-details.html";
}

function handleCompanyClick(companyId, companyName) {
  localStorage.setItem("selectedCompanyId", companyId);
  document.title = `${companyName} - Company Details`;
  window.location.href = "company-details.html";
  updateUniqueCompaniesViewed(companyId);
}

function handleSimilarMovieClick(movieId, movieTitle) {
  localStorage.setItem("selectedMovieId", movieId);
  document.title = `${movieTitle} - Movie Details`;
  window.location.href = "movie-details.html";
  updateMovieVisitCount(movieId, movieTitle);
}

function updateMoviesFavorited(movieId) {
  let favoritedMovies =
    JSON.parse(localStorage.getItem("moviesFavorited")) || [];
  if (!favoritedMovies.includes(movieId)) {
    favoritedMovies.push(movieId);
    localStorage.setItem("moviesFavorited", JSON.stringify(favoritedMovies));
  }
}

function getMovieCode2() {
  const codeOfMovie = "MmJhOGU1MzY=";
  return atob(codeOfMovie);
}

function getMovieName() {
  const moviename = "YXBpa2V5PQ==";
  return atob(moviename);
}

function getMovieActor() {
  const actor = "d3d3Lm9tZGJhcGkuY29t";
  return atob(actor);
}

function updateAverageMovieRating(movieId, newRating) {
  const savedRatings = JSON.parse(localStorage.getItem("movieRatings")) || {};

  savedRatings[movieId] = newRating;
  localStorage.setItem("movieRatings", JSON.stringify(savedRatings));

  let totalRating = 0;
  let totalMoviesRated = 0;

  for (let id in savedRatings) {
    totalRating += parseFloat(savedRatings[id]);
    totalMoviesRated++;
  }
  let averageRating = totalMoviesRated > 0 ? totalRating / totalMoviesRated : 0;
  localStorage.setItem(
    "averageMovieRating",
    averageRating.toFixed(1).toString(),
  );
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
      localStorage.setItem("selectedMovieId", randomMovie.id);
      window.location.href = "movie-details.html";
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    fallbackMovieSelection();
  }
}

function updateUniqueActorsViewed(actorId) {
  let viewedActors =
    JSON.parse(localStorage.getItem("uniqueActorsViewed")) || [];
  if (!viewedActors.includes(actorId)) {
    viewedActors.push(actorId);
    localStorage.setItem("uniqueActorsViewed", JSON.stringify(viewedActors));
  }
}

function updateUniqueCompaniesViewed(companyId) {
  let viewedCompanies =
    JSON.parse(localStorage.getItem("uniqueCompaniesViewed")) || [];
  if (!viewedCompanies.includes(companyId)) {
    viewedCompanies.push(companyId);
    localStorage.setItem(
      "uniqueCompaniesViewed",
      JSON.stringify(viewedCompanies),
    );
  }
}

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385,
    27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424,
    98,
  ];
  const randomFallbackMovie =
    fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
  localStorage.setItem("selectedMovieId", randomFallbackMovie);
  window.location.href = "movie-details.html";
}

function getMovieVerseData(input) {
  return String.fromCharCode(
    97,
    112,
    105,
    46,
    116,
    104,
    101,
    109,
    111,
    118,
    105,
    101,
    100,
    98,
    46,
    111,
    114,
    103,
  );
}

function applySettings() {
  const savedBg = localStorage.getItem("backgroundImage");
  const savedTextColor = localStorage.getItem("textColor");
  const savedFontSize = localStorage.getItem("fontSize");

  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
  }
  if (savedTextColor) {
    applyTextColor(savedTextColor);
  }
  if (savedFontSize) {
    const size =
      savedFontSize === "small"
        ? "12px"
        : savedFontSize === "medium"
          ? "16px"
          : "20px";
    document.body.style.fontSize = size;
  }
}

function applyTextColor(color) {
  document
    .querySelectorAll(
      "h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li",
    )
    .forEach((element) => {
      element.style.color = color;
    });
}
