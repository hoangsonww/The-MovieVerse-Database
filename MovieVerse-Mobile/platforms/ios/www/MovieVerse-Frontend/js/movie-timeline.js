let alertShown = false;

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

document.getElementById('start-year').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    updateMovies();
  }
});

document.getElementById('end-year').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    updateMovies();
  }
});

const IMGPATH = 'https://image.tmdb.org/t/p/w500';
const SEARCHPATH = `https://api-movieverse.vercel.app/api/3/search/movie&query=`;
const searchTitle = document.getElementById('select-text');
const searchButton = document.getElementById('button-search');
const search = document.getElementById('search');
const main = document.getElementById('results');

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

async function getMovies(url) {
  clearMovieDetails();
  const numberOfMovies = calculateMoviesToDisplay();
  const pagesToFetch = numberOfMovies <= 20 ? 1 : 2;
  let allMovies = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    const response = await fetch(`${url}&page=${page}`);
    const data = await response.json();
    allMovies = allMovies.concat(data.results);
  }

  const popularityThreshold = 0.5;

  allMovies.sort((a, b) => {
    const popularityDifference = Math.abs(a.popularity - b.popularity);
    if (popularityDifference < popularityThreshold) {
      return b.vote_average - a.vote_average;
    }
    return b.popularity - a.popularity;
  });

  if (allMovies.length > 0) {
    showMovies(allMovies.slice(0, numberOfMovies), main);
  } else {
    main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
  }
}

function clearMovieDetails() {
  const movieDetailsContainer = document.getElementById('movie-details-container');
  if (movieDetailsContainer) {
    movieDetailsContainer.innerHTML = '';
  }
}

const form = document.getElementById('form1');

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

function updateMovies() {
  showSpinner();
  let startYear = document.getElementById('start-year').value;
  let endYear = document.getElementById('end-year').value;
  let currentYear = new Date().getFullYear();
  if (startYear && endYear && startYear <= endYear && endYear <= currentYear && startYear >= 1900 && startYear <= currentYear) {
    fetchMoviesByTimePeriod(startYear, endYear);
    hideSpinner();
    alertShown = false;
  } else {
    if (!alertShown) {
      alert(
        'Please ensure the start year is before the end year, the start year is later than the year 1900, and both are not later than the current year.'
      );
      alertShown = true;
    }
    hideSpinner();
  }
}

