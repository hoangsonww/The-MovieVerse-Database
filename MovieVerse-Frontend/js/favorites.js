import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  writeBatch,
  deleteDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

let initialMoviesSelection = [];
let initialTVSeriesSelection = [];
const IMGPATH = `https://image.tmdb.org/t/p/w500`;

function translateFBC(value) {
  return atob(value);
}

function getFBConfig1() {
  const fbConfig1 = 'QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==';
  return translateFBC(fbConfig1);
}

function getFBConfig2() {
  const fbConfig2 = 'bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t';
  return translateFBC(fbConfig2);
}

function getFBConfig3() {
  const fbConfig3 = 'bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=';
  return translateFBC(fbConfig3);
}

function getFBConfig4() {
  const fbConfig4 = 'ODAyOTQzNzE4ODcx';
  return translateFBC(fbConfig4);
}

function getFBConfig5() {
  const fbConfig5 = 'MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=';
  return translateFBC(fbConfig5);
}

const firebaseConfig = {
  apiKey: getFBConfig1(),
  authDomain: getFBConfig2(),
  projectId: 'movieverse-app',
  storageBucket: getFBConfig3(),
  messagingSenderId: getFBConfig4(),
  appId: getFBConfig5(),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
  loadWatchLists();
});

const tvCode = {
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

function getMovieCode() {
  return atob(tvCode.part1) + atob(tvCode.part2) + atob(tvCode.part3);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

document.addEventListener('DOMContentLoaded', function () {
  adjustButtonMargin();
  document.getElementById('how-to-use-btn').addEventListener('click', function () {
    let howToUseSection = document.getElementById('how-to-use-section');
    if (howToUseSection.style.display === 'none') {
      howToUseSection.style.display = 'block';
      window.location.href = '#how-to-use-section';
      document.getElementById('how-to-use-btn').textContent = 'Hide Tutorial';
      document.getElementById('how-to-use-btn').style.marginBottom = '0';
    } else {
      howToUseSection.style.display = 'none';
      document.getElementById('how-to-use-btn').textContent = 'How to Use';
      document.getElementById('how-to-use-btn').style.marginBottom = '180px';
    }
  });
});

function adjustButtonMargin() {
  let howToUseSection = document.getElementById('how-to-use-section');
  if (howToUseSection.style.display === 'none' || !howToUseSection.style.display) {
    document.getElementById('how-to-use-btn').style.marginBottom = '200px';
  } else {
    document.getElementById('how-to-use-btn').style.marginBottom = '0';
  }
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

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
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
      // Redirect to movie details page with movieId in the URL
      window.location.href = `movie-details.html?movieId=${randomMovie.id}`;
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
  window.location.href = `movie-details.html?movieId=${randomFallbackMovie}`;
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  const closeButtons = document.querySelectorAll('.close-button');

  closeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const modalId = this.closest('.modal').id;
      closeModal(modalId);
    });
  });
});

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

document.getElementById('delete-watchlist-btn').addEventListener('click', () => openModal('delete-watchlist-modal'));

