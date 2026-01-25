const main = document.getElementById('movie-match-form');
const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');
const searchTitle = document.getElementById('search-title');
const otherTitle = document.getElementById('other1');

function showSpinner() {
  const modal = document.getElementById('myModal');
  if (modal) {
    modal.classList.add('modal-visible');
  }
}

function hideSpinner() {
  const modal = document.getElementById('myModal');
  if (modal) {
    modal.classList.remove('modal-visible');
  }
}

document.getElementById('movie-match-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const mood = document.getElementById('mood').value;
  const genre = document.getElementById('genre').value;
  const period = document.getElementById('period').value;
  findMovieMatch(mood, genre, period);
});

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

async function showMovieOfTheDay() {
  const year = new Date().getFullYear();
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      // Redirect to movie details page with movieId in the URL
      window.location.href = `https://movie-verse.com/MovieVerse-Frontend/html/movie-details.html?movieId=${randomMovie.id}`;
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    console.log('Error fetching movie:', error);
    fallbackMovieSelection();
  }
}

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340,
    424, 98,
  ];
  const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];

  // Redirect with movieId in URL
  window.location.href = `https://movie-verse.com/MovieVerse-Frontend/html/movie-details.html?movieId=${randomFallbackMovie}`;
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
  } catch (error) {
    console.log('Error fetching genre map:', error);
  }
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
  if (!movieVisits[movieId]) {
    movieVisits[movieId] = { count: 0, title: movieTitle };
  }

  movieVisits[movieId].count += 1;
  localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
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