async function getAdditionalPosters(movieId) {
  const response = await fetch(`https://api-movieverse.vercel.app/api/3/movie/${movieId}/images`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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

function showMovies(movies, mainElement, startYear, endYear, append) {
  showSpinner();

  // Add header for the selected year range if not appending
  if (!append) {
    mainElement.innerHTML = '';
    const header = document.createElement('h2');
    header.style.textAlign = 'center';
    header.style.marginTop = '20px';
    header.style.marginBottom = '20px';
    header.style.color = '#ff8623';
    header.style.fontSize = '23px';
    header.textContent = startYear === endYear ? `Movies released in ${startYear}` : `Movies released between ${startYear} and ${endYear}`;

    const centerContainer1 = document.getElementById('center-container1');
    centerContainer1.innerHTML = '';
    centerContainer1.appendChild(header);
    centerContainer1.appendChild(mainElement);
  }

  // Observer for loading additional images when movie enters viewport
  const imageObserver = new IntersectionObserver(
    async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const movieEl = entry.target;
          const movieId = movieEl.dataset.id;

          // Fetch and set up additional posters
          const additionalPosters = await getAdditionalPosters(movieId);
          let allPosters = [movieEl.dataset.posterPath, ...additionalPosters];
          allPosters = allPosters.sort(() => 0.5 - Math.random()).slice(0, 10);

          const movieImageContainer = movieEl.querySelector('.movie-images');
          const imagePromises = allPosters.map((poster, index) => {
            const img = new Image();
            img.src = `${IMGPATH + poster}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.alt = `${movieEl.dataset.title} poster ${index + 1}`;
            img.width = 300;
            img.height = 435;
            img.style.position = 'absolute';
            img.style.top = 0;
            img.style.left = 0;
            img.style.transition = 'opacity 1s ease-in-out';
            img.style.opacity = '0';
            img.classList.add('poster-img');
            movieImageContainer.appendChild(img);

            return new Promise(resolve => {
              img.onload = () => resolve(img);
            });
          });

          // Wait for images to load or timeout after 3 seconds
          const maxWait = new Promise(resolve => setTimeout(resolve, 3000));
          await Promise.race([Promise.all(imagePromises), maxWait]);

          // Show the first poster image
          movieImageContainer.querySelector('.poster-img').style.opacity = '1';

          rotateImages(Array.from(movieImageContainer.children));
          observer.unobserve(movieEl);
        }
      }
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  );

  movies.forEach(movie => {
    let { id, poster_path, title, vote_average, vote_count, overview, genre_ids } = movie;

    const movieEl = document.createElement('div');
    movieEl.style.zIndex = '1000';
    movieEl.classList.add('movie');
    movieEl.dataset.id = id;
    movieEl.dataset.posterPath = poster_path;
    movieEl.dataset.title = title;

    // Limit the title to 8 words, adding "..." if necessary
    const words = title.split(' ');
    if (words.length >= 8) {
      words[7] = '...';
      title = words.slice(0, 8).join(' ');
    }

    const voteAvg = vote_count === 0 ? 'Unrated' : vote_average.toFixed(1);
    const ratingClass = vote_count === 0 ? 'unrated' : getClassByRate(vote_average);

    if (overview === '') {
      overview = 'No overview available.';
    }

    // Define HTML structure for the movie card
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

    movieEl.addEventListener('click', () => {
      localStorage.setItem('selectedMovieId', id);
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
      window.location.href = 'MovieVerse-Frontend/html/movie-details.html';
    });

    mainElement.appendChild(movieEl);
    imageObserver.observe(movieEl);

    // Observer for the slide-up animation
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

  const centerContainer1 = document.getElementById('center-container1');
  centerContainer1.appendChild(mainElement);

  createLoadMoreButton(startYear, endYear, mainElement);
  hideSpinner();
}

// Inject CSS for sliding-up animation if it doesn't already exist
if (!document.getElementById('slide-animation-style')) {
  const style = document.createElement('style');
  style.id = 'slide-animation-style';
  style.innerHTML = `
    .movie {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .movie.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

function createLoadMoreButton(startYear, endYear, mainElement) {
  const existingButtonDiv = mainElement.querySelector('.load-more-container');
  if (existingButtonDiv) {
    mainElement.removeChild(existingButtonDiv);
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'load-more-container';
  buttonContainer.style.width = '100%';
  buttonContainer.style.textAlign = 'center';
  buttonContainer.style.marginTop = '20px';

  const moreButton = document.createElement('button');
  moreButton.textContent = 'Get More Movies in this Period';
  moreButton.style.margin = '10px auto';

  moreButton.addEventListener('click', function () {
    currentPage++;
    fetchMoviesByTimePeriod(startYear, endYear, true);
  });

  buttonContainer.appendChild(moreButton);
  mainElement.appendChild(buttonContainer);
}

let currentPage = 1;

async function fetchMoviesByTimePeriod(startYear, endYear, append = false) {
  showSpinner();
  const url = `https://api-movieverse.vercel.app/api/3/discover/movie&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${currentPage}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  const moviesToShow = data.results;

  if (append) {
    showMovies(moviesToShow, document.getElementById('results'), startYear, endYear, true);
  } else {
    showMovies(moviesToShow, document.getElementById('results'), startYear, endYear, false);
  }
  hideSpinner();
}

document.getElementById('load-movies').addEventListener('click', () => {
  showSpinner();
  updateMovies();
  alertShown = false;
  hideSpinner();
});

function calculateMoviesToDisplay() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 689.9) return 10; // 1 movie per row
  if (screenWidth <= 1021.24) return 20; // 2 movies per row
  if (screenWidth <= 1353.74) return 21; // 3 movies per row
  if (screenWidth <= 1684.9) return 20; // 4 movies per row
  if (screenWidth <= 2017.49) return 20; // 5 movies per row
  if (screenWidth <= 2349.99) return 18; // 6 movies per row
  if (screenWidth <= 2681.99) return 21; // 7 movies per row
  if (screenWidth <= 3014.49) return 24; // 8 movies per row
  if (screenWidth <= 3345.99) return 27; // 9 movies per row
  if (screenWidth <= 3677.99) return 20; // 10 movies per row
  if (screenWidth <= 4009.99) return 22; // 11 movies per row
  if (screenWidth <= 4340.99) return 24; // 12 movies per row
  if (screenWidth <= 4673.49) return 26; // 13 movies per row
  if (screenWidth <= 5005.99) return 28; // 14 movies per row
  if (screenWidth <= 5337.99) return 30; // 15 movies per row
  if (screenWidth <= 5669.99) return 32; // 16 movies per row
  if (screenWidth <= 6001.99) return 34; // 17 movies per row
  if (screenWidth <= 6333.99) return 36; // 18 movies per row
  if (screenWidth <= 6665.99) return 38; // 19 movies per row
  if (screenWidth <= 6997.99) return 40; // 20 movies per row
  if (screenWidth <= 7329.99) return 42; // 21 movies per row
  if (screenWidth <= 7661.99) return 44; // 22 movies per row
  if (screenWidth <= 7993.99) return 46; // 23 movies per row
  if (screenWidth <= 8325.99) return 48; // 24 movies per row
  return 20;
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

async function showMovieOfTheDay() {
  const year = new Date().getFullYear();
  const url = `https://api-movieverse.vercel.app/api/3/discover/movie&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const movies = data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      localStorage.setItem('selectedMovieId', randomMovie.id);
      window.location.href = 'movie-details.html';
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    console.log('Error fetching movie:', error);
    fallbackMovieSelection();
  }
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

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
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

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340,
    424, 98,
  ];
  const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
  localStorage.setItem('selectedMovieId', randomFallbackMovie);
  window.location.href = 'movie-details.html';
}