async function getMovieTitle(movieId) {
  const apiKey = `${getMovieCode()}`;
  const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${apiKey}`;

  try {
    const response = await fetch(url);
    const movie = await response.json();
    return movie.title;
  } catch (error) {
    return 'Unknown Movie';
  }
}

async function populateCreateModalWithFavorites() {
  try {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser') || '';

    if (!currentUserEmail) {
      const moviesFavorited = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      const favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];

      let container = document.getElementById('favorites-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'favorites-container';
        document.getElementById('create-watchlist-form').insertBefore(container, document.querySelector('button[type="submit"]'));
      } else {
        container.innerHTML = '';
      }

      let moviesLabel = document.createElement('label');
      moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
      container.appendChild(moviesLabel);

      let moviesContainer = document.createElement('div');
      moviesContainer.id = 'movies-container';
      moviesContainer.style.marginTop = '-20px';
      container.appendChild(moviesContainer);

      if (moviesFavorited.length === 0) {
        moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
      } else {
        for (const movieId of moviesFavorited) {
          const movieTitle = await getMovieTitle(movieId);
          appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies');
        }
      }

      let tvSeriesLabel = document.createElement('label');
      tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
      container.appendChild(tvSeriesLabel);

      let tvSeriesContainer = document.createElement('div');
      tvSeriesContainer.id = 'tvseries-container';
      tvSeriesContainer.style.marginTop = '-20px';
      container.appendChild(tvSeriesContainer);

      if (favoritesTVSeries.length === 0) {
        tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
      } else {
        for (const seriesId of favoritesTVSeries) {
          const seriesTitle = await getTVSeriesTitle(seriesId);
          appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries');
        }
      }
      return;
    }

    const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', currentUserEmail));
    const userSnapshot = await getDocs(usersRef);

    const createForm = document.getElementById('create-watchlist-form');

    let container = document.getElementById('favorites-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'favorites-container';
      createForm.insertBefore(container, createForm.querySelector('button[type="submit"]'));
    } else {
      container.innerHTML = '';
    }

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      const moviesFavorited = userData.favoritesMovies || [];
      const favoritesTVSeries = userData.favoritesTVSeries || [];

      let moviesLabel = document.createElement('label');
      moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
      container.appendChild(moviesLabel);

      let moviesContainer = document.createElement('div');
      moviesContainer.id = 'movies-container';
      moviesContainer.style.marginTop = '-20px';
      container.appendChild(moviesContainer);

      if (moviesFavorited.length === 0) {
        moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
      } else {
        for (const movieId of moviesFavorited) {
          const movieTitle = await getMovieTitle(movieId);
          appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies');
        }
      }

      let tvSeriesLabel = document.createElement('label');
      tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
      container.appendChild(tvSeriesLabel);

      let tvSeriesContainer = document.createElement('div');
      tvSeriesContainer.id = 'tvseries-container';
      tvSeriesContainer.style.marginTop = '-20px';
      container.appendChild(tvSeriesContainer);

      if (favoritesTVSeries.length === 0) {
        tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
      } else {
        for (const seriesId of favoritesTVSeries) {
          const seriesTitle = await getTVSeriesTitle(seriesId);
          appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries');
        }
      }
    } else {
      container.innerHTML = '<p style="text-align: center">No favorites found. Please add some favorites first.</p>';
    }
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for favorites.');
      const moviesFavorited = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      const favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];

      let container = document.getElementById('favorites-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'favorites-container';
        document.getElementById('create-watchlist-form').insertBefore(container, document.querySelector('button[type="submit"]'));
      } else {
        container.innerHTML = '';
      }

      let moviesLabel = document.createElement('label');
      moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
      container.appendChild(moviesLabel);

      let moviesContainer = document.createElement('div');
      moviesContainer.id = 'movies-container';
      moviesContainer.style.marginTop = '-20px';
      container.appendChild(moviesContainer);

      if (moviesFavorited.length === 0) {
        moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
      } else {
        for (const movieId of moviesFavorited) {
          const movieTitle = await getMovieTitle(movieId);
          appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies');
        }
      }

      let tvSeriesLabel = document.createElement('label');
      tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
      container.appendChild(tvSeriesLabel);

      let tvSeriesContainer = document.createElement('div');
      tvSeriesContainer.id = 'tvseries-container';
      tvSeriesContainer.style.marginTop = '-20px';
      container.appendChild(tvSeriesContainer);

      if (favoritesTVSeries.length === 0) {
        tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
      } else {
        for (const seriesId of favoritesTVSeries) {
          const seriesTitle = await getTVSeriesTitle(seriesId);
          appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries');
        }
      }
    }
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal('create-watchlist-modal');
    }
  });
}

document.getElementById('create-watchlist-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  showSpinner();

  const name = document.getElementById('new-watchlist-name').value.trim();
  const description = document.getElementById('new-watchlist-description').value;
  const selectedMovies = Array.from(document.querySelectorAll('#movies-container input:checked')).map(checkbox => checkbox.value);
  const selectedTVSeries = Array.from(document.querySelectorAll('#tvseries-container input:checked')).map(checkbox => checkbox.value);
  const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

  let isDuplicate = false;
  let maxOrder = 0;
  let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];

  try {
    if (currentUserEmail) {
      const q = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
      const querySnapshot = await getDocs(q);
      maxOrder = querySnapshot.docs.reduce((max, docSnapshot) => Math.max(max, docSnapshot.data().order || 0), 0);
      isDuplicate = querySnapshot.docs.some(doc => doc.data().name.toLowerCase() === name.toLowerCase());
    } else {
      isDuplicate = localWatchlists.some(watchlist => watchlist.name.toLowerCase() === name.toLowerCase());
    }

    if (isDuplicate) {
      alert('A watchlist with this name already exists. Please choose a different name.');
      hideSpinner();
      return;
    }

    if (currentUserEmail) {
      const newWatchlistRef = doc(collection(db, 'watchlists'));
      await setDoc(newWatchlistRef, {
        userEmail: currentUserEmail,
        name,
        description,
        movies: selectedMovies,
        tvSeries: selectedTVSeries,
        pinned: false,
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      });
    } else {
      localWatchlists.push({
        id: `local-${new Date().getTime()}`,
        userEmail: '',
        name,
        description,
        movies: selectedMovies,
        tvSeries: selectedTVSeries,
        pinned: false,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
    }
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for watchlists.');
      localWatchlists.push({
        id: `local-${new Date().getTime()}`,
        userEmail: '',
        name,
        description,
        movies: selectedMovies,
        tvSeries: selectedTVSeries,
        pinned: false,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
    } else {
      console.error('An error occurred while creating a watchlist:', error);
      alert('Failed to create the watchlist due to an error.');
    }
  }

  closeModal('create-watchlist-modal');
  loadWatchLists();
  hideSpinner();
  window.location.reload();
});

async function getTVSeriesTitle(seriesId) {
  const apiKey = `${getMovieCode()}`;
  const url = `https://${getMovieVerseData()}/3/tv/${seriesId}?${generateMovieNames()}${apiKey}`;

  try {
    const response = await fetch(url);
    const series = await response.json();
    return series.name;
  } catch (error) {
    return 'Unknown Series';
  }
}

function appendCheckbox(container, id, title, name, isChecked = false) {
  const item = document.createElement('div');
  item.classList.add('favorite-item');
  item.style.display = 'flex';
  item.style.alignItems = 'center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `${name}-${id}`;
  checkbox.value = id;
  checkbox.name = name;
  checkbox.checked = isChecked;

  const label = document.createElement('label');
  label.htmlFor = `${name}-${id}`;
  label.textContent = title;
  label.style.marginTop = '12px';
  label.style.marginLeft = '10px';

  item.appendChild(checkbox);
  item.appendChild(label);
  container.appendChild(item);
}

document.getElementById('create-watchlist-btn').addEventListener('click', function () {
  document.getElementById('create-watchlist-form').reset();
  populateCreateModalWithFavorites();
  openModal('create-watchlist-modal');
  updateWatchlistsCreated();
});

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

document.getElementById('edit-watchlist-btn').addEventListener('click', async function () {
  await populateEditModal();
  openModal('edit-watchlist-modal');
});

