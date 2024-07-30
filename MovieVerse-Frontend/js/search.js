const form = document.getElementById("form1");
const IMGPATH = "https://image.tmdb.org/t/p/w500";

function showSpinner() {
  document.getElementById("myModal").classList.add("modal-visible");
}

function hideSpinner() {
  document.getElementById("myModal").classList.remove("modal-visible");
}

document.addEventListener("DOMContentLoaded", () => {
  showResults("movie");
  updateCategoryButtonStyles("movie");
  attachEventListeners();
  attachArrowKeyNavigation();

  document.getElementById("form1").addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });
});

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem("genreMap")) {
    await fetchGenreMap();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showResults("movie");
  updateCategoryButtonStyles("movie");
  attachEventListeners();
  attachArrowKeyNavigation();
  fetchGenreMap();
  fetchTvGenreMap();
  fetchLanguages();
  fetchTvLanguages();

  document.getElementById("form1").addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });
});

async function fetchTvLanguages() {
  const url = `https://${getMovieVerseData()}/3/configuration/languages?${generateMovieNames()}${getMovieCode()}`;

  try {
    const response = await fetch(url);
    let languages = await response.json();
    languages = languages.sort((a, b) =>
      a.english_name.localeCompare(b.english_name),
    );
    populateTvLanguageFilter(languages);
  } catch (error) {
    console.log("Error fetching languages:", error);
  }
}

function populateTvLanguageFilter(languages) {
  const languageFilter = document.getElementById("language-tv-filter");
  languageFilter.innerHTML = '<option value="">Select Language</option>';

  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.iso_639_1;
    option.textContent = language.english_name;
    languageFilter.appendChild(option);
  });
}

async function fetchLanguages() {
  const url = `https://${getMovieVerseData()}/3/configuration/languages?${generateMovieNames()}${getMovieCode()}`;

  try {
    const response = await fetch(url);
    let languages = await response.json();
    languages = languages.sort((a, b) =>
      a.english_name.localeCompare(b.english_name),
    );
    populateLanguageFilter(languages);
  } catch (error) {
    console.log("Error fetching languages:", error);
  }
}

function populateLanguageFilter(languages) {
  const languageFilter = document.getElementById("language-filter");
  languageFilter.innerHTML = '<option value="">Select Language</option>';

  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.iso_639_1;
    option.textContent = language.english_name;
    languageFilter.appendChild(option);
  });
}

async function fetchGenreMap() {
  const code = getMovieCode();
  const url = `https://${getMovieVerseData()}/3/genre/movie/list?${generateMovieNames()}${code}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem("genreMap", JSON.stringify(data.genres));
    populateGenreFilter(data.genres);
  } catch (error) {
    console.log("Error fetching genre map:", error);
  }
}

async function fetchTvGenreMap() {
  const code = getMovieCode();
  const url = `https://${getMovieVerseData()}/3/genre/tv/list?${generateMovieNames()}${code}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem("tvGenreMap", JSON.stringify(data.genres));
    populateTvGenreFilter(data.genres);
  } catch (error) {
    console.log("Error fetching TV genre map:", error);
  }
}

function populateGenreFilter(genres) {
  const genreFilter = document.getElementById("genre-filter");
  genreFilter.innerHTML = '<option value="">Select Genre</option>';

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}