async function findMovieMatch(mood, genre, period) {
  showSpinner();
  try {
    const periodRanges = {
      '2020s': { start: '2020-01-01', end: '2029-12-31' },
      '2010s': { start: '2010-01-01', end: '2019-12-31' },
      '2000s': { start: '2000-01-01', end: '2009-12-31' },
      '90s': { start: '1990-01-01', end: '1999-12-31' },
      '80s': { start: '1980-01-01', end: '1989-12-31' },
      '70s': { start: '1970-01-01', end: '1979-12-31' },
      '60s': { start: '1960-01-01', end: '1969-12-31' },
      '50s': { start: '1950-01-01', end: '1959-12-31' },
    };

    const moodKeywordQueries = {
      happy: ['feel good', 'uplifting', 'heartwarming', 'feel-good'],
      sad: ['sad', 'tragedy', 'tearjerker', 'grief'],
      angry: ['horror', 'terror', 'slasher', 'haunted'],
      adventurous: ['adventure', 'quest', 'journey'],
      romantic: ['love', 'romance', 'relationship'],
      thoughtful: ['mind-bending', 'philosophy', 'existential', 'thought-provoking'],
      inspiring: ['inspiring', 'inspiration', 'triumph', 'overcoming'],
      cozy: ['cozy', 'comfort', 'small town', 'holiday'],
      tense: ['suspense', 'tense', 'edge of your seat', 'thriller'],
      quirky: ['quirky', 'offbeat', 'eccentric'],
    };

    const genreNameMap = {
      action: { movie: 'Action', tv: 'Action & Adventure' },
      comedy: { movie: 'Comedy', tv: 'Comedy' },
      drama: { movie: 'Drama', tv: 'Drama' },
      'sci-fi': { movie: 'Science Fiction', tv: 'Sci-Fi & Fantasy' },
      romance: { movie: 'Romance', tv: 'Romance' },
      thriller: { movie: 'Thriller', tv: 'Mystery' },
      horror: { movie: 'Horror', tv: 'Mystery' },
      fantasy: { movie: 'Fantasy', tv: 'Sci-Fi & Fantasy' },
      mystery: { movie: 'Mystery', tv: 'Mystery' },
      crime: { movie: 'Crime', tv: 'Crime' },
      animation: { movie: 'Animation', tv: 'Animation' },
      family: { movie: 'Family', tv: 'Family' },
      documentary: { movie: 'Documentary', tv: 'Documentary' },
    };

    const fallbackGenreIds = {
      movie: {
        action: 28,
        comedy: 35,
        drama: 18,
        'sci-fi': 878,
        romance: 10749,
        thriller: 53,
        horror: 27,
        fantasy: 14,
        mystery: 9648,
        crime: 80,
        animation: 16,
        family: 10751,
        documentary: 99,
      },
      tv: {
        action: 10759,
        comedy: 35,
        drama: 18,
        'sci-fi': 10765,
        romance: 10749,
        thriller: 9648,
        horror: 9648,
        fantasy: 10765,
        mystery: 9648,
        crime: 80,
        animation: 16,
        family: 10751,
        documentary: 99,
      },
    };

    const moodPreferences = {
      happy: { sortBy: 'popularity.desc', minVotes: 50 },
      sad: { sortBy: 'vote_average.desc', minVotes: 40 },
      angry: { sortBy: 'popularity.desc', minVotes: 30 },
      adventurous: { sortBy: 'popularity.desc', minVotes: 60 },
      romantic: { sortBy: 'vote_average.desc', minVotes: 30 },
      thoughtful: { sortBy: 'vote_average.desc', minVotes: 80 },
      inspiring: { sortBy: 'vote_average.desc', minVotes: 60 },
      cozy: { sortBy: 'popularity.desc', minVotes: 20 },
      tense: { sortBy: 'popularity.desc', minVotes: 50 },
      quirky: { sortBy: 'popularity.desc', minVotes: 20 },
    };

    const range = periodRanges[period];
    if (!range) {
      alert('Please pick a valid time period.');
      return;
    }
    if (!genreNameMap[genre]) {
      alert('Please pick a valid genre.');
      return;
    }

    async function fetchGenreMapByType(type) {
      const storageKey = type == 'tv' ? 'tvGenreMap' : 'genreMap';
      const url = `https://${getMovieVerseData()}/3/genre/${type}/list?${generateMovieNames()}${getMovieCode()}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const map = {};
        (data.genres || []).forEach(entry => {
          if (entry && entry.name) {
            map[entry.name.toLowerCase()] = entry.id;
          }
        });
        localStorage.setItem(storageKey, JSON.stringify(map));
        return map;
      } catch (error) {
        console.log('Error fetching genre map:', error);
        return null;
      }
    }

    async function getGenreId(type, genreKey) {
      const storageKey = type == 'tv' ? 'tvGenreMap' : 'genreMap';
      let map;
      try {
        map = JSON.parse(localStorage.getItem(storageKey) || 'null');
      } catch (error) {
        map = null;
      }
      if (!map || typeof map != 'object') {
        map = await fetchGenreMapByType(type);
      }
      const desiredName = (genreNameMap[genreKey] && genreNameMap[genreKey][type]) || genreKey;
      if (map && desiredName) {
        const id = map[String(desiredName).toLowerCase()];
        if (id) return id;
      }
      return fallbackGenreIds[type][genreKey];
    }

    async function fetchKeywordId(query) {
      const url = `https://${getMovieVerseData()}/3/search/keyword?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(query)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const first = (data.results || [])[0];
        return first ? first.id : null;
      } catch (error) {
        console.log('Keyword lookup failed:', error);
        return null;
      }
    }

    async function getMoodKeywordIds(selectedMood) {
      const queries = moodKeywordQueries[selectedMood] || [];
      const ids = [];
      for (const query of queries) {
        const id = await fetchKeywordId(query);
        if (id) {
          ids.push(id);
        }
        if (ids.length >= 2) {
          break;
        }
      }
      return Array.from(new Set(ids));
    }

    async function fetchDiscover(type, options) {
      const params = new URLSearchParams();
      params.set('sort_by', options.sortBy || 'vote_average.desc');
      params.set('vote_count.gte', String(options.minVotes || 80));
      params.set('page', String(options.page || 1));
      params.set('include_adult', 'false');

      if (type == 'movie') {
        params.set('primary_release_date.gte', range.start);
        params.set('primary_release_date.lte', range.end);
      } else {
        params.set('first_air_date.gte', range.start);
        params.set('first_air_date.lte', range.end);
      }

      if (options.genreId) {
        params.set('with_genres', String(options.genreId));
      }
      if (options.keywordIds && options.keywordIds.length > 0) {
        params.set('with_keywords', options.keywordIds.join('|'));
      }
      if (options.excludeGenreIds && options.excludeGenreIds.length > 0) {
        params.set('without_genres', options.excludeGenreIds.join(','));
      }

      const url = `https://${getMovieVerseData()}/3/discover/${type}?${generateMovieNames()}${getMovieCode()}&${params.toString()}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data.results) ? data.results : [];
      } catch (error) {
        console.log('Discover fetch failed:', error);
        return [];
      }
    }

    const [movieGenreId, tvGenreId] = await Promise.all([getGenreId('movie', genre), getGenreId('tv', genre)]);
    if (!movieGenreId && !tvGenreId) {
      alert('We could not resolve that genre yet. Try another genre.');
      return;
    }
    const keywordIds = await getMoodKeywordIds(mood);
    const moodPref = moodPreferences[mood] || { sortBy: 'popularity.desc', minVotes: 40 };
    const excludeAnimation = genre !== 'animation' ? [16] : [];

    const attempts = [
      { useKeywords: true, minVotes: moodPref.minVotes, sortBy: moodPref.sortBy },
      { useKeywords: false, minVotes: moodPref.minVotes, sortBy: moodPref.sortBy },
      { useKeywords: false, minVotes: 15, sortBy: 'popularity.desc' },
    ];

    for (const attempt of attempts) {
      const [movieResults, tvResults] = await Promise.all([
        fetchDiscover('movie', {
          genreId: movieGenreId,
          keywordIds: attempt.useKeywords ? keywordIds : [],
          minVotes: attempt.minVotes,
          sortBy: attempt.sortBy,
          excludeGenreIds: excludeAnimation,
        }),
        fetchDiscover('tv', {
          genreId: tvGenreId,
          keywordIds: attempt.useKeywords ? keywordIds : [],
          minVotes: attempt.minVotes,
          sortBy: attempt.sortBy,
          excludeGenreIds: excludeAnimation,
        }),
      ]);

      const combined = [...movieResults.map(item => ({ ...item, mediaType: 'movie' })), ...tvResults.map(item => ({ ...item, mediaType: 'tv' }))];

      if (combined.length > 0) {
        const randomIndex = Math.floor(Math.random() * combined.length);
        const matched = combined[randomIndex];
        if (matched.mediaType === 'tv') {
          window.location.href = `tv-details.html?tvSeriesId=${matched.id}`;
        } else {
          window.location.href = `movie-details.html?movieId=${matched.id}`;
        }
        return;
      }
    }

    alert('No match found yet. Try a different mood, genre, or time period.');
  } catch (error) {
    console.log('Movie match failed:', error);
    alert('Something went wrong while finding a match. Please try again.');
  } finally {
    hideSpinner();
  }
}

const form = document.getElementById('form1');
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

form.addEventListener('submit', e => {
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