async function populateEditModal() {
  try {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    let watchlists = [];
    let moviesFavorited = [];
    let favoritesTVSeries = [];

    if (currentUserEmail) {
      const qWatchlists = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
      const qUsers = query(collection(db, 'MovieVerseUsers'), where('email', '==', currentUserEmail));

      const [watchlistsSnapshot, usersSnapshot] = await Promise.all([getDocs(qWatchlists), getDocs(qUsers)]);

      watchlists = watchlistsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data();
        moviesFavorited = userData.favoritesMovies || [];
        favoritesTVSeries = userData.favoritesTVSeries || [];
      }
    } else {
      watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      moviesFavorited = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
    }

    const editForm = document.getElementById('edit-watchlist-form');
    editForm.innerHTML = '';

    if (watchlists.length === 0) {
      const noWatchlistMsg = document.createElement('div');
      noWatchlistMsg.textContent = 'No Watch Lists Available for Edit';
      noWatchlistMsg.style.textAlign = 'center';
      noWatchlistMsg.style.marginTop = '30px';
      noWatchlistMsg.style.color = 'white';
      editForm.appendChild(noWatchlistMsg);
      return;
    }

    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Select A Watch List:';
    selectLabel.setAttribute('for', 'watchlist-select');
    editForm.appendChild(selectLabel);

    const select = document.createElement('select');
    select.id = 'watchlist-select';
    select.style.font = 'inherit';
    watchlists.forEach(watchlist => {
      const option = document.createElement('option');
      option.value = watchlist.id;
      option.textContent = watchlist.name;
      select.appendChild(option);
    });

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Watch List Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'edit-watchlist-name';
    nameInput.style.font = 'inherit';
    nameInput.placeholder = 'New Watchlist Name';

    const descLabel = document.createElement('label');
    descLabel.textContent = 'Description:';
    const descInput = document.createElement('textarea');
    descInput.id = 'edit-watchlist-description';
    descInput.style.font = 'inherit';
    descInput.placeholder = 'New Watchlist Description';

    const moviesContainer = document.createElement('div');
    moviesContainer.id = 'edit-movies-container';
    const moviesLabel = document.createElement('label');
    moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
    editForm.appendChild(select);
    editForm.appendChild(nameLabel);
    editForm.appendChild(nameInput);
    editForm.appendChild(descLabel);
    editForm.appendChild(descInput);
    editForm.appendChild(moviesLabel);
    editForm.appendChild(moviesContainer);

    const tvSeriesContainer = document.createElement('div');
    tvSeriesContainer.id = 'edit-tvseries-container';
    const tvSeriesLabel = document.createElement('label');
    tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
    tvSeriesLabel.style.marginTop = '20px';
    editForm.appendChild(tvSeriesLabel);
    editForm.appendChild(tvSeriesContainer);

    const updateForm = async watchlist => {
      nameInput.value = watchlist.name;
      descInput.value = watchlist.description;
      moviesContainer.innerHTML = '';
      tvSeriesContainer.innerHTML = '';

      initialMoviesSelection = watchlist.movies.slice();
      initialTVSeriesSelection = watchlist.tvSeries.slice();

      if (!moviesFavorited || moviesFavorited.length === 0) {
        moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
      } else {
        for (const movieId of moviesFavorited) {
          const movieTitle = await getMovieTitle(movieId);
          const isChecked = watchlist.movies.includes(movieId);
          appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies', isChecked);
        }
      }

      if (!favoritesTVSeries || favoritesTVSeries.length === 0) {
        tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
      } else {
        for (const seriesId of favoritesTVSeries) {
          const seriesTitle = await getTVSeriesTitle(seriesId);
          const isChecked = watchlist.tvSeries.includes(seriesId);
          appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries', isChecked);
        }
      }
    };

    select.addEventListener('change', function () {
      const selectedWatchlist = watchlists.find(watchlist => watchlist.id === this.value);
      updateForm(selectedWatchlist);
    });

    selectLabel.addEventListener('click', function () {
      updateForm(watchlists[select.value]);
    });

    if (watchlists.length > 0) {
      updateForm(watchlists[0]);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Changes';
    editForm.appendChild(submitButton);

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel Changes';
    cancelButton.style.marginTop = '20px';
    cancelButton.onclick = () => closeModal('edit-watchlist-modal');
    editForm.appendChild(cancelButton);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for watchlists.');
      let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      let moviesFavorited = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      let favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];

      const editForm = document.getElementById('edit-watchlist-form');
      editForm.innerHTML = '';

      if (watchlists.length === 0) {
        const noWatchlistMsg = document.createElement('div');
        noWatchlistMsg.textContent = 'No Watch Lists Available for Edit';
        noWatchlistMsg.style.textAlign = 'center';
        noWatchlistMsg.style.marginTop = '30px';
        noWatchlistMsg.style.color = 'white';
        editForm.appendChild(noWatchlistMsg);
        return;
      }

      const selectLabel = document.createElement('label');
      selectLabel.textContent = 'Select A Watch List:';
      selectLabel.setAttribute('for', 'watchlist-select');
      editForm.appendChild(selectLabel);

      const select = document.createElement('select');
      select.id = 'watchlist-select';
      select.style.font = 'inherit';
      watchlists.forEach(watchlist => {
        const option = document.createElement('option');
        option.value = watchlist.id;
        option.textContent = watchlist.name;
        select.appendChild(option);
      });

      const nameLabel = document.createElement('label');
      nameLabel.textContent = 'Watch List Name:';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'edit-watchlist-name';
      nameInput.style.font = 'inherit';
      nameInput.placeholder = 'New Watchlist Name';

      const descLabel = document.createElement('label');
      descLabel.textContent = 'Description:';
      const descInput = document.createElement('textarea');
      descInput.id = 'edit-watchlist-description';
      descInput.style.font = 'inherit';
      descInput.placeholder = 'New Watchlist Description';

      const moviesContainer = document.createElement('div');
      moviesContainer.id = 'edit-movies-container';
      const moviesLabel = document.createElement('label');
      moviesLabel.textContent = 'Select favorite movies to include in watchlist:';
      editForm.appendChild(select);
      editForm.appendChild(nameLabel);
      editForm.appendChild(nameInput);
      editForm.appendChild(descLabel);
      editForm.appendChild(descInput);
      editForm.appendChild(moviesLabel);
      editForm.appendChild(moviesContainer);

      const tvSeriesContainer = document.createElement('div');
      tvSeriesContainer.id = 'edit-tvseries-container';
      const tvSeriesLabel = document.createElement('label');
      tvSeriesLabel.textContent = 'Select favorite TV series to include in watchlist:';
      tvSeriesLabel.style.marginTop = '20px';
      editForm.appendChild(tvSeriesLabel);
      editForm.appendChild(tvSeriesContainer);

      const updateForm = async watchlist => {
        nameInput.value = watchlist.name;
        descInput.value = watchlist.description;
        moviesContainer.innerHTML = '';
        tvSeriesContainer.innerHTML = '';

        initialMoviesSelection = watchlist.movies.slice();
        initialTVSeriesSelection = watchlist.tvSeries.slice();

        if (!moviesFavorited || moviesFavorited.length === 0) {
          moviesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite Movies Added Yet.</p>';
        } else {
          for (const movieId of moviesFavorited) {
            const movieTitle = await getMovieTitle(movieId);
            const isChecked = watchlist.movies.includes(movieId);
            appendCheckbox(moviesContainer, movieId, movieTitle, 'favoritedMovies', isChecked);
          }
        }

        if (!favoritesTVSeries || favoritesTVSeries.length === 0) {
          tvSeriesContainer.innerHTML = '<p style="margin-top: 20px">No Favorite TV Series Added Yet.</p>';
        } else {
          for (const seriesId of favoritesTVSeries) {
            const seriesTitle = await getTVSeriesTitle(seriesId);
            const isChecked = watchlist.tvSeries.includes(seriesId);
            appendCheckbox(tvSeriesContainer, seriesId, seriesTitle, 'favoritedTVSeries', isChecked);
          }
        }
      };

      select.addEventListener('change', function () {
        const selectedWatchlist = watchlists.find(watchlist => watchlist.id === this.value);
        updateForm(selectedWatchlist);
      });

      selectLabel.addEventListener('click', function () {
        updateForm(watchlists[select.value]);
      });

      if (watchlists.length > 0) {
        updateForm(watchlists[0]);
      }

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Save Changes';
      editForm.appendChild(submitButton);

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'Cancel Changes';
      cancelButton.style.marginTop = '20px';
      cancelButton.onclick = () => closeModal('edit-watchlist-modal');
      editForm.appendChild(cancelButton);
    }
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal('edit-watchlist-modal');
    }
  });
}

