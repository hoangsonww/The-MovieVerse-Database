const movieCode = {
  part1: "YzVhMjBjODY=",
  part2: "MWFjZjdiYjg=",
  part3: "ZDllOTg3ZGNjN2YxYjU1OA==",
};

let currentIndex = sessionStorage.getItem("currentIndex")
  ? parseInt(sessionStorage.getItem("currentIndex"))
  : 0;

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

function scrollToKeywordsSection() {
  const keywordsSection = document.getElementById("keywords-section");
  if (keywordsSection) {
    keywordsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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

  if (!movieVisits[movieId]) {
    movieVisits[movieId] = { count: 0, title: movieTitle };
  }
  movieVisits[movieId].count += 1;
  localStorage.setItem("movieVisits", JSON.stringify(movieVisits));
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

function setStarRating(rating) {
  const stars = document.querySelectorAll(".rating .star");
  stars.forEach((star) => {
    star.style.color = star.dataset.value > rating ? "white" : "gold";
  });

  document.getElementById("rating-value").textContent = `${rating}.0/5.0`;
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

document.querySelectorAll(".rating .star").forEach((star) => {
  star.addEventListener("mouseover", (e) => {
    setStarRating(e.target.dataset.value);
  });

  star.addEventListener("mouseout", () => {
    // Get tvSeriesId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tvSeriesId = urlParams.get("tvSeriesId");

    const savedRatings =
      JSON.parse(localStorage.getItem("tvSeriesRatings")) || {};
    const tvSeriesRating = tvSeriesId ? savedRatings[tvSeriesId] || 0 : 0;
    setStarRating(tvSeriesRating);
  });

  star.addEventListener("click", (e) => {
    // Get tvSeriesId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tvSeriesId = urlParams.get("tvSeriesId");

    if (!tvSeriesId) return;

    const rating = e.target.dataset.value;
    const savedRatings =
      JSON.parse(localStorage.getItem("tvSeriesRatings")) || {};

    savedRatings[tvSeriesId] = rating;
    localStorage.setItem("tvSeriesRatings", JSON.stringify(savedRatings));

    setStarRating(rating);
    window.location.reload();
  });
});

document.getElementById("clear-search-btn").addEventListener("click", () => {
  location.reload();
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
  updateSignInButtonState();
  currentIndex = 0;
  document
    .getElementById("googleSignInBtn")
    .addEventListener("click", handleSignInOut);
});

document.addEventListener("DOMContentLoaded", function () {
  applySettings();
});

const tvCode = `${getMovieCode()}`;

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

async function fetchTvDetails(tvSeriesId) {
  showSpinner();
  const baseUrl = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}`;
  const urlWithAppend = `${baseUrl}?${generateMovieNames()}${tvCode}&append_to_response=credits,keywords,similar,videos,external_ids`;

  try {
    // Fetch TV details first
    const tvDetailsPromise = fetch(urlWithAppend).then((response) => {
      if (!response.ok) throw new Error("Failed to fetch TV series details");
      return response.json();
    });

    const tvSeriesDetails = await tvDetailsPromise;
    const imdbId = tvSeriesDetails.external_ids?.imdb_id;

    // Start loading page with basic info immediately
    populateTvSeriesDetails(tvSeriesDetails, null, null);

    // Load dashboard and timeline in parallel, not sequentially
    const dashboardPromise = displayTVStatsDashboard(tvSeriesDetails);
    const timelinePromise = fetchSeasonsTimeline(
      tvSeriesId,
      tvSeriesDetails.name || tvSeriesDetails.original_name,
    );

    // Fetch IMDB rating in background and update when ready
    if (imdbId) {
      fetchTVRatings(imdbId)
        .then((data) => {
          const imdbRating =
            data !== "IMDb rating" && data?.imdbRating
              ? data.imdbRating
              : "View on IMDb";
          const ratingElement = document.getElementById("ratingImdb");
          if (ratingElement) {
            ratingElement.textContent = imdbRating;
          }
        })
        .catch(() => {
          // Silently fail for IMDB rating
        });
    }

    // Wait for dashboard and timeline to complete
    await Promise.all([dashboardPromise, timelinePromise]);
  } catch (error) {
    document.getElementById("movie-details-container").innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>TV series details currently unavailable - please try again</h2>
            </div>`;
    console.log("Error fetching TV series details:", error);
  } finally {
    hideSpinner();
  }
}

async function fetchTVRatings(imdbId) {
  // Remove spinner here to avoid multiple spinners
  if (!imdbId) {
    return "IMDb rating";
  }

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

  async function tryFetch(req, timeout = 5000) {
    const url = `${baseURL}${req}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), timeout);
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("API limit reached or other error");
          return response.json();
        })
        .then((data) => {
          clearTimeout(timer);
          if (!data || data.Error) throw new Error("Data fetch error");
          resolve(data);
        })
        .catch(() => {
          clearTimeout(timer);
          resolve(null);
        });
    });
  }

  // Try only first 3 API keys initially for faster loading
  const firstBatch = req.slice(0, 3).map((key) => tryFetch(key, 3000));
  const firstResponses = await Promise.all(firstBatch);
  let data = firstResponses.find((response) => response !== null);

  // If first batch fails, try remaining keys in background
  if (!data && req.length > 3) {
    const remainingBatch = req.slice(3).map((key) => tryFetch(key, 3000));
    const remainingResponses = await Promise.all(remainingBatch);
    data = remainingResponses.find((response) => response !== null);
  }

  return data && data.imdbRating ? data : "View on IMDb";
}

function getLanguageName(code) {
  const language = twoLetterLangCodes.find((lang) => lang.code === code);
  return language ? language.name : "Unknown Language";
}

function getCountryName(code) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(code);
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

let globalRatingPercentage = 0;

async function populateTvSeriesDetails(tvSeries, imdbRating, rated) {
  const title = tvSeries.name || "Title not available";
  document.getElementById("movie-title").textContent = title;
  document.title = tvSeries.name + " - TV Series Details";

  async function getInitialPoster(tvSeriesId) {
    const response = await fetch(
      `https://${getMovieVerseData()}/3/tv/${tvSeriesId}?${generateMovieNames()}${getMovieCode()}`,
    );
    const data = await response.json();
    return data.poster_path;
  }

  async function getAdditionalPosters(tvSeriesId) {
    const response = await fetch(
      `https://${getMovieVerseData()}/3/tv/${tvSeriesId}/images?${generateMovieNames()}${getMovieCode()}`,
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

  const tvSeriesImage = document.getElementById("movie-image");
  const tvSeriesId = tvSeries.id;

  // Load initial poster immediately if available
  if (tvSeries.poster_path) {
    tvSeriesImage.src = `https://image.tmdb.org/t/p/w780${tvSeries.poster_path}`;
    tvSeriesImage.alt = `Poster of ${tvSeries.name || tvSeries.title}`;
    tvSeriesImage.loading = "eager"; // Load immediately for main image
    tvSeriesImage.style.transition =
      "transform 0.3s ease-in-out, opacity 1s ease-in-out";
    tvSeriesImage.style.opacity = "1";

    // Load additional posters in background for rotation
    setTimeout(() => {
      getAdditionalPosters(tvSeriesId)
        .then((additionalPosters) => {
          if (additionalPosters && additionalPosters.length > 0) {
            let allPosters = [tvSeries.poster_path, ...additionalPosters];
            allPosters = allPosters
              .sort(() => 0.5 - Math.random())
              .slice(0, 10);
            rotateImages(tvSeriesImage, allPosters);
          }
        })
        .catch((err) => console.log("Failed to load additional posters:", err));
    }, 2000); // Delay poster rotation to prioritize initial load
  } else {
    const noImageTitle = document.createElement("h2");
    noImageTitle.textContent = "TV Show Image Not Available";
    noImageTitle.style.textAlign = "center";

    if (tvSeriesImage.parentNode) {
      tvSeriesImage.parentNode.replaceChild(noImageTitle, tvSeriesImage);
    } else {
      document.body.appendChild(noImageTitle);
    }
  }

  // Initialize rating details first, before using in template
  const genres =
    tvSeries.genres && tvSeries.genres.length
      ? tvSeries.genres.map((genre) => genre.name).join(", ")
      : "Genres not available";
  const ratingDetails = getRatingDetails(rated);
  const voteAverage = tvSeries.vote_average
    ? tvSeries.vote_average.toFixed(1)
    : "N/A";
  const voteCount = tvSeries.vote_count ? tvSeries.vote_count : "0";
  const scaledRating = (tvSeries.vote_average / 2).toFixed(1);
  const ratingPercentage = (scaledRating / 5) * 100;
  globalRatingPercentage = ratingPercentage;

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

  // Start with enhanced dashboard-style layout
  let detailsHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0;">

      <!-- Overview Card -->
      <div style="grid-column: 1 / -1; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 18px; display: flex; align-items: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Overview
        </h3>
        <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.9); font-size: 14px;">${tvSeries.overview || "Overview not available."}</p>
        ${tvSeries.tagline ? `<p style="margin: 15px 0 0 0; font-style: italic; color: rgba(255,255,255,0.7); font-size: 13px;">"${tvSeries.tagline}"</p>` : ""}
      </div>

      <!-- Series Info Card -->
      <div style="background: linear-gradient(135deg, rgba(115,120,197,0.1) 0%, rgba(115,120,197,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(115,120,197,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #7378c5; font-size: 16px;">Series Information</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Original Title</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${tvSeries.original_name || tvSeries.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Type</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${tvSeries.type || "TV Series"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Status</span>
            <span style="color: ${tvSeries.status === "Ended" ? "#ff6b6b" : "#51cf66"}; font-size: 13px; font-weight: 600;">${tvSeries.status || "Unknown"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">In Production</span>
            <span style="color: ${tvSeries.in_production ? "#51cf66" : "#ff6b6b"}; font-size: 13px; font-weight: 600;">${tvSeries.in_production ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      <!-- Air Dates Card -->
      <div style="background: linear-gradient(135deg, rgba(81,207,102,0.1) 0%, rgba(81,207,102,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(81,207,102,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #51cf66; font-size: 16px;">Air Dates</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">First Air Date</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${tvSeries.first_air_date ? new Date(tvSeries.first_air_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Last Air Date</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${tvSeries.last_air_date ? new Date(tvSeries.last_air_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</span>
          </div>
          ${
            tvSeries.next_episode_to_air
              ? `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Next Episode</span>
            <span style="color: #ffd93d; font-size: 13px; font-weight: 500;">${new Date(tvSeries.next_episode_to_air.air_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>`
              : ""
          }
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.6); font-size: 12px;">Episode Runtime</span>
            <span style="color: #fff; font-size: 13px; font-weight: 500;">${tvSeries.episode_run_time && tvSeries.episode_run_time.length > 0 ? `${tvSeries.episode_run_time[0]} min` : "Varies"}</span>
          </div>
        </div>
      </div>

      <!-- Genres & Categories Card -->
      <div style="background: linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,107,107,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,107,107,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #ff6b6b; font-size: 16px;">Genres & Categories</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${
            tvSeries.genres && tvSeries.genres.length
              ? tvSeries.genres
                  .map(
                    (genre) =>
                      `<span style="background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 15px; font-size: 12px; color: #fff; border: 1px solid rgba(255,255,255,0.2);">${genre.name}</span>`,
                  )
                  .join("")
              : '<span style="color: rgba(255,255,255,0.6); font-size: 13px;">No genres available</span>'
          }
        </div>
        ${
          rated
            ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: ${ratingDetails.color}; color: ${ratingDetails.color === "white" || ratingDetails.color === "yellow" ? "#000" : "#fff"}; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">${rated}</span>
            <span style="color: rgba(255,255,255,0.7); font-size: 12px;">${ratingDetails.description.substring(3)}</span>
          </div>
        </div>`
            : ""
        }
      </div>

      <!-- Networks Card -->
      <div style="background: linear-gradient(135deg, rgba(255,217,61,0.1) 0%, rgba(255,217,61,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,217,61,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #ffd93d; font-size: 16px;">Networks & Distribution</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${
            tvSeries.networks && tvSeries.networks.length
              ? tvSeries.networks
                  .map(
                    (network) => `
          <div style="display: flex; align-items: center; gap: 10px;">
            ${network.logo_path ? `<img src="${IMGPATH}${network.logo_path}" style="height: 20px; width: auto; background: white; padding: 2px 5px; border-radius: 4px;" alt="${network.name}">` : ""}
            <span style="color: #fff; font-size: 13px;">${network.name}</span>
          </div>`,
                  )
                  .join("")
              : '<span style="color: rgba(255,255,255,0.6); font-size: 13px;">No network information</span>'
          }
        </div>
      </div>

      <!-- Seasons & Episodes Card -->
      <div style="background: linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(33,150,243,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #2196F3; font-size: 16px;">Seasons & Episodes</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <div style="font-size: 28px; font-weight: bold; color: #2196F3;">${tvSeries.number_of_seasons || 0}</div>
            <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 5px;">Seasons</div>
          </div>
          <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <div style="font-size: 28px; font-weight: bold; color: #2196F3;">${tvSeries.number_of_episodes || 0}</div>
            <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 5px;">Episodes</div>
          </div>
        </div>
      </div>

      <!-- Languages & Countries Card -->
      <div style="background: linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(156,39,176,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #9c27b0; font-size: 16px;">Languages & Origins</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <span style="color: rgba(255,255,255,0.6); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Original Language</span>
            <div style="color: #fff; font-size: 14px; font-weight: 500; margin-top: 4px;">${getLanguageName(tvSeries.original_language)}</div>
          </div>
          ${
            tvSeries.spoken_languages && tvSeries.spoken_languages.length > 0
              ? `
<div>
  <span style="color: rgba(255,255,255,0.6); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Available Languages</span>
  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; justify-content: center; align-items: center;">
    ${tvSeries.spoken_languages
      .map(
        (lang) =>
          `<span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 8px; font-size: 11px; color: #fff;">${lang.english_name || lang.name}</span>`,
      )
      .join("")}
  </div>
</div>`
              : ""
          }
          ${
            tvSeries.origin_country && tvSeries.origin_country.length > 0
              ? `
          <div>
            <span style="color: rgba(255,255,255,0.6); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Origin Countries</span>
            <div style="color: #fff; font-size: 14px; font-weight: 500; margin-top: 4px;">${tvSeries.origin_country.map((code) => getCountryName(code)).join(", ")}</div>
          </div>`
              : ""
          }
        </div>
      </div>

      <!-- Production Companies Card -->
      ${
        tvSeries.production_companies &&
        tvSeries.production_companies.length > 0
          ? `
      <div style="background: linear-gradient(135deg, rgba(0,188,212,0.1) 0%, rgba(0,188,212,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(0,188,212,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #00bcd4; font-size: 16px;">Production Companies</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${tvSeries.production_companies
            .slice(0, 4)
            .map(
              (company) => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            ${
              company.logo_path
                ? `<img src="${IMGPATH}${company.logo_path}" style="height: 25px; width: auto; background: white; padding: 3px; border-radius: 4px;" alt="${company.name}">`
                : `<div style="width: 25px; height: 25px; background: rgba(255,255,255,0.1); border-radius: 4px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 10px; color: rgba(255,255,255,0.4);">N/A</span></div>`
            }
            <div style="flex: 1;">
              <div style="color: #fff; font-size: 14px; font-weight: 500;">${company.name}</div>
              ${company.origin_country ? `<div style="color: rgba(255,255,255,0.5); font-size: 12px;">${getCountryName(company.origin_country)}</div>` : ""}
            </div>
          </div>`,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Keywords Card -->
      ${
        tvSeries.keywords &&
        tvSeries.keywords.results &&
        tvSeries.keywords.results.length > 0
          ? `
      <div style="background: linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,152,0,0.3); cursor: pointer;" onclick="scrollToKeywordsSection()">
        <h3 style="margin: 0 0 15px 0; color: #ff9800; font-size: 16px;">Keywords</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${tvSeries.keywords.results
            .slice(0, 10)
            .map(
              (keyword) =>
                `<span style="background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 15px; font-size: 11px; color: #fff; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,152,0,0.2)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'">${keyword.name}</span>`,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- External Links Card -->
      <div style="background: linear-gradient(135deg, rgba(139,195,74,0.1) 0%, rgba(139,195,74,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; border: 1px solid rgba(139,195,74,0.3);">
        <h3 style="margin: 0 0 15px 0; color: #8bc34a; font-size: 16px;">External Links</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${
            tvSeries.homepage
              ? `
          <a href="${tvSeries.homepage}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139,195,74,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span style="color: #fff; font-size: 13px;">Official Website</span>
          </a>`
              : ""
          }
          ${
            tvSeries.external_ids && tvSeries.external_ids.imdb_id
              ? `
          <a href="https://www.imdb.com/title/${tvSeries.external_ids.imdb_id}/" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139,195,74,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5c518">
              <rect width="24" height="24" rx="4" fill="#f5c518"/>
              <text x="12" y="16" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="black">IMDb</text>
            </svg>
            <span style="color: #fff; font-size: 13px;">View on IMDb</span>
          </a>`
              : ""
          }
          ${
            tvSeries.external_ids && tvSeries.external_ids.facebook_id
              ? `
          <a href="https://www.facebook.com/${tvSeries.external_ids.facebook_id}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139,195,74,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span style="color: #fff; font-size: 13px;">Facebook Page</span>
          </a>`
              : ""
          }
          ${
            tvSeries.external_ids && tvSeries.external_ids.twitter_id
              ? `
          <a href="https://twitter.com/${tvSeries.external_ids.twitter_id}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139,195,74,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span style="color: #fff; font-size: 13px;">Twitter/X</span>
          </a>`
              : ""
          }
          ${
            tvSeries.external_ids && tvSeries.external_ids.instagram_id
              ? `
          <a href="https://www.instagram.com/${tvSeries.external_ids.instagram_id}" target="_blank" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139,195,74,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#f58529"/>
                  <stop offset="50%" style="stop-color:#dd2a7b"/>
                  <stop offset="100%" style="stop-color:#8134af"/>
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
            <span style="color: #fff; font-size: 13px;">Instagram</span>
          </a>`
              : ""
          }
        </div>
      </div>

    </div>
  `;

  // Add the Ratings Card to the detailsHTML
  detailsHTML += `
      <div style="grid-column: 1 / -1; background: linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,193,7,0.05) 100%); backdrop-filter: blur(10px); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,193,7,0.3);">
        <h3 style="margin: 0 0 20px 0; color: #ffc107; font-size: 18px;">Ratings & Reviews</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">

          <!-- MovieVerse Rating -->
          <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">MovieVerse Rating</span>
              <span style="color: #ffc107; font-size: 20px; font-weight: bold;">${tvSeries.vote_average ? (tvSeries.vote_average / 2).toFixed(1) : "N/A"}/5.0</span>
            </div>
            <div class="rating-container" style="color: inherit;">
              <div class="rating-bar" onclick="handleRatingClick()" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; cursor: pointer;">
                <div class="rating-fill" style="width: 0; background: linear-gradient(90deg, #ffc107, #ff9800); height: 100%; transition: width 2s ease;" id="rating-fill"></div>
              </div>
              <span style="color: rgba(255,255,255,0.5); font-size: 12px;">${tvSeries.vote_count || 0} votes</span>
            </div>
          </div>

          <!-- TMDB Rating -->
          <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">TMDB Rating</span>
              <a href="https://www.themoviedb.org/tv/${tvSeries.id}" target="_blank" style="color: #4fc3f7; font-size: 20px; font-weight: bold; text-decoration: none;">${tvSeries.vote_average ? tvSeries.vote_average.toFixed(1) : "N/A"}/10</a>
            </div>
            <div style="background: rgba(79,195,247,0.2); border-radius: 20px; padding: 10px; text-align: center;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">Based on community ratings</span>
            </div>
          </div>

          <!-- IMDb Rating -->
          ${
            tvSeries.external_ids && tvSeries.external_ids.imdb_id
              ? `
          <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">IMDb Rating</span>
              <a href="https://www.imdb.com/title/${tvSeries.external_ids.imdb_id}/" target="_blank" style="color: #f5c518; font-size: 20px; font-weight: bold; text-decoration: none;" id="ratingImdb">${imdbRating || "View on IMDb"}</a>
            </div>
            <div style="background: rgba(245,197,24,0.2); border-radius: 20px; padding: 10px; text-align: center;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">Internet Movie Database</span>
            </div>
          </div>`
              : ""
          }

          <!-- Popularity Score -->
          <div style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
              <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">Popularity</span>
              <span style="color: ${tvSeries.popularity > 50 ? "#51cf66" : "#ff6b6b"}; font-size: 20px; font-weight: bold;">${tvSeries.popularity ? tvSeries.popularity.toFixed(1) : "N/A"}</span>
            </div>
            <div style="background: ${tvSeries.popularity > 50 ? "rgba(81,207,102,0.2)" : "rgba(255,107,107,0.2)"}; border-radius: 20px; padding: 10px; text-align: center;">
              <span style="color: rgba(255,255,255,0.6); font-size: 11px;">This series is ${tvSeries.popularity > 50 ? "trending" : "not trending"}</span>
            </div>
          </div>
        </div>
      </div>
  `;

  // All ratings and basic info are now in the dashboard cards above

  if (tvSeries.last_episode_to_air) {
    const lastEpisode = tvSeries.last_episode_to_air;
    const airDate = lastEpisode.air_date
      ? new Date(lastEpisode.air_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date";

    detailsHTML += `
      <div class="last-episode-card" style="background: rgba(255,255,255,0.05); border-radius: 15px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); margin-top: 20px; font-size: 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h3 style="margin: 0; color: #fff; font-size: 1rem; display: flex; align-items: center;">
            <i class="fas fa-tv" style="color: #ff8623; margin-right: 8px;"></i>
            Last Episode
          </h3>
          <span style="color: rgba(255,255,255,0.6); font-size: 1rem;">${airDate}</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
          ${
            lastEpisode.still_path
              ? `<img src="${IMGPATH + lastEpisode.still_path}" alt="${lastEpisode.name || "Episode"} Still Image" id="last-episode-image" style="border-radius: 12px; max-width: 320px; width: 100%; height: auto; object-fit: contain;" />`
              : ""
          }
          <div style="flex: 1; min-width: 240px;">
            <div style="color: #fff; font-weight: 600; margin-bottom: 6px;">${lastEpisode.name || "Title not available"}</div>
            <div style="color: #a0a0a0; margin-bottom: 10px;">S${lastEpisode.season_number ?? "?"}E${lastEpisode.episode_number ?? "?"} • ${airDate}</div>
            <p style="margin: 0; color: #ddd;">${lastEpisode.overview || "Overview not available."}</p>
          </div>
        </div>
      </div>`;
  }

  if (tvSeries.created_by && tvSeries.created_by.length > 0) {
    const creatorsSection = document.createElement("div");
    creatorsSection.classList.add("creators-section");

    // Creators Title
    const creatorsTitle = document.createElement("p");
    creatorsTitle.innerHTML = "<strong>Creators:</strong>";
    creatorsTitle.style.color = "inherit";
    creatorsTitle.style.fontSize = "inherit";
    creatorsSection.appendChild(creatorsTitle);

    const creatorsList = document.createElement("div");
    creatorsList.classList.add("creators-list");
    creatorsList.style.display = "flex";
    creatorsList.style.flexWrap = "wrap";
    creatorsList.style.justifyContent = "center";
    creatorsList.style.gap = "2px";

    tvSeries.created_by.forEach((creator) => {
      const creatorLink = document.createElement("a");
      creatorLink.classList.add("creator-link");
      creatorLink.href = "javascript:void(0);";
      creatorLink.style.color = "inherit";
      creatorLink.style.fontSize = "inherit";
      creatorLink.setAttribute(
        "onclick",
        `handleCreatorClick(${creator.id}, '${creator.name.replace(/'/g, "\\'")}');`,
      );

      const creatorItem = document.createElement("div");
      creatorItem.classList.add("creator-item");

      const creatorImage = document.createElement("img");
      creatorImage.classList.add("creator-image");

      if (creator.profile_path) {
        creatorImage.src = IMGPATH + creator.profile_path;
        creatorImage.alt = `${creator.name} Profile Picture`;
      } else {
        creatorImage.alt = "Image Not Available";
        creatorImage.style.objectFit = "cover";
        creatorImage.src = "https://movie-verse.com/images/user-default.png";
        creatorImage.style.filter = "grayscale(100%)";
      }

      creatorItem.appendChild(creatorImage);

      const creatorDetails = document.createElement("div");
      creatorDetails.classList.add("creator-details");

      // Creator Name
      const creatorName = document.createElement("p");
      creatorName.classList.add("creator-name");
      creatorName.textContent = creator.name;
      creatorName.style.color = "inherit";
      creatorDetails.appendChild(creatorName);

      creatorItem.appendChild(creatorDetails);
      creatorLink.appendChild(creatorItem);
      creatorsList.appendChild(creatorLink);
    });

    creatorsSection.appendChild(creatorsList);
    detailsHTML += creatorsSection.outerHTML;
  } else {
    const noCreatorsElement = document.createElement("p");
    noCreatorsElement.innerHTML = `<strong>Creators:</strong> Information not available`;
    noCreatorsElement.style.color = "inherit";
    noCreatorsElement.style.fontSize = "inherit";
    detailsHTML += noCreatorsElement.outerHTML;
  }

  if (
    tvSeries.credits &&
    tvSeries.credits.cast &&
    tvSeries.credits.cast.length > 0
  ) {
    const castSection = document.createElement("div");
    castSection.classList.add("cast-section");

    // Cast Title
    const castTitle = document.createElement("p");
    castTitle.innerHTML = "<strong>Notable Cast:</strong>";
    castTitle.style.color = "inherit";
    castSection.appendChild(castTitle);

    const castList = document.createElement("div");
    castList.classList.add("cast-list");
    castList.style.display = "flex";
    castList.style.flexWrap = "wrap";
    castList.style.justifyContent = "center";
    castList.style.gap = "2px";

    tvSeries.credits.cast.slice(0, 12).forEach((castMember) => {
      const castMemberLink = document.createElement("a");
      castMemberLink.classList.add("cast-member-link");
      castMemberLink.href = "javascript:void(0);";
      castMemberLink.style.color = "inherit";
      castMemberLink.setAttribute(
        "onclick",
        `selectActorId(${castMember.id}, '${castMember.name.replace(/'/g, "\\'")}');`,
      );

      const castMemberItem = document.createElement("div");
      castMemberItem.classList.add("cast-member-item");

      const castMemberImage = document.createElement("img");
      castMemberImage.classList.add("cast-member-image");

      if (castMember.profile_path) {
        castMemberImage.src = IMGPATH + castMember.profile_path;
        castMemberImage.alt = `${castMember.name} Profile Picture`;
      } else {
        castMemberImage.alt = "Image Not Available";
        castMemberImage.style.objectFit = "cover";
        castMemberImage.src = "https://movie-verse.com/images/user-default.png";
        castMemberImage.style.filter = "grayscale(100%)";
      }

      castMemberItem.appendChild(castMemberImage);

      const castMemberDetails = document.createElement("div");
      castMemberDetails.classList.add("cast-member-details");

      // Cast Member Name
      const castMemberName = document.createElement("p");
      castMemberName.classList.add("cast-member-name");
      castMemberName.textContent = castMember.name;
      castMemberName.style.color = "inherit";
      castMemberDetails.appendChild(castMemberName);

      // Cast Member Role
      const castMemberRole = document.createElement("p");
      castMemberRole.classList.add("cast-member-role");
      castMemberRole.textContent = castMember.character
        ? `(as ${castMember.character})`
        : "";
      castMemberRole.style.fontStyle = "italic";
      castMemberRole.style.color = "inherit";
      castMemberDetails.appendChild(castMemberRole);

      castMemberItem.appendChild(castMemberDetails);
      castMemberLink.appendChild(castMemberItem);
      castList.appendChild(castMemberLink);
    });

    castSection.appendChild(castList);
    detailsHTML += castSection.outerHTML;
  } else {
    const noCastElement = document.createElement("p");
    noCastElement.innerHTML = `<strong>Cast:</strong> Information not available`;
    noCastElement.style.color = "inherit";
    detailsHTML += noCastElement.outerHTML;
  }

  if (
    tvSeries.similar &&
    tvSeries.similar.results &&
    tvSeries.similar.results.length > 0
  ) {
    const similarTvSeriesSection = document.createElement("div");
    similarTvSeriesSection.classList.add("similar-tv-series-section");

    // Similar TV Series Title
    const similarTvSeriesTitle = document.createElement("p");
    similarTvSeriesTitle.innerHTML = "<strong>Similar TV Series:</strong>";
    similarTvSeriesTitle.style.color = "inherit";
    similarTvSeriesSection.appendChild(similarTvSeriesTitle);

    const similarTvSeriesList = document.createElement("div");
    similarTvSeriesList.classList.add("similar-tv-series-list");
    similarTvSeriesList.style.display = "flex";
    similarTvSeriesList.style.flexWrap = "wrap";
    similarTvSeriesList.style.justifyContent = "center";
    similarTvSeriesList.style.gap = "10px";

    let similarTvSeries = tvSeries.similar.results.sort(
      (a, b) => b.popularity - a.popularity,
    );
    similarTvSeries = similarTvSeries.slice(0, 18);

    similarTvSeries.forEach((similarTv) => {
      const similarTvLink = document.createElement("a");
      similarTvLink.classList.add("similar-tv-link");
      similarTvLink.href = "javascript:void(0);";
      similarTvLink.style.color = "inherit";
      similarTvLink.setAttribute(
        "onclick",
        `selectTvSeriesId(${similarTv.id});`,
      );

      const similarTvItem = document.createElement("div");
      similarTvItem.classList.add("similar-tv-item");

      const similarTvImage = document.createElement("img");
      similarTvImage.classList.add("similar-tv-image");

      if (similarTv.poster_path) {
        similarTvImage.src = IMGPATH + similarTv.poster_path;
        similarTvImage.alt = `${similarTv.name} Poster`;
      } else {
        similarTvImage.alt = "Image Not Available";
        similarTvImage.src = "https://movie-verse.com/images/movie-default.jpg";
        similarTvImage.style.filter = "grayscale(100%)";
        similarTvImage.style.objectFit = "cover";
      }

      similarTvItem.appendChild(similarTvImage);

      const similarTvDetails = document.createElement("div");
      similarTvDetails.classList.add("similar-tv-details");

      // Similar TV Series Name
      const similarTvName = document.createElement("p");
      similarTvName.classList.add("similar-tv-name");
      similarTvName.style.color = "inherit";
      const tvNameWords = similarTv.name.split(" ");
      const truncatedTvName =
        tvNameWords.length > 5
          ? tvNameWords.slice(0, 5).join(" ") + " ..."
          : similarTv.name;
      similarTvName.textContent = truncatedTvName;

      similarTvDetails.appendChild(similarTvName);

      similarTvItem.appendChild(similarTvDetails);
      similarTvLink.appendChild(similarTvItem);
      similarTvSeriesList.appendChild(similarTvLink);
    });

    similarTvSeriesSection.appendChild(similarTvSeriesList);
    detailsHTML += similarTvSeriesSection.outerHTML;
  } else {
    const noSimilarTvSeriesElement = document.createElement("p");
    noSimilarTvSeriesElement.innerHTML = `<strong>Similar TV Series:</strong> Information not available`;
    noSimilarTvSeriesElement.style.color = "inherit";
    detailsHTML += noSimilarTvSeriesElement.outerHTML;
  }

  if (tvSeries.production_companies && tvSeries.production_companies.length) {
    const companiesSection = document.createElement("div");
    companiesSection.classList.add("companies-section");

    // Production Companies Title
    const companiesTitle = document.createElement("p");
    companiesTitle.innerHTML = "<strong>Production Companies:</strong>";
    companiesTitle.style.color = "inherit";
    companiesSection.appendChild(companiesTitle);

    const companiesList = document.createElement("div");
    companiesList.classList.add("companies-list");
    companiesList.style.display = "flex";
    companiesList.style.flexWrap = "wrap";
    companiesList.style.justifyContent = "center";
    companiesList.style.gap = "5px";

    let productionCompanies = tvSeries.production_companies.slice(0, 6);

    productionCompanies.forEach((company) => {
      const companyLink = document.createElement("a");
      companyLink.classList.add("company-link");
      companyLink.href = "javascript:void(0);";
      companyLink.style.color = "inherit";
      companyLink.setAttribute("onclick", `selectCompanyId(${company.id});`);

      const companyItem = document.createElement("div");
      companyItem.classList.add("company-item");

      const companyLogo = document.createElement("img");
      companyLogo.classList.add("company-logo");

      if (company.logo_path) {
        companyLogo.src = IMGPATH + company.logo_path;
        companyLogo.alt = `${company.name} Logo`;
        companyLogo.style.backgroundColor = "white";
      } else {
        companyLogo.alt = "Logo Not Available";
        companyLogo.src = "https://movie-verse.com/images/company-default.png";
        companyLogo.style.filter = "grayscale(100%)";
      }

      companyItem.appendChild(companyLogo);

      const companyDetails = document.createElement("div");
      companyDetails.classList.add("company-details");

      // Company Name
      const companyName = document.createElement("p");
      companyName.classList.add("company-name");
      companyName.textContent = company.name;
      companyName.style.color = "inherit";
      companyDetails.appendChild(companyName);

      companyItem.appendChild(companyDetails);
      companyLink.appendChild(companyItem);
      companiesList.appendChild(companyLink);
    });

    companiesSection.appendChild(companiesList);
    detailsHTML += companiesSection.outerHTML;
  } else {
    const noCompaniesElement = document.createElement("p");
    noCompaniesElement.innerHTML = `<strong>Production Companies:</strong> Information not available`;
    noCompaniesElement.style.color = "inherit";
    detailsHTML += noCompaniesElement.outerHTML;
  }

  const tvSeriesTitleEncoded = encodeURIComponent(title);
  const streamingProviders = await fetchTvSeriesStreamingLinks(tvSeries.id);
  const streamingHTML =
    streamingProviders.length > 0
      ? streamingProviders
          .map((provider) => {
            let providerLink = `https://www.google.com/search?q=watch+${tvSeriesTitleEncoded}+on+${encodeURIComponent(provider.provider_name)}`;
            switch (provider.provider_name.toLowerCase()) {
              case "netflix":
                providerLink = `https://www.netflix.com/search?q=${tvSeriesTitleEncoded}`;
                break;
              case "disney plus":
                providerLink = `https://www.disneyplus.com/search?q=${tvSeriesTitleEncoded}`;
                break;
              case "hbo max":
                providerLink = `https://www.hbomax.com/search?q=${tvSeriesTitleEncoded}`;
                break;
              case "hulu":
                providerLink = `https://www.hulu.com/search?q=${tvSeriesTitleEncoded}`;
                break;
              case "amazon prime video":
                providerLink = `https://www.amazon.com/s?k=${tvSeriesTitleEncoded}`;
                break;
              case "apple tv plus":
                providerLink = `https://tv.apple.com/search?term=${tvSeriesTitleEncoded}`;
                break;
              case "stan":
                providerLink = `https://www.stan.com.au/search?q=${tvSeriesTitleEncoded}`;
                break;
              case "player":
                providerLink = `https://player.pl/szukaj?search=${tvSeriesTitleEncoded}`;
                break;
            }

            return `<a href="${providerLink}" target="_blank" title="Watch on ${provider.provider_name}" style="display: inline-flex; align-items: flex-end; vertical-align: bottom; color: inherit;" class="streaming-logo">
                            <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name}" style="width: 50px; margin-left: 10px;">
                          </a>`;
          })
          .join("") +
        `<a href="https://www.justwatch.com/us/search?q=${tvSeriesTitleEncoded}" target="_blank" title="View more streaming options on JustWatch" class="streaming-logo" style="display: inline-flex; align-items: center; vertical-align: bottom; color: inherit;">
            <img src="../../images/justwatchlogo.webp" alt="JustWatch" style="width: 50px;">
          </a>`
      : "No streaming options available.";

  detailsHTML += `<p style="color: inherit;"><strong>Streaming Options:</strong> ${streamingHTML}</p>`;

  let keywordsHTML = tvSeries.keywords
    ? tvSeries.keywords.results
        .map(
          (kw) =>
            `<a class="keyword-link" href="javascript:void(0);" onclick="handleKeywordClick('${kw.name.replace(/'/g, "\\'")}')" title="Click to search for movies with the keyword '${kw.name}'" style="color: inherit;">${kw.name}</a>`,
        )
        .join(", ")
    : "None Available";

  if (
    tvSeries.keywords &&
    tvSeries.keywords.results &&
    tvSeries.keywords.results.length
  ) {
    detailsHTML += `<p id="keywords-section" style="color: inherit;"><strong>Keywords:</strong> ${keywordsHTML}</p>`;
  } else {
    detailsHTML += `<p id="keywords-section" style="color: inherit;"><strong>Keywords:</strong> None Available</p>`;
  }

  const mediaUrl = `https://${getMovieVerseData()}/3/tv/${tvSeries.id}/images?${generateMovieNames()}${getMovieCode()}`;
  const mediaResponse = await fetch(mediaUrl);
  const mediaData = await mediaResponse.json();
  const images = mediaData.backdrops;

  const detailsContainer = document.getElementById("movie-description");
  detailsContainer.style.fontSize = "inherit";

  let mediaContainer = document.getElementById("media-container");
  if (!mediaContainer) {
    mediaContainer = document.createElement("div");
    mediaContainer.id = "media-container";
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

  let mediaTitle = document.getElementById("media-title");
  if (!mediaTitle) {
    mediaTitle = document.createElement("p");
    mediaTitle.id = "media-title";
    mediaTitle.textContent = "Media:";
    mediaTitle.style = `
            font-weight: bold;
            align-self: start;
            margin-bottom: 5px;
        `;
  }

  let imageWrapper = document.getElementById("image-wrapper");
  if (!imageWrapper) {
    imageWrapper = document.createElement("div");
    imageWrapper.id = "image-wrapper";
    imageWrapper.style = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        `;
    mediaContainer.appendChild(imageWrapper);
  }

  let imageElement = document.getElementById("series-media-image");
  if (!imageElement) {
    imageElement = document.createElement("img");
    imageElement.id = "series-media-image";
    imageElement.style = `
            max-width: 100%;
            max-height: 210px;
            transition: opacity 0.5s ease-in-out;
            opacity: 1;
            border-radius: 16px;
            cursor: pointer;
        `;
    imageElement.loading = "lazy";
    imageWrapper.appendChild(imageElement);
  }

  if (images.length > 0) {
    imageElement.src = `https://image.tmdb.org/t/p/w780${images[currentIndex].file_path}`;
  }

  let modalOpen = false;

  imageElement.addEventListener("click", function () {
    let imageUrl = this.src.replace("w780", "w1280");
    modalOpen = true;
    const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <button id="prevModalButton" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background-color: #7378c5; color: white; border-radius: 8px; height: 30px; width: 30px; border: none; cursor: pointer; z-index: 11;"><i class="fas fa-arrow-left"></i></button>
                <img src="${imageUrl}" style="max-width: 80%; max-height: 95%; border-radius: 10px; cursor: default; transition: opacity 0.5s ease-in-out;" onclick="event.stopPropagation();" alt="Media Image"/>
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

  let prevButton = document.getElementById("prev-media-button");
  let nextButton = document.getElementById("next-media-button");
  if (!prevButton || !nextButton) {
    prevButton = document.createElement("button");
    nextButton = document.createElement("button");
    prevButton.id = "prev-media-button";
    nextButton.id = "next-media-button";
    prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';

    [prevButton, nextButton].forEach((button) => {
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
      button.onmouseover = () => (button.style.backgroundColor = "#ff8623");
      button.onmouseout = () => (button.style.backgroundColor = "#7378c5");
    });

    prevButton.style.left = "0";
    nextButton.style.right = "0";

    imageWrapper.appendChild(prevButton);
    imageWrapper.appendChild(nextButton);
  }

  prevButton.onclick = () => navigateMedia(images, imageElement, -1);
  nextButton.onclick = () => navigateMedia(images, imageElement, 1);

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

  if (window.innerWidth <= 767) {
    mediaContainer.style.width = "calc(100% - 40px)";
  }

  const movieDescription = document.getElementById("movie-description");
  movieDescription.style.opacity = "0"; // Start with hidden content

  // Set the new HTML content
  movieDescription.innerHTML = detailsHTML;

  // Apply fade-in animation
  movieDescription.style.animation = "fadeIn 1.5s ease-in-out";
  movieDescription.style.opacity = "1";
  document.getElementById("movie-description").appendChild(mediaTitle);
  document.getElementById("movie-description").appendChild(mediaContainer);

  // Defer rating bar animation to after page loads
  requestAnimationFrame(() => {
    setTimeout(() => {
      const ratingFill = document.getElementById("rating-fill");
      if (ratingFill) {
        ratingFill.style.width = `${globalRatingPercentage}%`;
      }
    }, 100);
  });

  const lastEpImg = document.getElementById("last-episode-image");
  if (lastEpImg) lastEpImg.addEventListener("click", function () {
      let imageUrl = this.src.replace("w780", "w1280");

      const modalHtml = `
            <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
                <img src="${imageUrl}" style="max-width: 80%; max-height: 80%; border-radius: 10px; cursor: default;" onclick="event.stopPropagation();" alt="Media Image"/>
                <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
            </div>
        `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("image-modal");
      const closeModalBtn = document.getElementById("removeBtn");

      closeModalBtn.onclick = function () {
        modal.remove();
      };

      modal.addEventListener("click", function (event) {
        if (event.target === this) {
          this.remove();
        }
      });
    });

  if (tvSeries.videos.results.find((video) => video.type === "Trailer")?.key) {
    const trailerKey = tvSeries.videos.results.find(
      (video) => video.type === "Trailer",
    )?.key;
    const trailerUrl = trailerKey
      ? `https://www.youtube.com/embed/${trailerKey}`
      : null;

    const trailerButton = document.createElement("button");
    trailerButton.textContent = "Watch Trailer";
    trailerButton.id = "trailer-button";
    trailerButton.style = `
    background-color: #7378c5;
    color: inherit;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
    font: inherit;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
`;

    // Add hover effect dynamically
    trailerButton.addEventListener("mouseover", () => {
      trailerButton.style.backgroundColor = "#ff8623";
    });

    trailerButton.addEventListener("mouseout", () => {
      trailerButton.style.backgroundColor = "#7378c5";
    });

    const iframeContainer = document.createElement("div");
    iframeContainer.id = "trailer-iframe-container";
    iframeContainer.style = `
            display: none;
            overflow: hidden;
            margin-top: 10px;
            max-height: 0;
            transition: max-height 0.5s ease-in-out;
            border: none;
            border-radius: 8px;
          `;

    trailerButton.addEventListener("click", () => {
      if (iframeContainer.style.display === "none") {
        if (trailerUrl) {
          const iframe = document.createElement("iframe");
          iframe.src = trailerUrl;
          iframe.title = "YouTube video player";
          iframe.frameborder = "0";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.allowFullscreen = true;
          iframeContainer.appendChild(iframe);
          iframe.style.borderRadius = "16px";
          iframe.style.border = "none";
          iframe.style.width = "400px";
          iframe.style.height = "315px";
          trailerButton.textContent = "Close Trailer";
        } else {
          iframeContainer.innerHTML = "<p>Trailer not available.</p>";
        }
        iframeContainer.style.display = "block";
        setTimeout(() => {
          iframeContainer.style.maxHeight = "350px";
        }, 10);
      } else {
        iframeContainer.style.maxHeight = "0";
        setTimeout(() => {
          iframeContainer.style.display = "none";
          iframeContainer.innerHTML = "";
          trailerButton.textContent = "Watch Trailer";
        }, 500);
      }
    });

    document.getElementById("movie-description").appendChild(trailerButton);
    document.getElementById("movie-description").appendChild(iframeContainer);
  }

  setTimeout(() => {
    document.getElementById("rating-fill").style.width = `${ratingPercentage}%`;
  }, 100);
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

async function fetchTvSeriesStreamingLinks(tvSeriesId) {
  const url = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}/watch/providers?${generateMovieNames()}${getMovieCode()}`;
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
    console.error("Error fetching TV series streaming links:", error);
    return [];
  }
}

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

function selectTvSeriesId(tvSeriesId) {
  // Navigate to TV details page with tvSeriesId as a query parameter
  window.location.href = `tv-details.html?tvSeriesId=${tvSeriesId}`;
}

function selectCompanyId(companyId) {
  localStorage.setItem("selectedCompanyId", companyId);
  window.location.href = "company-details.html";
}

function showSpinner() {
  document.getElementById("myModal").classList.add("modal-visible");
}

function hideSpinner() {
  document.getElementById("myModal").classList.remove("modal-visible");
}

function handleKeywordClick(keyword) {
  localStorage.setItem("searchQuery", keyword);
  window.location.href = "search.html";
}

function handleCreatorClick(creatorId, creatorName) {
  localStorage.setItem("selectedDirectorId", creatorId);
  document.title = `${creatorName} - Director's Details`;
  updateUniqueDirectorsViewed(creatorId);
  updateDirectorVisitCount(creatorId, creatorName);
  window.location.href = "director-details.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // Extract tvSeriesId from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const tvSeriesId = urlParams.get("tvSeriesId") || 100088; // Default if no ID is found

  fetchTvDetails(tvSeriesId);

  document.getElementById("clear-search-btn").style.display = "none";

  // Retrieve and apply TV series ratings
  const savedRatings =
    JSON.parse(localStorage.getItem("tvSeriesRatings")) || {};
  const tvSeriesRating = savedRatings[tvSeriesId] || 0;
  setStarRating(tvSeriesRating);
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

      // Redirect to movie details page with movieId in the URL
      window.location.href = `movie-details.html?movieId=${randomMovie.id}`;
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    console.log("Error fetching movie:", error);
    fallbackMovieSelection();
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

  // Redirect with movieId in URL
  window.location.href = `movie-details.html?movieId=${randomFallbackMovie}`;
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

function getMovieCode2() {
  const encodedKey = "MmJhOG" + "U1MzY=";
  return atob(encodedKey);
}

function getMovieName() {
  const moviename = "YXBpa" + "2V5PQ==";
  return atob(moviename);
}

function getMovieActor() {
  const actor = "d3d3Lm" + "9tZGJhc" + "GkuY29t";
  return atob(actor);
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

// function updateBrowserURL(title) {
//   const nameSlug = createNameSlug(title);
//   const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + nameSlug;
//   window.history.replaceState({ path: newURL }, '', newURL);
// }

function createNameSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]/g, "");
}

// TV Series Stats Dashboard functionality
function displayTVStatsDashboard(tvSeries) {
  const dashboard = document.getElementById("tv-stats-dashboard");
  if (!dashboard) return;

  // Show the dashboard immediately
  dashboard.style.display = "block";
  dashboard.style.opacity = "1";

  // Calculate and display popularity (normalize to 0-100 scale)
  const popularity = Math.min(
    100,
    Math.round((tvSeries.popularity / 1000) * 100),
  );

  // Use requestAnimationFrame for non-blocking animations
  requestAnimationFrame(() => {
    // Animate popularity arc
    animateTVPopularity(popularity);

    // Display series overview
    displaySeriesOverview(tvSeries);

    // Display ratings
    displayTVRatings(tvSeries.vote_average || 0, tvSeries.vote_count || 0);

    // Display additional stats
    displayTVAdditionalStats(tvSeries);
  });
}

function animateTVPopularity(value) {
  const popularityValue = document.getElementById("tv-popularity-value");

  if (popularityValue) {
    // Animate the number with a smooth count-up effect
    animateNumber(popularityValue, 0, value, 2000);
  }
}

function displaySeriesOverview(tvSeries) {
  const seasonsBar = document.getElementById("seasons-bar");
  const episodesBar = document.getElementById("episodes-bar");
  const seasonsLabel = document.getElementById("seasons-label");
  const episodesLabel = document.getElementById("episodes-label");
  const totalRuntime = document.getElementById("total-runtime");

  if (seasonsBar && episodesBar) {
    const seasonsCount = tvSeries.number_of_seasons || 0;
    const episodesCount = tvSeries.number_of_episodes || 0;
    const maxValue = Math.max(seasonsCount, episodesCount, 1);

    const seasonsHeight = Math.max((seasonsCount / maxValue) * 100, 5); // Minimum 5% height
    const episodesHeight = Math.max((episodesCount / maxValue) * 100, 5);

    setTimeout(() => {
      seasonsBar.style.height = `${seasonsHeight}%`;
      episodesBar.style.height = `${episodesHeight}%`;

      seasonsBar.setAttribute("title", `${seasonsCount} Seasons`);
      episodesBar.setAttribute("title", `${episodesCount} Episodes`);

      // Show labels above bars
      if (seasonsLabel && episodesLabel) {
        seasonsLabel.textContent = seasonsCount;
        episodesLabel.textContent = episodesCount;
        seasonsLabel.style.opacity = "1";
        episodesLabel.style.opacity = "1";
      }

      // Calculate total runtime
      if (
        totalRuntime &&
        tvSeries.episode_run_time &&
        tvSeries.episode_run_time.length > 0
      ) {
        const avgRuntime = tvSeries.episode_run_time[0];
        const totalMinutes = avgRuntime * episodesCount;
        const hours = Math.floor(totalMinutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          totalRuntime.textContent = `${days}d ${hours % 24}h`;
        } else {
          totalRuntime.textContent = `${hours}h ${totalMinutes % 60}m`;
        }
      }
    }, 800);
  }
}

function displayTVRatings(rating, voteCount) {
  const tmdbBar = document.getElementById("tv-tmdb-rating-bar");
  const tmdbText = document.getElementById("tv-tmdb-rating-text");
  const voteBar = document.getElementById("tv-vote-count-bar");
  const voteText = document.getElementById("tv-vote-count-text");

  if (tmdbBar && tmdbText) {
    const ratingPercentage = (rating / 10) * 100;
    setTimeout(() => {
      tmdbBar.style.width = `${ratingPercentage}%`;
      animateNumber(tmdbText, 0, rating, 1500, 1);
    }, 1000);
  }

  if (voteBar && voteText) {
    const votePercentage = Math.min(100, (voteCount / 10000) * 100);
    setTimeout(() => {
      voteBar.style.width = `${votePercentage}%`;
      voteText.textContent = formatNumber(voteCount);
    }, 1200);
  }
}

function displayTVAdditionalStats(tvSeries) {
  // Status
  const statusEl = document.getElementById("tv-status");
  if (statusEl) {
    statusEl.textContent = tvSeries.status || "Unknown";
    statusEl.style.color = tvSeries.in_production ? "#4CAF50" : "#ff8623";
  }

  // First Air Date
  const firstAirEl = document.getElementById("first-air-date");
  if (firstAirEl && tvSeries.first_air_date) {
    const date = new Date(tvSeries.first_air_date);
    firstAirEl.textContent = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  // Last Air Date
  const lastAirEl = document.getElementById("last-air-date");
  if (lastAirEl && tvSeries.last_air_date) {
    const date = new Date(tvSeries.last_air_date);
    lastAirEl.textContent = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  // Networks
  const networkEl = document.getElementById("network-count");
  if (networkEl && tvSeries.networks) {
    networkEl.textContent = tvSeries.networks.length;
  }
}

// Seasons Timeline functionality
async function fetchSeasonsTimeline(tvSeriesId, seriesName) {
  const container = document.getElementById("seasons-timeline-container");
  const loadingDiv = document.getElementById("timeline-loading");
  const slider = document.getElementById("timeline-slider");
  const seriesTitle = document.getElementById("series-title");

  if (!container || !slider) return;

  // Update series title
  if (seriesTitle) {
    seriesTitle.textContent = `${seriesName} Seasons`;
  }

  // Show loading state
  container.style.display = "block";
  if (loadingDiv) {
    loadingDiv.style.display = "block";
    slider.style.display = "none";
  }

  try {
    const code = `${getMovieCode()}`;
    const url = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}?${generateMovieNames()}${code}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.seasons && data.seasons.length > 0) {
      // Filter out Season 0 (specials) unless it's the only season
      let seasons = data.seasons.filter((s) => s.season_number > 0);
      if (seasons.length === 0) {
        seasons = data.seasons;
      }

      // Hide loading, show timeline
      if (loadingDiv) {
        loadingDiv.style.display = "none";
        slider.style.display = "flex";
      }

      displaySeasonsTimeline(seasons, tvSeriesId, seriesName);
    } else {
      container.style.display = "none";
    }
  } catch (error) {
    console.log("Error fetching seasons:", error);
    container.style.display = "none";
  }
}

function displaySeasonsTimeline(seasons, tvSeriesId, seriesName) {
  const slider = document.getElementById("timeline-slider");
  const container = document.getElementById("seasons-timeline-container");

  if (!slider) return;

  // Clear existing content
  slider.innerHTML = "";

  // Create timeline items for each season
  seasons.forEach((season, index) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";

    // Create poster wrapper
    const posterWrapper = document.createElement("div");
    posterWrapper.className = "timeline-poster-wrapper";

    if (season.poster_path) {
      const img = document.createElement("img");
      img.className = "timeline-poster";
      img.src = `https://image.tmdb.org/t/p/w300${season.poster_path}`;
      img.alt = season.name || `Season ${season.season_number}`;
      img.loading = "lazy";

      img.onerror = function () {
        this.style.display = "none";
        const fallback = document.createElement("div");
        fallback.className = "timeline-poster-fallback";
        fallback.innerHTML = `
          <i class="fas fa-tv"></i>
          <span style="font-size: 11px; text-align: center; padding: 0 10px;">${season.name || `Season ${season.season_number}`}</span>
        `;
        posterWrapper.appendChild(fallback);
      };

      posterWrapper.appendChild(img);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "timeline-poster-fallback";
      fallback.innerHTML = `
        <i class="fas fa-tv"></i>
        <span style="font-size: 11px; text-align: center; padding: 0 10px;">${season.name || `Season ${season.season_number}`}</span>
      `;
      posterWrapper.appendChild(fallback);
    }

    timelineItem.appendChild(posterWrapper);

    // Add timeline dot
    const dot = document.createElement("div");
    dot.className = "timeline-dot";
    timelineItem.appendChild(dot);

    // Add season number/name
    const seasonLabel = document.createElement("div");
    seasonLabel.className = "timeline-season";
    seasonLabel.textContent =
      season.season_number === 0
        ? "Specials"
        : `Season ${season.season_number}`;
    timelineItem.appendChild(seasonLabel);

    // Add episode count
    const episodeCount = document.createElement("div");
    episodeCount.className = "timeline-episode-count";
    episodeCount.textContent = `${season.episode_count || 0} Episodes`;
    if (season.air_date) {
      const year = new Date(season.air_date).getFullYear();
      episodeCount.textContent += ` • ${year}`;
    }
    timelineItem.appendChild(episodeCount);

    // Add click event
    timelineItem.addEventListener("click", () => {
      // Could navigate to season details page if available
      console.log(`Selected Season ${season.season_number} of ${seriesName}`);
    });

    // Add hover effect
    timelineItem.addEventListener("mouseenter", () => {
      timelineItem.style.zIndex = "1000";
      timelineItem.style.position = "relative";
      container.style.overflow = "visible";
    });

    timelineItem.addEventListener("mouseleave", () => {
      timelineItem.style.zIndex = "2";
      timelineItem.style.position = "relative";
    });

    slider.appendChild(timelineItem);
  });

  // Show container with animation
  container.style.opacity = "0";
  container.style.overflow = "visible";
  setTimeout(() => {
    container.style.transition = "opacity 0.5s ease";
    container.style.opacity = "1";
  }, 50);

  // Initialize navigation
  initializeTimelineNavigation();
}

function initializeTimelineNavigation() {
  const slider = document.getElementById("timeline-slider");
  const prevBtn = document.getElementById("timeline-prev");
  const nextBtn = document.getElementById("timeline-next");

  if (!slider || !prevBtn || !nextBtn) return;

  // Remove existing listeners
  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

  // Check scroll position
  function updateNavButtons() {
    const isAtStart = slider.scrollLeft <= 10;
    const isAtEnd =
      slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10;

    newPrevBtn.disabled = isAtStart;
    newNextBtn.disabled = isAtEnd;
  }

  // Calculate scroll amount
  function getScrollAmount() {
    const itemWidth =
      slider.querySelector(".timeline-item")?.offsetWidth || 160;
    const gap = 50;
    return (itemWidth + gap) * 2;
  }

  // Scroll functions
  newPrevBtn.addEventListener("click", () => {
    const scrollAmount = getScrollAmount();
    slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    setTimeout(() => {
      updateNavButtons();
      updateTimelineProgress();
    }, 300);
  });

  newNextBtn.addEventListener("click", () => {
    const scrollAmount = getScrollAmount();
    slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(() => {
      updateNavButtons();
      updateTimelineProgress();
    }, 300);
  });

  // Update on scroll
  let scrollTimeout;
  slider.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateNavButtons();
      updateTimelineProgress();
    }, 50);
  });

  // Initial state
  updateNavButtons();
}

function updateTimelineProgress() {
  const slider = document.getElementById("timeline-slider");
  const progressBar = document.getElementById("timeline-progress");

  if (!slider || !progressBar) return;

  const scrollPercentage =
    (slider.scrollLeft / (slider.scrollWidth - slider.clientWidth)) * 100;
  progressBar.style.width = `${Math.max(0, Math.min(100, scrollPercentage))}%`;
}

// Helper functions
function animateNumber(element, start, end, duration, decimals = 0) {
  const range = end - start;
  const startTime = Date.now();

  function update() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + range * easeOutQuad(progress);
    element.textContent = value.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function formatNumber(value) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toLocaleString();
}
