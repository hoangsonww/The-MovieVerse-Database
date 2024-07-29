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

  const searchQuery = localStorage.getItem('searchQuery') || '';
  document.getElementById('search-results-label').textContent = `Search Results for "${searchQuery}"`;

  const code = getMovieCode();
  const baseApiUrl = `https://${getMovieVerseData()}/3`;
  let url = `${baseApiUrl}/search/${category}?${generateMovieNames()}${code}&query=${encodeURIComponent(searchQuery)}`;
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

function showMovies(items, container, category) {
  container.innerHTML = '';

  items.forEach(item => {
    const hasVoteAverage = typeof item.vote_average === 'number';
    const isPerson = !hasVoteAverage;
    const isMovie = item.title && hasVoteAverage;
    const isTvSeries = item.name && hasVoteAverage && category === 'tv';

    let title = item.title || item.name || 'N/A';
    const words = title.split(' ');

    if (words.length >= 9) {
      words[8] = '...';
      title = words.slice(0, 9).join(' ');
    }

    let overview = item.overview || 'No overview available.';
    const biography = item.biography || 'Click to view the details of this person.';

    if (overview === '') {
      overview = 'No overview available.';
    }

    const { id, profile_path, poster_path } = item;
    const imagePath = profile_path || poster_path ? IMGPATH + (profile_path || poster_path) : null;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.style.zIndex = 10000;

    let movieContentHTML = `<div class="image-container" style="text-align: center;">`;

    if (imagePath) {
      movieContentHTML += `<img src="${imagePath}" alt="${title}" style="cursor: pointer; max-width: 100%;" onError="this.parentElement.innerHTML = '<div style=\'text-align: center; padding: 20px;\'>Image Unavailable</div>';">`;
    } else {
      movieContentHTML += `<div style="text-align: center; padding: 20px;">Image Unavailable</div>`;
    }

    movieContentHTML += `</div><div class="movie-info" style="display: flex; justify-content: space-between; align-items: start; cursor: pointer;">`;
    movieContentHTML += `<h3 style="text-align: left; flex-grow: 1; margin: 0; margin-right: 10px">${title}</h3>`;

    if ((isMovie || isTvSeries) && hasVoteAverage) {
      const voteAverage = item.vote_average.toFixed(1);
      movieContentHTML += `<span class="${getClassByRate(item.vote_average)}">${voteAverage}</span>`;
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
        localStorage.setItem('selectedMovieId', id);
        window.location.href = 'movie-details.html?' + id;
        updateMovieVisitCount(id, title);
      } else if (isTvSeries) {
        localStorage.setItem('selectedTvSeriesId', id);
        window.location.href = 'tv-details.html?' + id;
        updateMovieVisitCount(id, title);
      }
    });

    container.appendChild(movieEl);
  });
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