document.getElementById('edit-watchlist-form').addEventListener('submit', async function (e) {
  try {
    showSpinner();
    e.preventDefault();

    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const selectedOption = document.getElementById('watchlist-select');
    const watchlistId = selectedOption.value;
    const newName = document.getElementById('edit-watchlist-name').value;
    const newDescription = document.getElementById('edit-watchlist-description').value;

    let selectedMovies;
    let selectedTVSeries;

    const currentMoviesSelection = Array.from(document.querySelectorAll('#edit-movies-container input[type="checkbox"]:checked')).map(
      checkbox => checkbox.value
    );
    const currentTVSeriesSelection = Array.from(document.querySelectorAll('#edit-tvseries-container input[type="checkbox"]:checked')).map(
      checkbox => checkbox.value
    );

    const moviesSelectionChanged = !(
      initialMoviesSelection.length === currentMoviesSelection.length && initialMoviesSelection.every(value => currentMoviesSelection.includes(value))
    );
    const tvSeriesSelectionChanged = !(
      initialTVSeriesSelection.length === currentTVSeriesSelection.length &&
      initialTVSeriesSelection.every(value => currentTVSeriesSelection.includes(value))
    );

    if (moviesSelectionChanged) {
      selectedMovies = currentMoviesSelection;
    } else {
      selectedMovies = initialMoviesSelection;
    }

    if (tvSeriesSelectionChanged) {
      selectedTVSeries = currentTVSeriesSelection;
    } else {
      selectedTVSeries = initialTVSeriesSelection;
    }

    if (currentUserEmail) {
      const q = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
      const querySnapshot = await getDocs(q);

      const watchlistRef = doc(db, 'watchlists', watchlistId);
      await updateDoc(watchlistRef, {
        name: newName,
        description: newDescription,
        movies: selectedMovies,
        tvSeries: selectedTVSeries,
      });
    } else {
      let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      let watchlistIndex = localWatchlists.findIndex(watchlist => watchlist.id === watchlistId);
      if (watchlistIndex !== -1) {
        localWatchlists[watchlistIndex] = {
          ...localWatchlists[watchlistIndex],
          name: newName,
          description: newDescription,
          movies: selectedMovies,
          tvSeries: selectedTVSeries,
        };
        localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
      }
    }

    closeModal('edit-watchlist-modal');
    loadWatchLists();
    hideSpinner();
    window.location.reload();
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      showSpinner();

      e.preventDefault();

      const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
      const selectedOption = document.getElementById('watchlist-select');
      const watchlistId = selectedOption.value;
      const newName = document.getElementById('edit-watchlist-name').value;
      const newDescription = document.getElementById('edit-watchlist-description').value;

      let selectedMovies;
      let selectedTVSeries;

      const currentMoviesSelection = Array.from(document.querySelectorAll('#edit-movies-container input[type="checkbox"]:checked')).map(
        checkbox => checkbox.value
      );
      const currentTVSeriesSelection = Array.from(document.querySelectorAll('#edit-tvseries-container input[type="checkbox"]:checked')).map(
        checkbox => checkbox.value
      );

      const moviesSelectionChanged = !(
        initialMoviesSelection.length === currentMoviesSelection.length &&
        initialMoviesSelection.every(value => currentMoviesSelection.includes(value))
      );
      const tvSeriesSelectionChanged = !(
        initialTVSeriesSelection.length === currentTVSeriesSelection.length &&
        initialTVSeriesSelection.every(value => currentTVSeriesSelection.includes(value))
      );

      if (moviesSelectionChanged) {
        selectedMovies = currentMoviesSelection;
      } else {
        selectedMovies = initialMoviesSelection;
      }

      if (tvSeriesSelectionChanged) {
        selectedTVSeries = currentTVSeriesSelection;
      } else {
        selectedTVSeries = initialTVSeriesSelection;
      }

      let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      let watchlistIndex = localWatchlists.findIndex(watchlist => watchlist.id === watchlistId);
      if (watchlistIndex !== -1) {
        localWatchlists[watchlistIndex] = {
          ...localWatchlists[watchlistIndex],
          name: newName,
          description: newDescription,
          movies: selectedMovies,
          tvSeries: selectedTVSeries,
        };
        localStorage.setItem('localWatchlists', JSON.stringify(localWatchlists));
      }

      closeModal('edit-watchlist-modal');
      loadWatchLists();
      hideSpinner();
      window.location.reload();
    }
  }
});

