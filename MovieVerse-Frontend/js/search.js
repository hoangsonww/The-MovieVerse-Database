const form = document.getElementById('form1');
const IMGPATH = 'https://image.tmdb.org/t/p/w500';

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

document.addEventListener('DOMContentLoaded', () => {
  showResults('movie');
  updateCategoryButtonStyles('movie');
  attachEventListeners();
  attachArrowKeyNavigation();

  document.getElementById('form1').addEventListener('submit', function (event) {
    event.preventDefault();
    handleSearch();
  });
});

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showResults('movie');
  updateCategoryButtonStyles('movie');
  attachEventListeners();
  attachArrowKeyNavigation();
  fetchGenreMap();
  fetchTvGenreMap();
  fetchLanguages();
  fetchTvLanguages();

  document.getElementById('form1').addEventListener('submit', function (event) {
    event.preventDefault();
    handleSearch();
  });
});

async function fetchTvLanguages() {
  const url = `https://${getMovieVerseData()}/3/configuration/languages?${generateMovieNames()}${getMovieCode()}`;

  try {
    const response = await fetch(url);
    let languages = await response.json();
    languages = languages.sort((a, b) => a.english_name.localeCompare(b.english_name));
    populateTvLanguageFilter(languages);
  } catch (error) {
    console.log('Error fetching languages:', error);
  }
}

function populateTvLanguageFilter(languages) {
  const languageFilter = document.getElementById('language-tv-filter');
  languageFilter.innerHTML = '<option value="">Select Language</option>';

  languages.forEach(language => {
    const option = document.createElement('option');
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
    languages = languages.sort((a, b) => a.english_name.localeCompare(b.english_name));
    populateLanguageFilter(languages);
  } catch (error) {
    console.log('Error fetching languages:', error);
  }
}

function populateLanguageFilter(languages) {
  const languageFilter = document.getElementById('language-filter');
  languageFilter.innerHTML = '<option value="">Select Language</option>';

  languages.forEach(language => {
    const option = document.createElement('option');
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
    localStorage.setItem('genreMap', JSON.stringify(data.genres));
    populateGenreFilter(data.genres);
  } catch (error) {
    console.log('Error fetching genre map:', error);
  }
}

async function fetchTvGenreMap() {
  const code = getMovieCode();
  const url = `https://${getMovieVerseData()}/3/genre/tv/list?${generateMovieNames()}${code}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem('tvGenreMap', JSON.stringify(data.genres));
    populateTvGenreFilter(data.genres);
  } catch (error) {
    console.log('Error fetching TV genre map:', error);
  }
}

function populateGenreFilter(genres) {
  const genreFilter = document.getElementById('genre-filter');
  genreFilter.innerHTML = '<option value="">Select Genre</option>';

  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}

function populateTvGenreFilter(genres) {
  const genreFilter = document.getElementById('genre-tv-filter');
  genreFilter.innerHTML = '<option value="">Select Genre</option>';

  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}

async function rotateUserStats() {
  await ensureGenreMapIsAvailable();

  const stats = [
    {
      label: 'Your Current Time',
      getValue: () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes}`;
      },
    },
    { label: 'Most Visited Movie', getValue: getMostVisitedMovie },
    { label: 'Most Visited Director', getValue: getMostVisitedDirector },
    { label: 'Most Visited Actor', getValue: getMostVisitedActor },
    {
      label: 'Movies Discovered',
      getValue: () => {
        const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
        return viewedMovies.length;
      },
    },
    {
      label: 'Favorite Movies',
      getValue: () => {
        const favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
        return favoritedMovies.length;
      },
    },
    {
      label: 'Favorite Genre',
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
        } catch (e) {
          console.log('Error parsing genre map:', e);
          return 'Not Available';
        }

        let genreObject;
        if (Array.isArray(genreMap)) {
          genreObject = genreMap.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {});
        } else if (typeof genreMap === 'object' && genreMap !== null) {
          genreObject = genreMap;
        } else {
          console.log('genreMap is neither an array nor a proper object:', genreMap);
          return 'Not Available';
        }

        return genreObject[mostCommonGenreCode] || 'Not Available';
      },
    },
    {
      label: 'Watchlists Created',
      getValue: () => localStorage.getItem('watchlistsCreated') || 0,
    },
    {
      label: 'Average Movie Rating',
      getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated',
    },
    {
      label: 'Directors Discovered',
      getValue: () => {
        const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
        return viewedDirectors.length;
      },
    },
    {
      label: 'Actors Discovered',
      getValue: () => {
        const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
        return viewedActors.length;
      },
    },
    { label: 'Your Trivia Accuracy', getValue: getTriviaAccuracy },
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
  let uniqueMoviesViewed = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];

  if (!movieVisits[movieId]) {
    movieVisits[movieId] = { count: 0, title: movieTitle };
  }
  movieVisits[movieId].count += 1;

  if (!uniqueMoviesViewed.includes(movieId)) {
    uniqueMoviesViewed.push(movieId);
  }

  localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
  localStorage.setItem('uniqueMoviesViewed', JSON.stringify(uniqueMoviesViewed));
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