function populateTvGenreFilter(genres) {
  const genreFilter = document.getElementById("genre-tv-filter");
  genreFilter.innerHTML = '<option value="">Select Genre</option>';

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
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

function attachEventListeners() {
  const movieBtn = document.querySelector('[data-category="movie"]');
  const tvBtn = document.querySelector('[data-category="tv"]');
  const peopleBtn = document.querySelector('[data-category="person"]');
  const toggleFiltersBtn = document.getElementById("toggle-filters-btn");

  const movieFilters = document.getElementById("movie-tv-filters");
  const tvFilters = document.getElementById("tv-filters");
  const peopleFilters = document.getElementById("people-filters");

  const genreMovieFilter = document.getElementById("genre-filter");
  const yearMovieFilter = document.getElementById("year-filter");
  const ratingMovieFilter = document.getElementById("rating-filter");
  const languageFilter = document.getElementById("language-filter");

  const genreTvFilter = document.getElementById("genre-tv-filter");
  const yearTvFilter = document.getElementById("year-tv-filter");
  const ratingTvFilter = document.getElementById("rating-tv-filter");
  const languageTvFilter = document.getElementById("language-tv-filter");

  const professionFilter = document.getElementById("profession-filter");
  const genderFilter = document.getElementById("gender-filter");
  const popularityFilter = document.getElementById("popularity-filter");

  const ratingValueSpan = document.getElementById("rating-value");
  const ratingTvValueSpan = document.getElementById("rating-tv-value");
  const popularityValueSpan = document.getElementById("popularity-value");

  movieFilters.style.display = "none";
  tvFilters.style.display = "none";
  peopleFilters.style.display = "none";

  function setFilterDisplayValues() {
    ratingValueSpan.textContent = `Rating: ${ratingMovieFilter.value} and above`;
    ratingTvValueSpan.textContent = `Rating: ${ratingTvFilter.value} and above`;
    popularityValueSpan.textContent = `Popularity: ${popularityFilter.value} and above`;
  }

  function showCorrectFilters(category) {
    movieFilters.style.display = category === "movie" ? "block" : "none";
    tvFilters.style.display = category === "tv" ? "block" : "none";
    peopleFilters.style.display = category === "person" ? "block" : "none";
  }

  movieBtn.addEventListener("click", () => {
    showResults("movie");
    updateCategoryButtonStyles("movie");
    showCorrectFilters("movie");
    movieFilters.style.display = "none";
    tvFilters.style.display = "none";
    peopleFilters.style.display = "none";
    toggleFiltersBtn.textContent = "Filter & Sort Results";
  });

  tvBtn.addEventListener("click", () => {
    showResults("tv");
    updateCategoryButtonStyles("tv");
    showCorrectFilters("tv");
    movieFilters.style.display = "none";
    tvFilters.style.display = "none";
    peopleFilters.style.display = "none";
    toggleFiltersBtn.textContent = "Filter & Sort Results";
  });

  peopleBtn.addEventListener("click", () => {
    showResults("person");
    updateCategoryButtonStyles("person");
    showCorrectFilters("person");
    movieFilters.style.display = "none";
    tvFilters.style.display = "none";
    peopleFilters.style.display = "none";
    toggleFiltersBtn.textContent = "Filter & Sort Results";
  });

  toggleFiltersBtn.addEventListener("click", () => {
    if (currentCategory === "movie") {
      movieFilters.style.display =
        movieFilters.style.display === "none" ? "block" : "none";
    } else if (currentCategory === "tv") {
      tvFilters.style.display =
        tvFilters.style.display === "none" ? "block" : "none";
    } else if (currentCategory === "person") {
      peopleFilters.style.display =
        peopleFilters.style.display === "none" ? "block" : "none";
    }
  });

  genreMovieFilter.addEventListener("change", () => showResults("movie"));
  yearMovieFilter.addEventListener("change", () => showResults("movie"));
  ratingMovieFilter.addEventListener("input", () => {
    ratingValueSpan.textContent = `Rating: ${ratingMovieFilter.value} and above`;
    showResults("movie");
  });
  languageFilter.addEventListener("change", () => showResults("movie"));

  genreTvFilter.addEventListener("change", () => showResults("tv"));
  yearTvFilter.addEventListener("change", () => showResults("tv"));
  ratingTvFilter.addEventListener("input", () => {
    ratingTvValueSpan.textContent = `Rating: ${ratingTvFilter.value} and above`;
    showResults("tv");
  });
  languageTvFilter.addEventListener("change", () => showResults("tv"));

  genderFilter.addEventListener("change", () => showResults("person"));
  professionFilter.addEventListener("change", () => showResults("person"));
  popularityFilter.addEventListener("input", () => {
    popularityValueSpan.textContent = `Popularity: ${popularityFilter.value} and above`;
    showResults("person");
  });

  const resetMovieFiltersBtn = movieFilters.querySelector(
    'button[id="reset-filters"]',
  );
  const resetTvFiltersBtn = tvFilters.querySelector(
    'button[id="reset-filters"]',
  );
  const resetPeopleFiltersBtn = peopleFilters.querySelector(
    'button[id="reset-filters"]',
  );

  resetMovieFiltersBtn.addEventListener("click", () => {
    genreMovieFilter.selectedIndex = 0;
    yearMovieFilter.value = "";
    ratingMovieFilter.value = 5;
    languageFilter.selectedIndex = 0;
    setFilterDisplayValues();
    showResults("movie");
  });

  resetTvFiltersBtn.addEventListener("click", () => {
    genreTvFilter.selectedIndex = 0;
    yearTvFilter.value = "";
    ratingTvFilter.value = 5;
    languageTvFilter.selectedIndex = 0;
    setFilterDisplayValues();
    showResults("tv");
  });

  resetPeopleFiltersBtn.addEventListener("click", () => {
    professionFilter.selectedIndex = 0;
    genderFilter.selectedIndex = 0;
    popularityFilter.value = 20;
    setFilterDisplayValues();
    showResults("person");
  });

  setFilterDisplayValues();
  showCorrectFilters(localStorage.getItem("selectedCategory"));
}

let currentCategory = "movie";

document.addEventListener("DOMContentLoaded", function () {
  const toggleFiltersBtn = document.getElementById("toggle-filters-btn");
  const movieTvFilters = document.getElementById("movie-tv-filters");
  const peopleFilters = document.getElementById("people-filters");
  const tvFilters = document.getElementById("tv-filters");

  movieTvFilters.style.display = "none";
  peopleFilters.style.display = "none";
  tvFilters.style.display = "none";

  toggleFiltersBtn.addEventListener("click", function () {
    if (currentCategory === "movie") {
      movieTvFilters.style.display =
        movieTvFilters.style.display === "none" ? "block" : "none";
    } else if (currentCategory === "person") {
      peopleFilters.style.display =
        peopleFilters.style.display === "none" ? "block" : "none";
    } else if (currentCategory === "tv") {
      tvFilters.style.display =
        tvFilters.style.display === "none" ? "block" : "none";
    }

    if (
      currentCategory === "movie" &&
      movieTvFilters.style.display !== "none"
    ) {
      toggleFiltersBtn.textContent = "Close Filters";
    } else if (
      currentCategory === "person" &&
      peopleFilters.style.display !== "none"
    ) {
      toggleFiltersBtn.textContent = "Close Filters";
    } else if (currentCategory === "tv" && tvFilters.style.display !== "none") {
      toggleFiltersBtn.textContent = "Close Filters";
    } else {
      toggleFiltersBtn.textContent = "Filter & Sort Results";
    }
  });

  document.getElementById("sort-movie").addEventListener("change", () => {
    movieSortChanged = true;
    showResults("movie");
  });

  document.getElementById("sort-tv").addEventListener("change", () => {
    tvSortChanged = true;
    showResults("tv");
  });

  document.getElementById("sort-people").addEventListener("change", () => {
    peopleSortChanged = true;
    showResults("person");
  });

  document.querySelectorAll(".category-buttons button").forEach((button) => {
    button.addEventListener("click", function () {
      currentCategory = this.getAttribute("data-category");
    });
  });
});

let movieSortChanged = false;
let tvSortChanged = false;
let peopleSortChanged = false;

function attachArrowKeyNavigation() {
  const categories = ["movie", "tv", "person"];
  let currentIndex = 0;

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        currentIndex = (currentIndex + 1) % categories.length;
        break;
      case "ArrowLeft":
        currentIndex =
          (currentIndex - 1 + categories.length) % categories.length;
        break;
      default:
        return;
    }
    const selectedCategory = categories[currentIndex];
    showResults(selectedCategory);
    updateCategoryButtonStyles(selectedCategory);
    e.preventDefault();
  });
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