async function populateDeleteModal() {
  try {
    let currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    const deleteForm = document.getElementById('delete-watchlist-form');
    deleteForm.innerHTML = '';

    let watchlists = [];

    if (currentUserEmail) {
      const q = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
      const querySnapshot = await getDocs(q);
      watchlists = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
    }

    if (watchlists.length === 0) {
      deleteForm.innerHTML = '<p style="margin-top: 20px">No Watchlists Available to Delete.</p>';
      return;
    }

    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.id = 'delete-watchlist-checkboxes-container';

    watchlists.forEach(watchlist => {
      appendCheckbox(checkboxesContainer, watchlist.id, watchlist.name, 'watchlistToDelete');
    });

    deleteForm.appendChild(checkboxesContainer);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete Selected';
    deleteButton.onclick = deleteSelectedWatchlists;
    deleteForm.appendChild(deleteButton);
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      console.log('Firebase quota exceeded. Using localStorage for watchlists.');
      let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];

      const deleteForm = document.getElementById('delete-watchlist-form');
      deleteForm.innerHTML = '';

      if (watchlists.length === 0) {
        deleteForm.innerHTML = '<p style="margin-top: 20px">No Watchlists Available to Delete.</p>';
        return;
      }

      const checkboxesContainer = document.createElement('div');
      checkboxesContainer.id = 'delete-watchlist-checkboxes-container';

      watchlists.forEach(watchlist => {
        appendCheckbox(checkboxesContainer, watchlist.id, watchlist.name, 'watchlistToDelete');
      });

      deleteForm.appendChild(checkboxesContainer);

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete Selected';
      deleteButton.onclick = deleteSelectedWatchlists;
      deleteForm.appendChild(deleteButton);
    }
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal('delete-watchlist-modal');
    }
  });
}

async function deleteSelectedWatchlists() {
  try {
    showSpinner();
    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
    const selectedCheckboxes = document.querySelectorAll('#delete-watchlist-checkboxes-container input[type="checkbox"]:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

    if (currentUserEmail) {
      const q = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
      const querySnapshot = await getDocs(q);

      for (const id of selectedIds) {
        await deleteDoc(doc(db, 'watchlists', id));
      }
    } else {
      let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      watchlists = watchlists.filter(watchlist => !selectedIds.includes(watchlist.id));
      localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
    }

    closeModal('delete-watchlist-modal');
    loadWatchLists();
    hideSpinner();
    window.location.reload();
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      showSpinner();
      const selectedCheckboxes = document.querySelectorAll('#delete-watchlist-checkboxes-container input[type="checkbox"]:checked');
      const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

      let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      watchlists = watchlists.filter(watchlist => !selectedIds.includes(watchlist.id));
      localStorage.setItem('localWatchlists', JSON.stringify(watchlists));

      closeModal('delete-watchlist-modal');
      loadWatchLists();
      hideSpinner();
      window.location.reload();
    }
  }
}

document.getElementById('delete-watchlist-btn').addEventListener('click', populateDeleteModal);

async function fetchMovieDetails(movieId) {
  const code = `${getMovieCode()}`;
  const url = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;

  try {
    const response = await fetch(url);
    const movie = await response.json();
    const movieCard = await createMovieCard(movie);
    movieCard.setAttribute('data-movie-title', movie.title);
    return movieCard;
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error loading movie card. Please try refreshing the page.';
    return errorDiv;
  }
}