function getTriviaAccuracy() {
  let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || {
    totalCorrect: 0,
    totalAttempted: 0,
  };

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

function attachEventListeners() {
  const movieBtn = document.querySelector('[data-category="movie"]');
  const tvBtn = document.querySelector('[data-category="tv"]');
  const peopleBtn = document.querySelector('[data-category="person"]');
  const toggleFiltersBtn = document.getElementById('toggle-filters-btn');

  const movieFilters = document.getElementById('movie-tv-filters');
  const tvFilters = document.getElementById('tv-filters');
  const peopleFilters = document.getElementById('people-filters');

  const genreMovieFilter = document.getElementById('genre-filter');
  const yearMovieFilter = document.getElementById('year-filter');
  const ratingMovieFilter = document.getElementById('rating-filter');
  const languageFilter = document.getElementById('language-filter');

  const genreTvFilter = document.getElementById('genre-tv-filter');
  const yearTvFilter = document.getElementById('year-tv-filter');
  const ratingTvFilter = document.getElementById('rating-tv-filter');
  const languageTvFilter = document.getElementById('language-tv-filter');

  const professionFilter = document.getElementById('profession-filter');
  const genderFilter = document.getElementById('gender-filter');
  const popularityFilter = document.getElementById('popularity-filter');

  const ratingValueSpan = document.getElementById('rating-value');
  const ratingTvValueSpan = document.getElementById('rating-tv-value');
  const popularityValueSpan = document.getElementById('popularity-value');

  movieFilters.style.display = 'none';
  tvFilters.style.display = 'none';
  peopleFilters.style.display = 'none';

  function setFilterDisplayValues() {
    ratingValueSpan.textContent = `Rating: ${ratingMovieFilter.value} and above`;
    ratingTvValueSpan.textContent = `Rating: ${ratingTvFilter.value} and above`;
    popularityValueSpan.textContent = `Popularity: ${popularityFilter.value} and above`;
  }

  function showCorrectFilters(category) {
    movieFilters.style.display = category === 'movie' ? 'block' : 'none';
    tvFilters.style.display = category === 'tv' ? 'block' : 'none';
    peopleFilters.style.display = category === 'person' ? 'block' : 'none';
  }

  movieBtn.addEventListener('click', () => {
    showResults('movie');
    updateCategoryButtonStyles('movie');
    showCorrectFilters('movie');
    movieFilters.style.display = 'none';
    tvFilters.style.display = 'none';
    peopleFilters.style.display = 'none';
    toggleFiltersBtn.textContent = 'Filter & Sort Results';
  });

  tvBtn.addEventListener('click', () => {
    showResults('tv');
    updateCategoryButtonStyles('tv');
    showCorrectFilters('tv');
    movieFilters.style.display = 'none';
    tvFilters.style.display = 'none';
    peopleFilters.style.display = 'none';
    toggleFiltersBtn.textContent = 'Filter & Sort Results';
  });

  peopleBtn.addEventListener('click', () => {
    showResults('person');
    updateCategoryButtonStyles('person');
    showCorrectFilters('person');
    movieFilters.style.display = 'none';
    tvFilters.style.display = 'none';
    peopleFilters.style.display = 'none';
    toggleFiltersBtn.textContent = 'Filter & Sort Results';
  });

  toggleFiltersBtn.addEventListener('click', () => {
    if (currentCategory === 'movie') {
      movieFilters.style.display = movieFilters.style.display === 'none' ? 'block' : 'none';
    } else if (currentCategory === 'tv') {
      tvFilters.style.display = tvFilters.style.display === 'none' ? 'block' : 'none';
    } else if (currentCategory === 'person') {
      peopleFilters.style.display = peopleFilters.style.display === 'none' ? 'block' : 'none';
    }
  });

  genreMovieFilter.addEventListener('change', () => showResults('movie'));
  yearMovieFilter.addEventListener('change', () => showResults('movie'));
  ratingMovieFilter.addEventListener('input', () => {
    ratingValueSpan.textContent = `Rating: ${ratingMovieFilter.value} and above`;
    showResults('movie');
  });
  languageFilter.addEventListener('change', () => showResults('movie'));

  genreTvFilter.addEventListener('change', () => showResults('tv'));
  yearTvFilter.addEventListener('change', () => showResults('tv'));
  ratingTvFilter.addEventListener('input', () => {
    ratingTvValueSpan.textContent = `Rating: ${ratingTvFilter.value} and above`;
    showResults('tv');
  });
  languageTvFilter.addEventListener('change', () => showResults('tv'));

  genderFilter.addEventListener('change', () => showResults('person'));
  professionFilter.addEventListener('change', () => showResults('person'));
  popularityFilter.addEventListener('input', () => {
    popularityValueSpan.textContent = `Popularity: ${popularityFilter.value} and above`;
    showResults('person');
  });

  const resetMovieFiltersBtn = movieFilters.querySelector('button[id="reset-filters"]');
  const resetTvFiltersBtn = tvFilters.querySelector('button[id="reset-filters"]');
  const resetPeopleFiltersBtn = peopleFilters.querySelector('button[id="reset-filters"]');

  resetMovieFiltersBtn.addEventListener('click', () => {
    genreMovieFilter.selectedIndex = 0;
    yearMovieFilter.value = '';
    ratingMovieFilter.value = 5;
    languageFilter.selectedIndex = 0;
    setFilterDisplayValues();
    showResults('movie');
  });

  resetTvFiltersBtn.addEventListener('click', () => {
    genreTvFilter.selectedIndex = 0;
    yearTvFilter.value = '';
    ratingTvFilter.value = 5;
    languageTvFilter.selectedIndex = 0;
    setFilterDisplayValues();
    showResults('tv');
  });

  resetPeopleFiltersBtn.addEventListener('click', () => {
    professionFilter.selectedIndex = 0;
    genderFilter.selectedIndex = 0;
    popularityFilter.value = 20;
    setFilterDisplayValues();
    showResults('person');
  });

  setFilterDisplayValues();
  showCorrectFilters(localStorage.getItem('selectedCategory'));
}

let currentCategory = 'movie';

document.addEventListener('DOMContentLoaded', function () {
  const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
  const movieTvFilters = document.getElementById('movie-tv-filters');
  const peopleFilters = document.getElementById('people-filters');
  const tvFilters = document.getElementById('tv-filters');

  movieTvFilters.style.display = 'none';
  peopleFilters.style.display = 'none';
  tvFilters.style.display = 'none';

  toggleFiltersBtn.addEventListener('click', function () {
    if (currentCategory === 'movie') {
      movieTvFilters.style.display = movieTvFilters.style.display === 'none' ? 'block' : 'none';
    } else if (currentCategory === 'person') {
      peopleFilters.style.display = peopleFilters.style.display === 'none' ? 'block' : 'none';
    } else if (currentCategory === 'tv') {
      tvFilters.style.display = tvFilters.style.display === 'none' ? 'block' : 'none';
    }

    if (currentCategory === 'movie' && movieTvFilters.style.display !== 'none') {
      toggleFiltersBtn.textContent = 'Close Filters';
    } else if (currentCategory === 'person' && peopleFilters.style.display !== 'none') {
      toggleFiltersBtn.textContent = 'Close Filters';
    } else if (currentCategory === 'tv' && tvFilters.style.display !== 'none') {
      toggleFiltersBtn.textContent = 'Close Filters';
    } else {
      toggleFiltersBtn.textContent = 'Filter & Sort Results';
    }
  });

  document.getElementById('sort-movie').addEventListener('change', () => {
    movieSortChanged = true;
    showResults('movie');
  });

  document.getElementById('sort-tv').addEventListener('change', () => {
    tvSortChanged = true;
    showResults('tv');
  });

  document.getElementById('sort-people').addEventListener('change', () => {
    peopleSortChanged = true;
    showResults('person');
  });

  document.querySelectorAll('.category-buttons button').forEach(button => {
    button.addEventListener('click', function () {
      currentCategory = this.getAttribute('data-category');
    });
  });
});

let movieSortChanged = false;
let tvSortChanged = false;
let peopleSortChanged = false;

function attachArrowKeyNavigation() {
  const categories = ['movie', 'tv', 'person'];
  let currentIndex = 0;

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
        currentIndex = (currentIndex + 1) % categories.length;
        break;
      case 'ArrowLeft':
        currentIndex = (currentIndex - 1 + categories.length) % categories.length;
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
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function sortResults(results, sortBy) {
  if (!sortBy) return results;

  const [property, order] = sortBy.split('.');
  results.sort((a, b) => {
    let propA = property === 'release_date' || property === 'first_air_date' ? new Date(a[property]) : a[property];
    let propB = property === 'release_date' || property === 'first_air_date' ? new Date(b[property]) : b[property];

    if (order === 'asc') {
      return propA > propB ? 1 : propA < propB ? -1 : 0;
    } else {
      return propA < propB ? 1 : propA > propB ? -1 : 0;
    }
  });
  return results;
}

async function showResults(category) {
  showSpinner();
  localStorage.setItem('selectedCategory', category);
  currentCategory = category;

  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('search_query');
  let searchQuery = urlQuery || localStorage.getItem('searchQuery') || '';
  if (urlQuery) {
    localStorage.setItem('searchQuery', urlQuery);
  }

  document.getElementById('search-results-label').textContent = `Search Results for "${searchQuery}"`;

  const code = getMovieCode();
  const baseFetchUrl = `https://${getMovieVerseData()}/3`;
  let url = `${baseFetchUrl}/search/${category}` + `?${generateMovieNames()}${code}` + `&query=${encodeURIComponent(searchQuery)}`;

  let sortValue = '';

  if (category === 'movie') {
    sortValue = document.getElementById('sort-movie').value;
  } else if (category === 'tv') {
    sortValue = document.getElementById('sort-tv').value;
  } else if (category === 'person') {
    sortValue = document.getElementById('sort-people').value;
  }

  try {
    const response = await fetch(url);
    let data = await response.json();

    if (category === 'movie') {
      const genre = document.getElementById('genre-filter').value;
      const year = category === 'movie' ? document.getElementById('year-filter').value : document.getElementById('year-filter').value;
      const rating = parseFloat(document.getElementById('rating-filter').value);
      const language = document.getElementById('language-filter').value;

      data.results = data.results.filter(item => {
        const itemYear = category === 'movie' ? item.release_date?.substring(0, 4) : item.first_air_date?.substring(0, 4);
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
    } else if (category === 'person') {
      const profession = document.getElementById('profession-filter').value;
      const gender = document.getElementById('gender-filter').value;

      if (profession) {
        data.results = data.results.filter(
          person => person.known_for_department && person.known_for_department.toLowerCase() === profession.toLowerCase()
        );
      }

      if (gender) {
        data.results = data.results.filter(person => person.gender.toString() === gender);
      }

      const popularity = parseFloat(document.getElementById('popularity-filter').value);
      if (!isNaN(popularity) && popularity > 0) {
        data.results = data.results.filter(person => person.popularity >= popularity);
      }

      data.results.sort((a, b) => b.popularity - a.popularity);

      const personDetailsPromises = data.results.map(async person => {
        const personDetailsUrl = `https://${getMovieVerseData()}/3/person/${person.id}?${generateMovieNames()}${code}`;
        const personResponse = await fetch(personDetailsUrl);
        const personDetails = await personResponse.json();
        person.biography = personDetails.biography || 'Click to view the details of this person.';
        return person;
      });

      data.results = await Promise.all(personDetailsPromises);
    } else if (category === 'tv') {
      const genre = document.getElementById('genre-tv-filter').value;
      const year = document.getElementById('year-tv-filter').value;
      const rating = parseFloat(document.getElementById('rating-tv-filter').value);
      const language = document.getElementById('language-tv-filter').value;

      data.results = data.results.filter(item => {
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

    if ((category === 'movie' && movieSortChanged) || (category === 'tv' && tvSortChanged) || (category === 'person' && peopleSortChanged)) {
      data.results = sortResults(data.results, sortValue);
    }

    displayResults(data.results, category, searchQuery);
  } catch (error) {
    console.log('Error fetching search results:', error);
  } finally {
    hideSpinner();
  }
}

document.querySelector('button[onclick="showResults(\'movie\')"]').addEventListener('click', function () {
  showResults('movie');
  localStorage.setItem('selectedCategory', 'movie');
  updateCategoryButtonStyles();
});

document.querySelector('button[onclick="showResults(\'tv\')"]').addEventListener('click', function () {
  showResults('tv');
  localStorage.setItem('selectedCategory', 'tv');
  updateCategoryButtonStyles();
});

document.querySelector('button[onclick="showResults(\'person\')"]').addEventListener('click', function () {
  showResults('person');
  localStorage.setItem('selectedCategory', 'person');
  updateCategoryButtonStyles();
});

function updateCategoryButtonStyles(selectedCategory) {
  const movieBtn = document.querySelector('[data-category="movie"]');
  const tvBtn = document.querySelector('[data-category="tv"]');
  const peopleBtn = document.querySelector('[data-category="person"]');

  movieBtn.style.backgroundColor = '';
  tvBtn.style.backgroundColor = '';
  peopleBtn.style.backgroundColor = '';

  if (selectedCategory === 'movie') {
    movieBtn.style.backgroundColor = '#ff8623';
  } else if (selectedCategory === 'tv') {
    tvBtn.style.backgroundColor = '#ff8623';
  } else if (selectedCategory === 'person') {
    peopleBtn.style.backgroundColor = '#ff8623';
  }
}

function displayResults(results, category, searchTerm) {
  const container = document.getElementById('movie-match-container1');
  container.innerHTML = '';

  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  if (results.length === 0) {
    container.innerHTML = `<p>No results found for "${searchTerm}" in the ${capitalizedCategory} category or no results with the specified filters found. Please try again with a different query or change your filters.</p>`;
    container.style.height = '800px';
    return;
  }

  showMovies(results, container, category);
}

const main = document.getElementById('movie-match-container1');

async function getAdditionalImages(itemId, category) {
  let endpoint;
  if (category === 'movie') {
    endpoint = `https://${getMovieVerseData()}/3/movie/${itemId}/images?${generateMovieNames()}${getMovieCode()}`;
  } else if (category === 'person') {
    endpoint = `https://${getMovieVerseData()}/3/person/${itemId}/images?${generateMovieNames()}${getMovieCode()}`;
  } else if (category === 'tv') {
    endpoint = `https://${getMovieVerseData()}/3/tv/${itemId}/images?${generateMovieNames()}${getMovieCode()}`;
  }

  const response = await fetch(endpoint);
  const data = await response.json();
  return data.profiles ? data.profiles.map(image => image.file_path) : data.posters.map(image => image.file_path);
}

function rotateImages(imageElements, interval = 3000) {
  const uniqueImageElements = Array.from(imageElements).filter((el, index, self) => index === self.findIndex(e => e.src === el.src));

  if (uniqueImageElements.length <= 1) return;

  let currentIndex = 0;
  uniqueImageElements[currentIndex].style.opacity = '1';

  setTimeout(() => {
    setInterval(() => {
      uniqueImageElements[currentIndex].style.opacity = '0';
      currentIndex = (currentIndex + 1) % uniqueImageElements.length;
      uniqueImageElements[currentIndex].style.opacity = '1';
    }, interval);
  }, 0);
}

function isSpotlightMode() {
  return true;
}

function getSpotlightTrack(mainElement) {
  return mainElement.querySelector('.spotlight-track') || mainElement;
}

function getSpotlightCards(mainElement) {
  const track = getSpotlightTrack(mainElement);
  return Array.from(track.querySelectorAll('.movie'));
}

function ensureScrollProgress(mainElement) {
  let progress = mainElement.querySelector('.scroll-progress');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML =
      '<input class="scroll-progress-slider" type="range" min="0" max="100" step="0.1" value="0" aria-label="Carousel position" />';
    mainElement.appendChild(progress);
  }
  return progress;
}

function updateScrollProgress(mainElement) {
  const track = getSpotlightTrack(mainElement);
  const progress = mainElement.querySelector('.scroll-progress');
  const slider = progress ? progress.querySelector('.scroll-progress-slider') : null;
  if (!progress || !slider) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= 0) {
    progress.style.display = 'none';
    slider.value = '0';
    slider.style.setProperty('--progress', '0%');
    return;
  }

  progress.style.display = 'block';
  const percent = Math.min(100, Math.max(0, (track.scrollLeft / maxScroll) * 100));
  slider.value = `${percent}`;
  slider.style.setProperty('--progress', `${percent}%`);
}

function bindSpotlightProgressSlider(mainElement) {
  const progress = ensureScrollProgress(mainElement);
  const slider = progress.querySelector('.scroll-progress-slider');
  if (!slider) return;
  if (slider.dataset.spotlightListeners === 'true') return;

  const supportsPointer = typeof window !== 'undefined' && 'PointerEvent' in window;
  const supportsTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  const isTouchUi = supportsTouch && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 800px)').matches;
  const interactionTarget = progress;

  slider.style.pointerEvents = isTouchUi ? 'none' : '';

  const startScrub = () => {
    const track = getSpotlightTrack(mainElement);
    track.style.scrollSnapType = 'none';
    track.style.scrollBehavior = 'auto';
    mainElement.dataset.spotlightScrubbing = 'true';
  };

  const endScrub = () => {
    const track = getSpotlightTrack(mainElement);
    track.style.scrollSnapType = '';
    track.style.scrollBehavior = '';
    mainElement.dataset.spotlightScrubbing = 'false';
    requestAnimationFrame(() => {
      updateSpotlightState(mainElement);
    });
  };

  const handleInput = () => {
    const track = getSpotlightTrack(mainElement);
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const percent = Number(slider.value);
    const targetLeft = Math.min(maxScroll, Math.max(0, (percent / 100) * maxScroll));
    slider.style.setProperty('--progress', `${percent}%`);
    track.scrollLeft = targetLeft;
  };

  let sliderPointerDown = false;
  const setFromClientX = clientX => {
    const rect = slider.getBoundingClientRect();
    const clamped = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const percent = rect.width ? (clamped / rect.width) * 100 : 0;
    slider.value = String(percent);
    slider.style.setProperty('--progress', `${percent}%`);
    handleInput();
  };

  const onPointerDown = event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    startScrub();
    sliderPointerDown = true;
    setFromClientX(event.clientX);
    interactionTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  const onPointerMove = event => {
    if (!sliderPointerDown) return;
    setFromClientX(event.clientX);
    event.preventDefault();
  };

  const onPointerUp = event => {
    if (!sliderPointerDown) return;
    sliderPointerDown = false;
    interactionTarget.releasePointerCapture?.(event.pointerId);
    endScrub();
  };

  const onClick = event => {
    startScrub();
    setFromClientX(event.clientX);
    endScrub();
  };

  const onTouchStart = event => {
    if (!event.touches || !event.touches[0]) return;
    startScrub();
    sliderPointerDown = true;
    setFromClientX(event.touches[0].clientX);
    event.preventDefault();
  };

  const onTouchMove = event => {
    if (!sliderPointerDown || !event.touches || !event.touches[0]) return;
    setFromClientX(event.touches[0].clientX);
    event.preventDefault();
  };

  const onTouchEnd = () => {
    sliderPointerDown = false;
    endScrub();
  };

  slider.addEventListener('input', handleInput);
  slider.addEventListener('change', handleInput);
  interactionTarget.addEventListener('click', onClick);
  if (supportsPointer) {
    interactionTarget.addEventListener('pointerdown', onPointerDown);
    interactionTarget.addEventListener('pointermove', onPointerMove, { passive: false });
    interactionTarget.addEventListener('pointerup', onPointerUp);
    interactionTarget.addEventListener('pointercancel', onPointerUp);
  } else if (supportsTouch) {
    interactionTarget.addEventListener('touchstart', onTouchStart, { passive: false });
    interactionTarget.addEventListener('touchmove', onTouchMove, { passive: false });
    interactionTarget.addEventListener('touchend', onTouchEnd);
    interactionTarget.addEventListener('touchcancel', onTouchEnd);
  }
  slider.dataset.spotlightListeners = 'true';
}

function bindSpotlightDrag(mainElement) {
  const track = getSpotlightTrack(mainElement);
  if (!track || track.dataset.spotlightDragBound === 'true') return;

  let isPointerDown = false;
  let isDragging = false;
  let didCapture = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = 0;
  const dragThreshold = 6;

  const shouldIgnoreTarget = target => Boolean(target.closest('a, button, input, textarea, select, label'));

  const onPointerDown = event => {
    if (event.pointerType === 'touch') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (shouldIgnoreTarget(event.target)) return;
    isPointerDown = true;
    isDragging = false;
    moved = 0;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    didCapture = false;
  };

  const onPointerMove = event => {
    if (!isPointerDown) return;
    const dx = event.clientX - startX;
    moved = Math.abs(dx);
    if (!isDragging && moved > dragThreshold) {
      isDragging = true;
      track.classList.add('is-dragging');
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.style.userSelect = 'none';
      track.setPointerCapture?.(event.pointerId);
      didCapture = true;
    }
    if (isDragging) {
      event.preventDefault();
      track.scrollLeft = startScrollLeft - dx;
    }
  };

  const endDrag = event => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (didCapture) {
      track.releasePointerCapture?.(event.pointerId);
      didCapture = false;
    }
    if (isDragging) {
      track.classList.remove('is-dragging');
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';
      track.style.userSelect = '';
    }
    if (isDragging) {
      track.dataset.spotlightDragged = 'true';
      setTimeout(() => {
        track.dataset.spotlightDragged = 'false';
      }, 0);
    }
    isDragging = false;
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove, { passive: false });
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);
  track.addEventListener('dragstart', event => {
    if (event.target && event.target.closest('img')) {
      event.preventDefault();
    }
  });
  track.addEventListener(
    'click',
    event => {
      if (track.dataset.spotlightDragged === 'true') {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  track.dataset.spotlightDragBound = 'true';
}

function updateSpotlightNavVisibility(mainElement) {
  const track = getSpotlightTrack(mainElement);
  const maxScroll = track.scrollWidth - track.clientWidth;
  const shouldShow = maxScroll > 1;
  mainElement.querySelectorAll('.spotlight-nav').forEach(button => {
    button.style.display = shouldShow ? 'inline-flex' : 'none';
  });
}

function getSpotlightLayout(track, cards) {
  if (!cards.length) return 'center';
  const cardWidth = cards[0].getBoundingClientRect().width || 1;
  const gapValue = getComputedStyle(track).gap || getComputedStyle(track).columnGap;
  const gap = Number.parseFloat(gapValue) || 0;
  const slotWidth = cardWidth + gap;
  const visibleCount = Math.floor((track.clientWidth + gap) / slotWidth);
  return visibleCount >= 2 ? 'left' : 'center';
}

function ensureSpotlightTrack(mainElement) {
  let track = mainElement.querySelector('.spotlight-track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'spotlight-track';
    const cards = Array.from(mainElement.querySelectorAll('.movie'));
    cards.forEach(card => track.appendChild(card));
    mainElement.appendChild(track);
  }
  return track;
}

function teardownSpotlightTrack(mainElement) {
  const track = mainElement.querySelector('.spotlight-track');
  if (!track) return;
  Array.from(track.children).forEach(child => mainElement.appendChild(child));
  track.remove();
}

function updateSpotlightState(mainElement) {
  const cards = getSpotlightCards(mainElement);
  if (!cards.length) return;
  if (mainElement.dataset.spotlightScrubbing === 'true') return;

  const track = getSpotlightTrack(mainElement);
  const trackRect = track.getBoundingClientRect();
  const layout = getSpotlightLayout(track, cards);
  const containerCenter = trackRect.left + trackRect.width / 2;
  const containerLeft = trackRect.left;
  let activeIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  if (layout === 'left') {
    cards.forEach(card => {
      card.classList.remove('spotlight-active', 'spotlight-dim');
    });
    mainElement.dataset.spotlightIndex = '0';
    return;
  }

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const distance = layout === 'left' ? Math.abs(rect.left - containerLeft) : Math.abs(rect.left + rect.width / 2 - containerCenter);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      activeIndex = index;
    }
  });

  cards.forEach((card, index) => {
    card.classList.toggle('spotlight-active', index === activeIndex);
    card.classList.toggle('spotlight-dim', index !== activeIndex);
  });

  mainElement.dataset.spotlightIndex = String(activeIndex);
}

function scrollSpotlightBy(mainElement, delta) {
  const cards = getSpotlightCards(mainElement);
  if (!cards.length) return;

  const track = getSpotlightTrack(mainElement);
  const layout = getSpotlightLayout(track, cards);
  let currentIndex = Number(mainElement.dataset.spotlightIndex || 0);
  if (layout === 'left') {
    const gapValue = getComputedStyle(track).gap || getComputedStyle(track).columnGap;
    const gap = Number.parseFloat(gapValue) || 0;
    currentIndex = Math.round(track.scrollLeft / (cards[0].offsetWidth + gap));
  }
  let nextIndex = currentIndex + delta;
  if (nextIndex >= cards.length) {
    nextIndex = 0;
  } else if (nextIndex < 0) {
    nextIndex = cards.length - 1;
  }
  const target = cards[nextIndex];
  if (target) {
    const targetLeft = layout === 'left' ? target.offsetLeft : target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
    track.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }
}

function initSpotlightCarousel(mainElement) {
  if (!mainElement) return;

  const cards = getSpotlightCards(mainElement);
  const existingTrack = mainElement.querySelector('.spotlight-track');
  const storedScrollLeft = Number(mainElement.dataset.spotlightScrollLeft || (existingTrack && existingTrack.dataset.spotlightScrollLeft) || 0);
  const storedIndex = Number(mainElement.dataset.spotlightIndex || 0);
  const hasStoredScroll = mainElement.dataset.spotlightHasScroll === 'true';
  if (!isSpotlightMode() || cards.length === 0) {
    mainElement.classList.remove('spotlight-carousel');
    cards.forEach(card => card.classList.remove('spotlight-active', 'spotlight-dim'));
    mainElement.querySelectorAll('.spotlight-nav').forEach(btn => btn.remove());
    teardownSpotlightTrack(mainElement);
    const progress = mainElement.querySelector('.scroll-progress');
    if (progress) {
      progress.remove();
    }
    return;
  }

  mainElement.classList.add('spotlight-carousel');
  const track = ensureSpotlightTrack(mainElement);
  ensureScrollProgress(mainElement);
  bindSpotlightProgressSlider(mainElement);
  bindSpotlightDrag(mainElement);
  const layout = getSpotlightLayout(track, cards);
  mainElement.classList.toggle('spotlight-multi', layout === 'left');

  if (!track.dataset.spotlightBound) {
    let scrollTicking = false;
    track.addEventListener(
      'scroll',
      () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
          track.dataset.spotlightScrollLeft = String(track.scrollLeft);
          mainElement.dataset.spotlightScrollLeft = String(track.scrollLeft);
          mainElement.dataset.spotlightHasScroll = 'true';
          updateSpotlightState(mainElement);
          updateScrollProgress(mainElement);
          updateSpotlightNavVisibility(mainElement);
          scrollTicking = false;
        });
      },
      { passive: true }
    );
    track.dataset.spotlightBound = 'true';
  }

  if (!mainElement.querySelector('.spotlight-prev')) {
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'spotlight-nav spotlight-prev';
    prevButton.setAttribute('aria-label', 'Previous card');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', () => scrollSpotlightBy(mainElement, -1));
    mainElement.appendChild(prevButton);
  }

  if (!mainElement.querySelector('.spotlight-next')) {
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'spotlight-nav spotlight-next';
    nextButton.setAttribute('aria-label', 'Next card');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', () => scrollSpotlightBy(mainElement, 1));
    mainElement.appendChild(nextButton);
  }

  if (cards.length) {
    let targetLeft = null;
    if (hasStoredScroll) {
      if (layout === 'left') {
        targetLeft = storedScrollLeft;
      } else if (Number.isFinite(storedIndex) && cards[storedIndex]) {
        targetLeft = cards[storedIndex].offsetLeft - (track.clientWidth - cards[storedIndex].clientWidth) / 2;
      } else {
        targetLeft = storedScrollLeft;
      }
    } else {
      const firstCard = cards[0];
      targetLeft = layout === 'left' ? 0 : firstCard.offsetLeft - (track.clientWidth - firstCard.clientWidth) / 2;
    }
    if (targetLeft !== null) {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const clamped = Math.min(maxScroll, Math.max(0, targetLeft));
      track.scrollLeft = clamped;
      track.dataset.spotlightScrollLeft = String(track.scrollLeft);
      mainElement.dataset.spotlightScrollLeft = String(track.scrollLeft);
    }
  }

  updateSpotlightState(mainElement);
  updateScrollProgress(mainElement);
  updateSpotlightNavVisibility(mainElement);
}