function sortResults(results, sortBy) {
  if (!sortBy) return results;

  const [property, order] = sortBy.split(".");
  results.sort((a, b) => {
    let propA =
      property === "release_date" || property === "first_air_date"
        ? new Date(a[property])
        : a[property];
    let propB =
      property === "release_date" || property === "first_air_date"
        ? new Date(b[property])
        : b[property];

    if (order === "asc") {
      return propA > propB ? 1 : propA < propB ? -1 : 0;
    } else {
      return propA < propB ? 1 : propA > propB ? -1 : 0;
    }
  });
  return results;
}

async function showResults(category) {
  showSpinner();
  localStorage.setItem("selectedCategory", category);
  currentCategory = category;

  const searchQuery = localStorage.getItem("searchQuery") || "";
  document.getElementById("search-results-label").textContent =
    `Search Results for "${searchQuery}"`;

  const code = getMovieCode();
  const baseApiUrl = `https://${getMovieVerseData()}/3`;
  let url = `${baseApiUrl}/search/${category}?${generateMovieNames()}${code}&query=${encodeURIComponent(searchQuery)}`;
  let sortValue = "";

  if (category === "movie") {
    sortValue = document.getElementById("sort-movie").value;
  } else if (category === "tv") {
    sortValue = document.getElementById("sort-tv").value;
  } else if (category === "person") {
    sortValue = document.getElementById("sort-people").value;
  }

  try {
    const response = await fetch(url);
    let data = await response.json();

    if (category === "movie") {
      const genre = document.getElementById("genre-filter").value;
      const year =
        category === "movie"
          ? document.getElementById("year-filter").value
          : document.getElementById("year-filter").value;
      const rating = parseFloat(document.getElementById("rating-filter").value);
      const language = document.getElementById("language-filter").value;

      data.results = data.results.filter((item) => {
        const itemYear =
          category === "movie"
            ? item.release_date?.substring(0, 4)
            : item.first_air_date?.substring(0, 4);
        const itemRating = item.vote_average;
        const itemGenres = item.genre_ids;
        const itemLanguage = item.original_language;

        return (
          (!genre || itemGenres.includes(parseInt(genre))) &&
          (!year || itemYear === year) &&
          (!rating || itemRating >= rating) &&
          (!language || itemLanguage === language)
        );
      });
    } else if (category === "person") {
      const profession = document.getElementById("profession-filter").value;
      const gender = document.getElementById("gender-filter").value;

      if (profession) {
        data.results = data.results.filter(
          (person) =>
            person.known_for_department &&
            person.known_for_department.toLowerCase() ===
              profession.toLowerCase(),
        );
      }

      if (gender) {
        data.results = data.results.filter(
          (person) => person.gender.toString() === gender,
        );
      }

      const popularity = parseFloat(
        document.getElementById("popularity-filter").value,
      );
      if (!isNaN(popularity) && popularity > 0) {
        data.results = data.results.filter(
          (person) => person.popularity >= popularity,
        );
      }

      data.results.sort((a, b) => b.popularity - a.popularity);
    } else if (category === "tv") {
      const genre = document.getElementById("genre-tv-filter").value;
      const year = document.getElementById("year-tv-filter").value;
      const rating = parseFloat(
        document.getElementById("rating-tv-filter").value,
      );
      const language = document.getElementById("language-tv-filter").value;

      data.results = data.results.filter((item) => {
        const itemYear = item.first_air_date?.substring(0, 4);
        const itemRating = item.vote_average;
        const itemGenres = item.genre_ids;
        const itemLanguage = item.original_language;

        return (
          (!genre || itemGenres.includes(parseInt(genre))) &&
          (!year || itemYear === year) &&
          (!rating || itemRating >= rating) &&
          (!language || itemLanguage === language)
        );
      });
    }

    if (
      (category === "movie" && movieSortChanged) ||
      (category === "tv" && tvSortChanged) ||
      (category === "person" && peopleSortChanged)
    ) {
      data.results = sortResults(data.results, sortValue);
    }

    displayResults(data.results, category, searchQuery);
  } catch (error) {
    console.log("Error fetching search results:", error);
  } finally {
    hideSpinner();
  }
}