async function getAdditionalMovieImages(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${getMovieCode()}`);
  const data = await response.json();
  return data.posters.map(poster => poster.file_path);
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
    progress.innerHTML = '<div class="scroll-progress-bar"></div>';
    mainElement.appendChild(progress);
  }
  return progress;
}

function updateScrollProgress(mainElement) {
  const track = getSpotlightTrack(mainElement);
  const progress = mainElement.querySelector('.scroll-progress');
  const bar = progress ? progress.querySelector('.scroll-progress-bar') : null;
  if (!progress || !bar) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= 0) {
    progress.style.display = 'none';
    bar.style.width = '0%';
    return;
  }

  progress.style.display = 'block';
  const percent = Math.min(100, Math.max(0, (track.scrollLeft / maxScroll) * 100));
  bar.style.width = `${percent}%`;
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

async function createMovieCard(movie) {
  const movieEl = document.createElement('div');
  movieEl.classList.add('movie');
  movieEl.style.cursor = 'pointer';
  movieEl.style.zIndex = '1000';

  let movieTitle = movie.title;
  const words = movieTitle.split(' ');
  if (words.length >= 9) {
    words[8] = '...';
    movieTitle = words.slice(0, 9).join(' ');
  }

  const ratingClass = movie.vote_count === 0 ? 'unrated' : getClassByRate(movie.vote_average);
  const voteAvg = movie.vote_count === 0 ? 'Unrated' : movie.vote_average.toFixed(1);

  let overview = movie.overview;
  if (overview === '') {
    overview = 'No overview available.';
  }

  movieEl.innerHTML = `
                <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden;">
                  <img data-src="${IMGPATH + movie.poster_path}" alt="${movie.title}" style="cursor: pointer; position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: opacity 1s ease-in-out; opacity: 1;">
                </div>
                <div class="movie-info" style="display: flex; align-items: flex-start; cursor: pointer;">
                    <h3 style="text-align: left; margin-right: 10px; flex: 1 1 auto;">${movieTitle}</h3>
                    <span class="${ratingClass}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; margin-left: auto;">${voteAvg}</span>
                </div>
                <div class="overview" style="cursor: pointer;">
                    <h4>Movie Overview: </h4>
                    ${overview}
                </div>`;

  movieEl.addEventListener('click', () => {
    // Navigate to movie details page with movieId as a query parameter
    window.location.href = `movie-details.html?movieId=${movie.id}`;

    // Update analytics and tracking functions
    updateUniqueMoviesViewed(movie.id);
    updateFavoriteGenre(movie.genre_ids);
    updateMovieVisitCount(movie.id, movie.title);
  });

  const additionalImages = await getAdditionalMovieImages(movie.id);
  let allImages = [movie.poster_path, ...additionalImages].filter(Boolean);
  allImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 10);

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

  return movieEl;
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

const searchForm = document.getElementById('form');

// searchForm.addEventListener('submit', e => {
//   e.preventDefault();
//   const searchQuery = document.getElementById('search').value;
//   localStorage.setItem('searchQuery', searchQuery);
//   window.location.href = 'search.html';
// });

function handleSearch() {
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
}

async function loadWatchLists() {
  const displaySection = document.getElementById('watchlists-display-section');

  try {
    showSpinner();

    const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

    let watchlists = [];
    if (currentUserEmail) {
      try {
        // Attempt to fetch from Firebase first
        const q = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail));
        const querySnapshot = await getDocs(q);
        watchlists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Cache the results if successful
        localStorage.setItem('cachedWatchlists_' + currentUserEmail, JSON.stringify(watchlists));
      } catch (firebaseError) {
        console.warn('Firebase fetch failed, loading from cache:', firebaseError);

        // If Firebase fails, load from cache
        const cachedWatchlists = JSON.parse(localStorage.getItem('cachedWatchlists_' + currentUserEmail)) || [];
        watchlists = cachedWatchlists;
      }

      if (watchlists.length === 0) {
        displaySection.innerHTML = '<p style="text-align: center">No watch lists found. Click on "Create Watch Lists" to start adding movies.</p>';
      } else {
        displaySection.innerHTML = '';
        displaySection.innerHTML +=
          '<p id="watchlist-header" style="text-align: center; font-size: 20px; margin-top: 20px; color: #ff8623; cursor: pointer"><strong>Your Watch Lists</strong></p>';
        document.getElementById('watchlist-header').addEventListener('click', function (e) {
          e.preventDefault();
          document.getElementById('watchlist-header').scrollIntoView({ behavior: 'smooth' });
        });

        // Sort by order and pinned status
        watchlists.sort((a, b) => a.order - b.order);
        watchlists.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

        for (const watchlist of watchlists) {
          const watchlistDiv = await createWatchListDiv(watchlist);
          if (watchlist.pinned) {
            watchlistDiv.classList.add('pinned');
          }
          displaySection.appendChild(watchlistDiv);
          const watchlistCarousel = watchlistDiv.querySelector('.movies-container');
          if (watchlistCarousel) {
            requestAnimationFrame(() => initSpotlightCarousel(watchlistCarousel));
          }
        }
      }
    } else {
      // Handle the case where there is no signed-in user (local watchlists)
      let localWatchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
      if (localWatchlists.length === 0) {
        displaySection.innerHTML = '<p style="text-align: center">No watch lists found. Start by adding movies to your watchlist.</p>';
      } else {
        displaySection.innerHTML = '';
        displaySection.innerHTML += '<p style="text-align: center; margin-top: 20px; color: white"><strong>Your Watch Lists</strong></p>';
        localWatchlists.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
        for (const watchlist of localWatchlists) {
          const watchlistDiv = await createWatchListDiv(watchlist);
          if (watchlist.pinned) {
            watchlistDiv.classList.add('pinned');
          }
          displaySection.appendChild(watchlistDiv);
          const watchlistCarousel = watchlistDiv.querySelector('.movies-container');
          if (watchlistCarousel) {
            requestAnimationFrame(() => initSpotlightCarousel(watchlistCarousel));
          }
        }
      }
    }

    let favorites = [];
    let favoritesTVSeries = [];

    // Load favorites and favoritesTVSeries, first attempting from Firebase and then cache if needed
    if (currentUserEmail) {
      try {
        // Attempt to fetch favorites from Firebase
        const usersRef = query(collection(db, 'MovieVerseUsers'), where('email', '==', currentUserEmail));
        const userSnapshot = await getDocs(usersRef);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          favorites = userData.favoritesMovies || [];
          favoritesTVSeries = userData.favoritesTVSeries || [];

          // Cache the results if successful
          localStorage.setItem('cachedFavorites_' + currentUserEmail, JSON.stringify({ favorites, favoritesTVSeries }));
        }
      } catch (firebaseError) {
        console.warn('Firebase favorites fetch failed, loading from cache:', firebaseError);

        // If Firebase fails, load from cache
        const cachedFavorites = JSON.parse(localStorage.getItem('cachedFavorites_' + currentUserEmail)) || {};
        favorites = cachedFavorites.favorites || [];
        favoritesTVSeries = cachedFavorites.favoritesTVSeries || [];
      }
    } else {
      favorites = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
      favoritesTVSeries = JSON.parse(localStorage.getItem('favoritesTVSeries')) || [];
    }

    // Display Favorites Movies and TV Series sections
    displayFavoritesSection('Favorite Movies', favorites, displaySection);
    displayFavoritesSection('Favorite TV Series', favoritesTVSeries, displaySection);

    hideSpinner();
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    hideSpinner();
  }
}

// Helper function to display favorite movies/TV series sections
async function displayFavoritesSection(titleText, items, displaySection) {
  if (items.length > 0) {
    const favoritesDiv = document.createElement('div');
    favoritesDiv.className = 'watchlist';
    favoritesDiv.id = titleText.toLowerCase().replace(/\s+/g, '-');

    const title = document.createElement('h3');
    title.textContent = titleText;
    title.className = 'watchlist-title';
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => {
      favoritesDiv.scrollIntoView({ behavior: 'smooth' });
    });

    const titleTextNew = titleText === 'Favorite Movies' ? 'favorite movies' : 'favorite TV series';

    const description = document.createElement('p');
    description.textContent = `A collection of your ${titleTextNew}.`;
    description.className = 'watchlist-description';

    favoritesDiv.appendChild(title);
    favoritesDiv.appendChild(description);

    const container = document.createElement('div');
    container.className = 'movies-container';

    const cards = await Promise.all(items.map(titleText === 'Favorite Movies' ? fetchMovieDetails : fetchTVSeriesDetails));
    cards.forEach(card => container.appendChild(card));

    favoritesDiv.appendChild(container);
    displaySection.appendChild(favoritesDiv);
    requestAnimationFrame(() => initSpotlightCarousel(container));
  } else {
    const favoritesDiv = document.createElement('div');
    favoritesDiv.className = 'watchlist';
    favoritesDiv.id = titleText.toLowerCase().replace(/\s+/g, '-');
    const titleTextNew = titleText === 'Favorite Movies' ? 'favorite movies' : 'favorite TV series';
    favoritesDiv.innerHTML = `<div style="text-align: center"><h3 style="text-align: center; font-size: 24px; color: #ff8623">${titleText}</h3><p style="text-align: center">No ${titleTextNew} added yet.</p></div>`;
    displaySection.appendChild(favoritesDiv);
  }
}

async function fetchTVSeriesDetails(tvSeriesId) {
  const code = `${getMovieCode()}`;
  const url = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}?${generateMovieNames()}${code}&append_to_response=credits,keywords,similar`;

  try {
    const response = await fetch(url);
    const series = await response.json();
    const seriesCard = await createTVSeriesCard(series);
    seriesCard.setAttribute('data-series-title', series.name);
    return seriesCard;
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error loading series details. Please try refreshing the page.';
    return errorDiv;
  }
}