if (!window.__spotlightResizeBound) {
  window.__spotlightResizeBound = true;
  window.addEventListener('resize', () => {
    document.querySelectorAll('.spotlight-carousel').forEach(carousel => {
      initSpotlightCarousel(carousel);
    });
  });
}

async function showMovies(items, container, category) {
  container.innerHTML = '';

  // Inject CSS for sliding-up animation if it doesn't already exist
  const style = document.createElement('style');
  style.innerHTML = `
    .movie {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 1s ease, transform 1s ease;
    }
    .movie.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  items.forEach(async item => {
    const hasVoteAverage = typeof item.vote_average === 'number';
    const isPerson = !hasVoteAverage;
    const isMovie = item.title && hasVoteAverage;
    const isTvSeries = item.name && hasVoteAverage && category === 'tv';

    let title = item.title || item.name || 'N/A';
    const words = title.split(' ');
    if (words.length >= 8) {
      words[7] = '...';
      title = words.slice(0, 8).join(' ');
    }

    let overview = item.overview || 'Click to view the details of this movie/TV series.';
    const biography = item.biography || 'Click to view the details of this person.';
    if (overview === '') {
      overview = 'Click to view the details of this movie/TV series.';
    }

    const { id, profile_path, poster_path } = item;
    const imagePath = profile_path || poster_path ? IMGPATH + (profile_path || poster_path) : null;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.style.zIndex = 2;

    let movieContentHTML = `<div class="image-container" style="text-align: center;">`;

    const fallbackHTML =
      '<div style="color: inherit; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #333;">Image Not Available</div>';
    const fallbackOnError =
      "this.onerror=null; var p=this.parentElement; p.innerHTML=''; p.style.display='flex'; p.style.alignItems='center'; p.style.justifyContent='center'; p.style.backgroundColor='#333'; p.style.color='inherit'; p.style.fontWeight='bold'; p.textContent='Image Not Available';";

    if (imagePath) {
      movieContentHTML += `<div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden; background-color: #333;">`;
      movieContentHTML += `<img data-src="${imagePath}" alt="${title}" style="cursor: pointer; max-width: 100%; position: absolute; top: 0; left: 0; transition: opacity 1s ease-in-out; opacity: 1;" onerror="${fallbackOnError}">`;
      movieContentHTML += `</div>`;
    } else {
      movieContentHTML += `<div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden; background-color: #333;">${fallbackHTML}</div>`;
    }

    movieContentHTML += `</div><div class="movie-info" style="display: flex; align-items: flex-start; cursor: pointer;">`;
    movieContentHTML += `<h3 style="text-align: left; flex-grow: 1; margin: 0; margin-right: 10px">${title}</h3>`;

    if ((isMovie || isTvSeries) && hasVoteAverage) {
      const voteAverage = item.vote_average.toFixed(1);
      movieContentHTML += `<span class="${getClassByRate(item.vote_average)}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; margin-left: auto;">${voteAverage}</span>`;
    }

    movieContentHTML += `</div>`;

    if (isPerson) {
      const roleOverview = item.known_for_department === 'Directing' ? 'Director Overview' : 'Actor Overview';
      movieContentHTML += `<div class="overview" style="cursor: pointer;"><h4>${roleOverview}: </h4>${biography}</div>`;
    } else if (isTvSeries) {
      movieContentHTML += `<div class="overview" style="cursor: pointer;"><h4>TV Series Overview: </h4>${overview}</div>`;
    } else {
      movieContentHTML += `<div class="overview" style="cursor: pointer;"><h4>Movie Overview: </h4>${overview}</div>`;
    }

    movieEl.innerHTML = movieContentHTML;

    movieEl.addEventListener('click', async () => {
      if (isPerson) {
        try {
          const personDetailsUrl = `https://${getMovieVerseData()}/3/person/${id}?${generateMovieNames()}${getMovieCode()}`;
          const response = await fetch(personDetailsUrl);
          const personDetails = await response.json();
          if (personDetails.known_for_department === 'Directing') {
            const directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
            const uniqueDirectorsViewed = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];

            if (!uniqueDirectorsViewed.includes(id)) {
              uniqueDirectorsViewed.push(id);
              localStorage.setItem('uniqueDirectorsViewed', JSON.stringify(uniqueDirectorsViewed));
            }

            if (directorVisits[id]) {
              directorVisits[id].count++;
            } else {
              directorVisits[id] = {
                count: 1,
                name: personDetails.name || 'Unknown',
              };
            }

            localStorage.setItem('directorVisits', JSON.stringify(directorVisits));
            localStorage.setItem('selectedDirectorId', id);
            window.location.href = 'director-details.html?' + id;
          } else {
            const actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
            const uniqueActorsViewed = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];

            if (!uniqueActorsViewed.includes(id)) {
              uniqueActorsViewed.push(id);
              localStorage.setItem('uniqueActorsViewed', JSON.stringify(uniqueActorsViewed));
            }

            if (actorVisits[id]) {
              actorVisits[id].count++;
            } else {
              actorVisits[id] = {
                count: 1,
                name: personDetails.name || 'Unknown',
              };
            }

            localStorage.setItem('actorVisits', JSON.stringify(actorVisits));
            localStorage.setItem('selectedActorId', id);
            window.location.href = 'actor-details.html?' + id;
          }
        } catch (error) {
          console.log('Error fetching person details:', error);
        }
      } else if (isMovie) {
        // Navigate to movie details page with movieId as a query parameter
        window.location.href = `movie-details.html?movieId=${id}`;

        // Update movie visit count
        updateMovieVisitCount(id, title);
      } else if (isTvSeries) {
        // Navigate to TV details page with tvSeriesId as a query parameter
        window.location.href = `tv-details.html?tvSeriesId=${id}`;

        // Update tracking and analytics functions
        updateMovieVisitCount(id, title);
      }
    });

    container.appendChild(movieEl);

    const additionalImages = await getAdditionalImages(id, category);
    let allImages = [profile_path || poster_path, ...additionalImages].filter(Boolean);
    allImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 10);

    if (allImages.length > 1) {
      const imageContainer = movieEl.querySelector('.movie-images');
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              observer.unobserve(img);

              allImages.forEach((image, index) => {
                if (index === 0) return;
                const img = new Image();
                img.src = `${IMGPATH + image}`;
                img.style.position = 'absolute';
                img.style.top = 0;
                img.style.left = 0;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.transition = 'opacity 1s ease-in-out';
                img.style.opacity = 0;
                imageContainer.appendChild(img);
              });
              rotateImages(Array.from(imageContainer.children), 3000);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1,
        }
      );

      const img = movieEl.querySelector('img');
      observer.observe(img);
    }

    // Slide-up animation observer
    const slideObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            slideObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );
    slideObserver.observe(movieEl);
  });

  requestAnimationFrame(() => initSpotlightCarousel(container));
}

function handleDirectorClick(directorId, directorName) {
  updateUniqueDirectorsViewed(directorId);
  updateDirectorVisitCount(directorId, directorName);
  localStorage.setItem('selectedDirectorId', directorId);
  document.title = `${directorName} - Director's Details`;
  window.location.href = 'director-details.html';
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

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

function handleSearch() {
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.reload();
}

function updateBrowserURL(title) {
  const nameSlug = createNameSlug(title);
  const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?search_query=' + nameSlug;
  window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '');
}