document
  .querySelector("button[onclick=\"showResults('movie')\"]")
  .addEventListener("click", function () {
    showResults("movie");
    localStorage.setItem("selectedCategory", "movie");
    updateCategoryButtonStyles();
  });

document
  .querySelector("button[onclick=\"showResults('tv')\"]")
  .addEventListener("click", function () {
    showResults("tv");
    localStorage.setItem("selectedCategory", "tv");
    updateCategoryButtonStyles();
  });

document
  .querySelector("button[onclick=\"showResults('person')\"]")
  .addEventListener("click", function () {
    showResults("person");
    localStorage.setItem("selectedCategory", "person");
    updateCategoryButtonStyles();
  });

function updateCategoryButtonStyles(selectedCategory) {
  const movieBtn = document.querySelector('[data-category="movie"]');
  const tvBtn = document.querySelector('[data-category="tv"]');
  const peopleBtn = document.querySelector('[data-category="person"]');

  movieBtn.style.backgroundColor = "";
  tvBtn.style.backgroundColor = "";
  peopleBtn.style.backgroundColor = "";

  if (selectedCategory === "movie") {
    movieBtn.style.backgroundColor = "#ff8623";
  } else if (selectedCategory === "tv") {
    tvBtn.style.backgroundColor = "#ff8623";
  } else if (selectedCategory === "person") {
    peopleBtn.style.backgroundColor = "#ff8623";
  }
}

function displayResults(results, category, searchTerm) {
  const container = document.getElementById("movie-match-container1");
  container.innerHTML = "";

  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  if (results.length === 0) {
    container.innerHTML = `<p>No results found for "${searchTerm}" in the ${capitalizedCategory} category or no results with the specified filters found. Please try again with a different query or change your filters.</p>`;
    container.style.height = "800px";
    return;
  }

  showMovies(results, container, category);
}

const main = document.getElementById("movie-match-container1");