async function getAdditionalTVSeriesImages(tvSeriesId) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${tvSeriesId}/images?api_key=${getMovieCode()}`);
  const data = await response.json();
  return data.posters.map(poster => poster.file_path);
}

async function createTVSeriesCard(tvSeries) {
  const movieEl = document.createElement('div');
  movieEl.classList.add('movie');
  movieEl.style.cursor = 'pointer';
  movieEl.style.zIndex = '1000';

  let movieTitle = tvSeries.name;
  const words = movieTitle.split(' ');
  if (words.length >= 9) {
    words[8] = '...';
    movieTitle = words.slice(0, 9).join(' ');
  }

  const ratingClass = tvSeries.vote_count === 0 ? 'unrated' : getClassByRate(tvSeries.vote_average);
  const voteAvg = tvSeries.vote_count === 0 ? 'Unrated' : tvSeries.vote_average.toFixed(1);

  let overview = tvSeries.overview;
  if (overview === '') {
    overview = 'No overview available.';
  }

  movieEl.innerHTML = `
                <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden;">
                  <img data-src="${IMGPATH + tvSeries.poster_path}" alt="${tvSeries.name}" style="cursor: pointer; position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: opacity 1s ease-in-out; opacity: 1;">
                </div>
                <div class="movie-info" style="display: flex; align-items: flex-start; cursor: pointer;">
                    <h3 style="text-align: left; margin-right: 10px; flex: 1 1 auto;">${movieTitle}</h3>
                    <span class="${ratingClass}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; margin-left: auto;">${voteAvg}</span>
                </div>
                <div class="overview" style="cursor: pointer;">
                    <h4>TV Series Overview: </h4>
                    ${overview}
                </div>`;

  movieEl.addEventListener('click', () => {
    // Navigate to TV details page with tvSeriesId as a query parameter
    window.location.href = `tv-details.html?tvSeriesId=${tvSeries.id}`;

    // Update tracking and analytics functions
    updateMovieVisitCount(tvSeries.id, tvSeries.name);
    updateUniqueMoviesViewed(tvSeries.id);
    updateFavoriteGenre(tvSeries.genre_ids);
  });

  const additionalImages = await getAdditionalTVSeriesImages(tvSeries.id);
  let allImages = [tvSeries.poster_path, ...additionalImages].filter(Boolean);
  allImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 10);

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

  return movieEl;
}

function updateFavoriteGenre(genre_ids) {
  if (genre_ids && genre_ids.length > 0) {
    const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || [];
    favoriteGenres.push(genre_ids[0]);
    localStorage.setItem('favoriteGenres', JSON.stringify(favoriteGenres));
  }
}

function updateUniqueMoviesViewed(movieId) {
  let viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
  if (!viewedMovies.includes(movieId)) {
    viewedMovies.push(movieId);
    localStorage.setItem('uniqueMoviesViewed', JSON.stringify(viewedMovies));
  }
}

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

async function isListPinned(watchlistId) {
  const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  if (currentUserEmail) {
    try {
      const watchlistRef = doc(db, 'watchlists', watchlistId);
      const watchlistDoc = await getDoc(watchlistRef);

      if (watchlistDoc.exists()) {
        const watchlistData = watchlistDoc.data();
        return watchlistData.pinned || false;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  } else {
    const watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
    const watchlist = watchlists.find(watchlist => watchlist.id === watchlistId);
    return watchlist ? watchlist.pinned : false;
  }
}

function addWatchListControls(watchlistDiv, watchlistId) {
  if (!watchlistId) {
    return;
  }

  const controlContainer = document.createElement('div');
  controlContainer.className = 'watchlist-controls';

  const pinBtn = document.createElement('button');
  pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
  pinBtn.classList.add('pin-btn');

  isListPinned(watchlistId).then(isPinned => {
    pinBtn.title = isPinned ? 'Unpin this watch list' : 'Pin this watch list';
    if (isPinned) {
      pinBtn.classList.add('pinned');
    } else {
      pinBtn.classList.remove('pinned');
    }
    pinBtn.onclick = function () {
      pinWatchList(watchlistDiv, watchlistId);
    };
  });

  const moveUpBtn = document.createElement('button');
  moveUpBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  moveUpBtn.onclick = function () {
    moveWatchList(watchlistDiv, true);
  };
  moveUpBtn.title = 'Move this watch list up';

  const moveDownBtn = document.createElement('button');
  moveDownBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
  moveDownBtn.onclick = function () {
    moveWatchList(watchlistDiv, false);
  };
  moveDownBtn.title = 'Move this watch list down';

  const shareBtn = document.createElement('button');
  shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
  shareBtn.title = 'Share this watch list';
  shareBtn.onclick = function () {
    shareWatchList(watchlistDiv);
  };

  controlContainer.appendChild(pinBtn);
  controlContainer.appendChild(moveUpBtn);
  controlContainer.appendChild(moveDownBtn);
  controlContainer.appendChild(shareBtn);
  watchlistDiv.appendChild(controlContainer);
}

function shareWatchList(watchlistDiv) {
  const watchlistTitle = watchlistDiv.querySelector('.watchlist-title').textContent;
  let itemsToShare = `Explore my curated watchlist, "${watchlistTitle}", which contains:\n`;
  let finalLine = 'Happy Watching! 🍿🎬🎥\n\n';
  const movieCards = watchlistDiv.querySelectorAll('[data-movie-title]');
  const tvSeriesCards = watchlistDiv.querySelectorAll('[data-series-title]');

  movieCards.forEach(movieCard => {
    itemsToShare += `- ${movieCard.getAttribute('data-movie-title')}\n`;
  });

  tvSeriesCards.forEach(seriesCard => {
    itemsToShare += `- ${seriesCard.getAttribute('data-series-title')}\n`;
  });

  itemsToShare += finalLine;

  if (navigator.share) {
    navigator
      .share({
        title: `Share Watchlist: ${watchlistTitle}`,
        text: itemsToShare,
      })
      .catch(err => {
        console.error('Error sharing the watchlist:', err);
      });
  } else {
    downloadWatchlist(watchlistTitle, itemsToShare);
  }
}

function downloadWatchlist(title, content) {
  const encodedContent = encodeURIComponent(content);
  const dataUri = `data:text/plain;charset=utf-8,${encodedContent}`;

  const element = document.createElement('a');
  element.setAttribute('href', dataUri);
  element.setAttribute('download', `${title.replace(/[\s]+/g, '_')}.txt`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

async function createWatchListDiv(watchlist) {
  const watchlistDiv = document.createElement('div');
  watchlistDiv.className = 'watchlist';
  watchlistDiv.setAttribute('data-watchlist-id', watchlist.id);

  const title = document.createElement('h3');
  title.textContent = watchlist.name;
  title.className = 'watchlist-title';
  title.style.cursor = 'pointer';
  title.addEventListener('click', () => {
    watchlistDiv.scrollIntoView({ behavior: 'smooth' });
  });

  const description = document.createElement('p');
  description.textContent = watchlist.description;
  description.className = 'watchlist-description';

  watchlistDiv.appendChild(title);
  watchlistDiv.appendChild(description);

  const moviesContainer = document.createElement('div');
  moviesContainer.className = 'movies-container';
  const movieIds = watchlist.movies || [];
  const tvSeriesIds = watchlist.tvSeries || [];
  const moviePromises = movieIds.map(movieId => fetchMovieDetails(movieId));
  const tvPromises = tvSeriesIds.map(tvSeriesId => fetchTVSeriesDetails(tvSeriesId));
  const cards = await Promise.all([...moviePromises, ...tvPromises]);
  cards.forEach(card => moviesContainer.appendChild(card));

  watchlistDiv.appendChild(moviesContainer);
  addWatchListControls(watchlistDiv, watchlist.id);
  return watchlistDiv;
}

function updateWatchlistsOrderInLS() {
  const watchlistsDivs = document.querySelectorAll('#watchlists-display-section > .watchlist');
  let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
  const newOrder = Array.from(watchlistsDivs).map(div => div.getAttribute('data-watchlist-id'));

  watchlists.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
  localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
}

async function moveWatchList(watchlistDiv, moveUp) {
  showSpinner();

  const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');
  const watchlistId = watchlistDiv.getAttribute('data-watchlist-id');

  if (currentUserEmail) {
    try {
      const watchlistsQuery = query(collection(db, 'watchlists'), where('userEmail', '==', currentUserEmail), orderBy('order', 'asc'));
      const snapshot = await getDocs(watchlistsQuery);
      let watchlists = snapshot.docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });

      const index = watchlists.findIndex(watchlist => watchlist.docId === watchlistId);
      if (index === -1 || watchlists.length < 2) {
        hideSpinner();
        return;
      }

      const swapIndex = moveUp ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= watchlists.length) {
        hideSpinner();
        return;
      }

      let currentOrder = watchlists[index].order;
      let swapOrder = watchlists[swapIndex].order;

      const batch = writeBatch(db);
      batch.update(doc(db, 'watchlists', watchlists[index].docId), {
        order: swapOrder,
      });
      batch.update(doc(db, 'watchlists', watchlists[swapIndex].docId), {
        order: currentOrder,
      });

      await batch.commit();
    } catch (error) {
      hideSpinner();
    }
    hideSpinner();
  } else {
    const sibling = moveUp ? watchlistDiv.previousElementSibling : watchlistDiv.nextElementSibling;
    if (sibling) {
      const parent = watchlistDiv.parentNode;
      if (moveUp) {
        parent.insertBefore(watchlistDiv, sibling);
      } else {
        parent.insertBefore(sibling, watchlistDiv);
      }
      updateWatchlistsOrderInLS();
    }
    hideSpinner();
  }

  loadWatchLists();
  window.location.reload();
}

async function pinWatchList(watchlistDiv, watchlistId) {
  showSpinner();

  const isPinned = watchlistDiv.classList.contains('pinned');
  const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser');

  if (currentUserEmail) {
    const watchlistRef = doc(db, 'watchlists', watchlistId);
    await updateDoc(watchlistRef, {
      pinned: !isPinned,
    });
    hideSpinner();
  } else {
    let watchlists = JSON.parse(localStorage.getItem('localWatchlists')) || [];
    watchlists.forEach(watchlist => {
      if (watchlist.id === watchlistId) {
        watchlist.pinned = !isPinned;
      }
    });

    localStorage.setItem('localWatchlists', JSON.stringify(watchlists));
    hideSpinner();
  }

  loadWatchLists();
  window.location.reload();
}

document.getElementById('settings-btn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

document.addEventListener('DOMContentLoaded', () => {
  applySettings();

  function applySettings() {
    const savedBg = localStorage.getItem('backgroundImage');
    const savedTextColor = localStorage.getItem('textColor');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedBg) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
    }

    if (savedTextColor) {
      document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
        element.style.color = savedTextColor;
      });
    }

    if (savedFontSize) {
      const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
      document.body.style.fontSize = size;
    }
  }
});

function updateWatchlistsCreated() {
  let watchlistsCount = parseInt(localStorage.getItem('watchlistsCreated')) || 0;
  watchlistsCount++;
  localStorage.setItem('watchlistsCreated', watchlistsCount.toString());
}
