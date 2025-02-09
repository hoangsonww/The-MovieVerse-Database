const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');

const form = document.getElementById('form1');
const SEARCHPATH = `https://api-movieverse.vercel.app/api/3/search/movie&query=`;
const main = document.getElementById('main');
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const searchTitle = document.getElementById('search-title');
const token = localStorage.getItem('movieverseToken');

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

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

function handleSignInOut() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

  if (isSignedIn) {
    localStorage.setItem('isSignedIn', JSON.stringify(false));
    alert('You have been signed out.');
  } else {
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
  } else {
    signInText.textContent = 'Sign In';
    signInIcon.style.display = 'inline-block';
    signOutIcon.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateSignInButtonState();
  document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

document.getElementById('clear-search-btn').addEventListener('click', () => {
  location.reload();
});

function showMovies(movies) {
  main.innerHTML = '';
  movies.forEach(movie => {
    const { id, poster_path, title, vote_average, overview } = movie;
    const movieE1 = document.createElement('div');
    const voteAverage = vote_average.toFixed(1);
    movieE1.classList.add('movie');
    const movieImage = poster_path
      ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
      : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;
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

function clearMovieDetails() {
  const movieDetailsContainer = document.getElementById('director-details-container');
  if (movieDetailsContainer) {
    movieDetailsContainer.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const directorId = '525';
  if (directorId) {
    fetchDirectorDetails(directorId);
  } else {
    document.getElementById('director-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw;">
                <h2>Director details not found.</h2>
            </div>`;
  }
});

async function fetchDirectorDetails(directorId) {
  const directorUrl = `https://api-movieverse.vercel.app/api/3/person/525`;
  const creditsUrl = `https://api-movieverse.vercel.app/api/3/person/525/movie_credits`;
  try {
    const [directorResponse, creditsResponse] = await Promise.all([
      fetch(directorUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(creditsUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const director = await directorResponse.json();
    const credits = await creditsResponse.json();

    if (director.success === false) {
      document.getElementById('director-details-container').innerHTML = '<h2>No Information is Available for this Director</h2>';
    } else {
      updateBrowserURL(director.name);
      populateDirectorDetails(director, credits);
    }
  } catch (error) {
    console.log('Error fetching director details:', error);
    document.getElementById('director-details-container').innerHTML = '<h2>Error fetching director details</h2>';
  }
}

function populateDirectorDetails(director, credits) {
  const directorImage = document.getElementById('director-image');
  const directorName = document.getElementById('director-name');
  const directorDescription = document.getElementById('director-description');

  if (director.profile_path) {
    directorImage.src = `https://image.tmdb.org/t/p/w1280${director.profile_path}`;
    directorName.textContent = director.name;
    document.title = `${director.name} - Director's Details`;
  } else {
    directorImage.style.display = 'none';
    directorName.textContent = director.name;
    const noImageText = document.createElement('h2');
    noImageText.textContent = 'Image Not Available';
    noImageText.style.textAlign = 'center';
    document.querySelector('.director-left').appendChild(noImageText);
  }

  let ageOrStatus;
  if (director.birthday) {
    if (director.deathday) {
      ageOrStatus = calculateAge(director.birthday, director.deathday) + ' (Deceased)';
    } else {
      ageOrStatus = calculateAge(director.birthday) + ' (Alive)';
    }
  } else {
    ageOrStatus = 'Unknown';
  }

  directorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${director.biography || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${director.birthday || 'N/A'}</p>
        <p><strong>Date of Death:</strong> ${director.deathday || 'N/A'}</p>
        <p><strong>Age:</strong> ${ageOrStatus}</p>
        <p><strong>Place of Birth:</strong> ${director.place_of_birth || 'N/A'}</p>
        <p><strong>Known For:</strong> Directing</p>
    `;

  const filmographyHeading = document.createElement('p');
  filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
  directorDescription.appendChild(filmographyHeading);
  const movieList = document.createElement('div');
  movieList.classList.add('movie-list');
  credits.crew.forEach(movie => {
    if (movie.job === 'Director') {
      const movieLink = document.createElement('span');
      movieLink.textContent = movie.title;
      movieLink.classList.add('movie-link');
      movieLink.addEventListener('click', () => {
        localStorage.setItem('selectedMovieId', movie.id);
        window.location.href = 'movie-details.html';
      });
      movieList.appendChild(movieLink);
      movieList.appendChild(document.createTextNode(', '));
    }
  });
  filmographyHeading.appendChild(movieList);

  applySettings();
}

function calculateAge(dob, deathday = null) {
  const birthDate = new Date(dob);
  const referenceDate = deathday ? new Date(deathday) : new Date();
  const ageDifMs = referenceDate - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

async function fetchGenreMap() {
  const url = `https://api-movieverse.vercel.app/api/3/genre/movie/list`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
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
  document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
    element.style.color = color;
  });
}

function updateBrowserURL(name) {
  const nameSlug = createNameSlug(name);
  const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + nameSlug;
  window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(name) {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '');
}