async function getAdditionalPosters(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${getMovieCode()}`,
  );
  const data = await response.json();
  return data.posters.map((poster) => poster.file_path);
}

function rotateImages(imageElements, interval = 3000) {
  if (imageElements.length <= 1) return;

  let currentIndex = 0;
  imageElements[currentIndex].style.opacity = "1";

  setTimeout(() => {
    setInterval(() => {
      imageElements[currentIndex].style.opacity = "0";
      currentIndex = (currentIndex + 1) % imageElements.length;
      imageElements[currentIndex].style.opacity = "1";
    }, interval);
  }, 0);
}

async function showMovies(movies, mainElement) {
  mainElement.innerHTML = "";

  const observer = new IntersectionObserver(
    async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const movieEl = entry.target;
          const movieId = movieEl.dataset.id;

          const additionalPosters = await getAdditionalPosters(movieId);
          let allPosters = [movieEl.dataset.posterPath, ...additionalPosters];

          const movieImageContainer = movieEl.querySelector(".movie-images");

          allPosters = allPosters.sort(() => 0.5 - Math.random()).slice(0, 10);

          const imagePromises = allPosters.map((poster, index) => {
            const img = new Image();
            img.src = `${IMGPATH + poster}`;
            img.loading = index === 0 ? "eager" : "lazy";
            img.alt = `${movieEl.dataset.title} poster ${index + 1}`;
            img.width = 300;
            img.height = 435;
            img.style.position = "absolute";
            img.style.top = 0;
            img.style.left = 0;
            img.style.transition = "opacity 1s ease-in-out";
            img.style.opacity = "0";
            img.classList.add("poster-img");
            movieImageContainer.appendChild(img);

            return new Promise((resolve) => {
              img.onload = () => resolve(img);
            });
          });

          const maxWait = new Promise((resolve) => setTimeout(resolve, 3000));
          await Promise.race([Promise.all(imagePromises), maxWait]);

          movieImageContainer.querySelector(".poster-img").style.opacity = "1";

          rotateImages(Array.from(movieImageContainer.children));
          observer.unobserve(movieEl);
        }
      }
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    },
  );

  movies.forEach((movie) => {
    let {
      id,
      poster_path,
      title,
      vote_average,
      vote_count,
      overview,
      genre_ids,
    } = movie;

    const movieEl = document.createElement("div");
    movieEl.style.zIndex = "1000";
    movieEl.classList.add("movie");
    movieEl.dataset.id = id;
    movieEl.dataset.posterPath = poster_path;
    movieEl.dataset.title = title;

    const words = title.split(" ");
    if (words.length >= 9) {
      words[8] = "...";
      title = words.slice(0, 9).join(" ");
    }

    const voteAvg = vote_count === 0 ? "Unrated" : vote_average.toFixed(1);
    const ratingClass =
      vote_count === 0 ? "unrated" : getClassByRate(vote_average);

    if (overview === "") {
      overview = "No overview available.";
    }

    movieEl.innerHTML = `
            <div class="movie-image-container">
                <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden;">
                  <img src="${IMGPATH + poster_path}" loading="lazy" alt="${title} poster" width="150" height="225" style="position: absolute; top: 0; left: 0; transition: opacity 1s ease-in-out; opacity: 1;">
                </div>
            </div>
            <div class="movie-info" style="display: flex; justify-content: space-between; align-items: start; cursor: pointer;">
                <h3 style="text-align: left; margin-right: 10px; flex: 1;">${title}</h3>
                <span class="${ratingClass}" style="white-space: nowrap;">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Overview: </h4>
                ${overview}
            </div>`;

    movieEl.addEventListener("click", () => {
      localStorage.setItem("selectedMovieId", id);
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
      window.location.href = "MovieVerse-Frontend/html/movie-details.html";
    });

    mainElement.appendChild(movieEl);
    observer.observe(movieEl);
  });
}

function handleDirectorClick(directorId, directorName) {
  updateUniqueDirectorsViewed(directorId);
  updateDirectorVisitCount(directorId, directorName);
  localStorage.setItem("selectedDirectorId", directorId);
  document.title = `${directorName} - Director's Details`;
  window.location.href = "director-details.html";
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

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function handleSearch() {
  const searchQuery = document.getElementById("search").value;
  localStorage.setItem("searchQuery", searchQuery);
  window.location.reload();
}

function updateBrowserURL(title) {
  const nameSlug = createNameSlug(title);
  const newURL =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?search_query=" +
    nameSlug;
  window.history.replaceState({ path: newURL }, "", newURL);
}

function createNameSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]/g, "");
}
