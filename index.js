const director_main = document.getElementById('director-spotlight');
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');
const searchTitle = document.getElementById('search-title');
const otherTitle = document.getElementById('other1');

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

document.addEventListener('DOMContentLoaded', function () {
  const pagination = document.getElementById('most-popular-pagination');
  const genresContainer = document.querySelector('.genres');
  const mainContainer = document.getElementById('most-popular');

  function movePagination() {
    if (window.innerWidth <= 767) {
      mainContainer.parentNode.insertBefore(pagination, mainContainer);
    } else {
      genresContainer.appendChild(pagination);
    }
  }

  movePagination();
  window.addEventListener('resize', movePagination);
});

document.addEventListener('DOMContentLoaded', function () {
  let currentPageMostPopular = 1;

  const totalPages = 320;
  const mostPopularMain = document.getElementById('most-popular');
  const paginationContainer = document.getElementById('most-popular-pagination');

  const fetchAndUpdateMostPopular = () => {
    const mostPopularUrl = `https://${getMovieVerseData()}/3/movie/popular?${generateMovieNames()}${getMovieCode()}`;
    getMovies(mostPopularUrl, mostPopularMain, currentPageMostPopular);
    updatePaginationDisplay();
  };

  const updatePaginationDisplay = () => {
    paginationContainer.innerHTML = '';

    const prevButton = createNavigationButton('<', currentPageMostPopular > 1, () => {
      currentPageMostPopular--;
      fetchAndUpdateMostPopular();
    });
    paginationContainer.appendChild(prevButton);

    let startPage = Math.max(currentPageMostPopular - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage === totalPages) startPage = Math.max(endPage - 4, 1);

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1));
      if (startPage > 2) paginationContainer.appendChild(createPageButton('...'));
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) paginationContainer.appendChild(createPageButton('...'));
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    const nextButton = createNavigationButton('>', currentPageMostPopular < totalPages, () => {
      currentPageMostPopular++;
      fetchAndUpdateMostPopular();
    });
    paginationContainer.appendChild(nextButton);
  };

  const createNavigationButton = (text, enabled, clickHandler) => {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.disabled = !enabled;
    button.className = 'nav-button';

    if (enabled) {
      button.onclick = clickHandler;
    }

    return button;
  };

  const createPageButton = pageNum => {
    const button = document.createElement('button');
    button.textContent = pageNum;
    button.className = 'page-button';

    if (pageNum === '...') {
      button.disabled = true;
    } else {
      button.onclick = function () {
        currentPageMostPopular = pageNum;
        fetchAndUpdateMostPopular();
      };

      if (pageNum === currentPageMostPopular) {
        button.classList.add('active');
      }
    }
    return button;
  };

  fetchAndUpdateMostPopular();
});

function setupPagination(mainElementId, paginationContainerId, genresContainerId, baseUrl) {
  let currentPage = 1;
  let totalPages = 10;

  const mainElement = document.getElementById(mainElementId);
  const paginationContainer = document.getElementById(paginationContainerId);
  const genresContainer = document.getElementById(genresContainerId);

  function movePagination() {
    if (window.innerWidth <= 767) {
      mainElement.parentNode.insertBefore(paginationContainer, mainElement);
    } else {
      genresContainer.appendChild(paginationContainer);
    }
  }

  const fetchAndUpdate = () => {
    const timestamp = new Date().getTime();
    const urlWithPage = `${baseUrl}&page=${currentPage}&_=${timestamp}`;
    getMovies(urlWithPage, mainElement);
  };

  async function getMovies(url, mainElement) {
    showSpinner();

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.total_pages) {
        if (data.total_pages > 250) {
          totalPages = 250;
        } else {
          totalPages = data.total_pages;
        }
      }

      if (data.results.length > 0) {
        let allMovies = data.results;
        const popularityThreshold = 0.5;
        const numberOfMovies = calculateMoviesToDisplay();

        allMovies.sort((a, b) => {
          const popularityDifference = Math.abs(a.popularity - b.popularity);
          if (popularityDifference < popularityThreshold) {
            return b.vote_average - a.vote_average;
          }
          return b.popularity - a.popularity;
        });

        showMovies(allMovies.slice(0, numberOfMovies), mainElement);
      } else {
        mainElement.innerHTML = `<p>No movies found on this page.</p>`;
      }
    } catch (error) {
      console.log('Error fetching data: ', error);
      mainElement.innerHTML = `<p>No movies found on this page.</p>`;
    } finally {
      hideSpinner();
      updatePaginationDisplay();
    }
  }

  const updatePaginationDisplay = () => {
    paginationContainer.innerHTML = '';

    const prevButton = createNavigationButton('<', currentPage > 1, () => {
      currentPage--;
      fetchAndUpdate();
    });
    paginationContainer.appendChild(prevButton);

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage === totalPages) {
      startPage = Math.max(endPage - 4, 1);
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1));
      if (startPage > 2) paginationContainer.appendChild(createPageButton('...'));
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) paginationContainer.appendChild(createPageButton('...'));
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    const nextButton = createNavigationButton('>', currentPage < totalPages, () => {
      currentPage++;
      fetchAndUpdate();
    });
    paginationContainer.appendChild(nextButton);
  };

  function createNavigationButton(text, enabled, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = !enabled;
    button.className = 'nav-button';

    if (enabled) {
      button.addEventListener('click', clickHandler);
    }

    return button;
  }

  function createPageButton(pageNum) {
    const button = document.createElement('button');
    button.textContent = pageNum;
    button.className = 'page-button';

    if (pageNum === '...') {
      button.disabled = true;
    } else {
      button.addEventListener('click', () => {
        currentPage = typeof pageNum === 'number' ? pageNum : currentPage;
        fetchAndUpdate();
      });

      if (pageNum === currentPage) {
        button.classList.add('active');
      }
    }
    return button;
  }

  movePagination();
  fetchAndUpdate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(movePagination, 250);
  });
}

async function fetchAndDisplayMovies(url, count, mainElement) {
  const response = await fetch(`${url}`);
  const data = await response.json();
  const movies = data.results.slice(0, count);

  movies.sort(() => Math.random() - 0.5);
  showMovies(movies, mainElement);
}

document.addEventListener('DOMContentLoaded', async () => {
  let currentPageRecommended = 1;
  const totalPagesRecommended = 60;
  const recommendedMain = document.getElementById('recommended');
  const paginationContainerRecommended = document.getElementById('recommended-pagination');
  const genresContainer = document.getElementById('recommendedDIV');

  function movePagination() {
    if (window.innerWidth <= 767) {
      recommendedMain.parentNode.insertBefore(paginationContainerRecommended, recommendedMain);
    } else {
      genresContainer.appendChild(paginationContainerRecommended);
    }
  }

  async function generateRecommendations(pageNum = currentPageRecommended) {
    showSpinner();

    currentPageRecommended = pageNum;
    const mostCommonGenre = getMostCommonGenre();
    const mostVisitedMovieGenre = await getMostVisitedMovieGenre();

    recommendedMain.innerHTML = '';

    if (!mostVisitedMovieGenre || !mostCommonGenre) {
      recommendedMain.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                                      <p style="text-align: center; font-size: 20px;">
                                          Start exploring and rating movies or add them to your favorites to get personalized recommendations.
                                      </p>
                                  </div>`;
      return;
    }

    const totalMoviesToDisplay = calculateMoviesToDisplay();
    const commonGenreUrl = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=${mostCommonGenre}&sort_by=popularity.desc&vote_count.gte=10&page=${currentPageRecommended}`;
    const visitedGenreUrl = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=${mostVisitedMovieGenre}&sort_by=popularity.desc&vote_count.gte=10&page=${currentPageRecommended}`;

    await fetchAndDisplayMovies(commonGenreUrl, totalMoviesToDisplay, recommendedMain);
    await fetchAndDisplayMovies(visitedGenreUrl, totalMoviesToDisplay, recommendedMain);

    updatePaginationDisplayRecommended();
    hideSpinner();
  }

  function updatePaginationDisplayRecommended() {
    paginationContainerRecommended.innerHTML = '';

    const prevButton = createNavigationButton('<', currentPageRecommended > 1, () => generateRecommendations(currentPageRecommended - 1));
    paginationContainerRecommended.appendChild(prevButton);

    let startPage = Math.max(currentPageRecommended - 2, 1);
    let endPage = Math.min(startPage + 4, totalPagesRecommended);

    if (endPage === totalPagesRecommended) startPage = Math.max(endPage - 4, 1);

    if (startPage > 1) {
      paginationContainerRecommended.appendChild(createPageButton(1, generateRecommendations));
      if (startPage > 2) paginationContainerRecommended.appendChild(createPageButton('...'));
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainerRecommended.appendChild(createPageButton(i, generateRecommendations, i === currentPageRecommended));
    }

    if (endPage < totalPagesRecommended) {
      if (endPage < totalPagesRecommended - 1) paginationContainerRecommended.appendChild(createPageButton('...'));
      paginationContainerRecommended.appendChild(createPageButton(totalPagesRecommended, generateRecommendations));
    }

    const nextButton = createNavigationButton('>', currentPageRecommended < totalPagesRecommended, () =>
      generateRecommendations(currentPageRecommended + 1)
    );
    paginationContainerRecommended.appendChild(nextButton);
  }

  function createNavigationButton(text, enabled, clickHandler) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.disabled = !enabled;
    button.className = 'nav-button';
    if (enabled) {
      button.addEventListener('click', clickHandler);
    }
    return button;
  }

  function createPageButton(pageNum, fetchFunction, isActive) {
    const button = document.createElement('button');
    button.textContent = pageNum;
    button.className = 'page-button' + (isActive ? ' active' : '');

    if (pageNum !== '...') {
      button.addEventListener('click', () => fetchFunction(pageNum));
    } else {
      button.disabled = true;
    }

    return button;
  }

  movePagination();
  await generateRecommendations();
  window.addEventListener('resize', movePagination);
});

async function getMovies(url, mainElement, page = 1) {
  showSpinner();

  url += `&page=${page}`;
  const numberOfMovies = calculateMoviesToDisplay();
  let allMovies = [];
  const response = await fetch(url);
  const data = await response.json();
  const popularityThreshold = 0.5;
  allMovies = allMovies.concat(data.results);
  allMovies.sort((a, b) => {
    const popularityDifference = Math.abs(a.popularity - b.popularity);
    if (popularityDifference < popularityThreshold) {
      return b.vote_average - a.vote_average;
    }
    return b.popularity - a.popularity;
  });

  if (allMovies.length > 0) {
    showMovies(allMovies.slice(0, numberOfMovies), mainElement);
  } else {
    mainElement.innerHTML = `<p>We're having trouble fetching movies right now. Please try again later.</p>`;
  }

  hideSpinner();
}

async function getAdditionalPosters(movieId) {
  const response = await fetch(`https://${getMovieVerseData()}/3/movie/${movieId}/images?${generateMovieNames()}${getMovieCode()}`);
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

async function showMovies(movies, mainElement) {
  mainElement.innerHTML = '';

  // Inject CSS for the sliding-up animation effect with delay support
  const style = document.createElement('style');
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

  // Observer to trigger the slide-up animation with a staggered delay
  const slideObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const movieEl = entry.target;

          // Apply a staggered delay based on the card's index
          movieEl.style.transitionDelay = `${index * 100}ms`; // Adjust delay as needed
          movieEl.classList.add('visible');

          slideObserver.unobserve(movieEl);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  );

  // Observer for background image loading and rotation setup
  const imageObserver = new IntersectionObserver(
    async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const movieEl = entry.target;
          const movieId = movieEl.dataset.id;

          // Fetch additional posters and set up rotation in the background
          const additionalPosters = await getAdditionalPosters(movieId);
          let allPosters = [movieEl.dataset.posterPath, ...additionalPosters];
          const movieImageContainer = movieEl.querySelector('.movie-images');

          allPosters = allPosters.sort(() => 0.5 - Math.random()).slice(0, 10);

          // Load images in the background
          allPosters.forEach((poster, index) => {
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

            img.onload = () => {
              if (index === 0) img.style.opacity = '1'; // Show the first image
            };
          });

          // Start rotating images in the background
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

  movies.forEach((movie, index) => {
    let { id, poster_path, title, vote_average, vote_count, overview, genre_ids } = movie;

    const movieEl = document.createElement('div');
    movieEl.style.zIndex = '1000';
    movieEl.classList.add('movie');
    movieEl.dataset.id = id;
    movieEl.dataset.posterPath = poster_path;
    movieEl.dataset.title = title;

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
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
      // Navigate to movie details page with the movieId as a query parameter
      window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${id}`;
    });

    mainElement.appendChild(movieEl);

    // Observe for the slide-up animation
    slideObserver.observe(movieEl);

    // Observe for background image loading and rotation
    imageObserver.observe(movieEl);
  });
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

async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

async function fetchGenreMap() {
  const url = `https://c/3/genre/movie/list?${generateMovieNames()}${getMovieCode()}`;

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

async function getMostVisitedMovieGenre() {
  const movieVisits = JSON.parse(localStorage.getItem('movieVisits')) || {};
  let mostVisitedGenre = null;
  let maxVisits = 0;

  for (const movieId in movieVisits) {
    const visits = movieVisits[movieId];
    if (visits.count > maxVisits) {
      maxVisits = visits.count;
      mostVisitedGenre = await fetchGenreForMovie(movieId);
    }
  }

  return mostVisitedGenre;
}

async function fetchGenreForMovie(movieId) {
  const movieDetailsUrl = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${getMovieCode()}`;
  const response = await fetch(movieDetailsUrl);
  const movieDetails = await response.json();
  return movieDetails.genres[0] ? movieDetails.genres[0].id : null;
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

const movieCode = {
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

document.addEventListener('DOMContentLoaded', rotateUserStats);

async function showMovieOfTheDay() {
  const year = new Date().getFullYear();
  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      // Use the movieId from the randomly selected movie
      window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${randomMovie.id}`;
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
  // Pass the fallback movie id as a query parameter
  window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${randomFallbackMovie}`;
}

function calculateMoviesToDisplay() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 689.9) return 6; // 1 movie per row (mobile only)
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

form.addEventListener('submit', e => {
  e.preventDefault();
  const searchQuery = document.getElementById('search').value;

  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'MovieVerse-Frontend/html/search.html';
});

function toggleNav() {
  const sideNav = document.getElementById('side-nav');

  sideNav.classList.toggle('manual-toggle');
  adjustNavBar();
}

function removeNavBar() {
  const sideNav = document.getElementById('side-nav');

  if (sideNav.classList.contains('manual-toggle')) {
    sideNav.classList.remove('manual-toggle');
  }
  adjustNavBar();
}

function adjustNavBar() {
  const sideNav = document.getElementById('side-nav');

  if (sideNav.classList.contains('manual-toggle')) {
    sideNav.style.left = '0px';
  } else {
    sideNav.style.left = '-250px';
  }
}

document.addEventListener('mousemove', function (event) {
  const sideNav = document.getElementById('side-nav');

  if (event.clientX < 10 && !sideNav.classList.contains('manual-toggle')) {
    sideNav.style.left = '0';
  }
});

document.addEventListener('click', function (event) {
  const sideNav = document.getElementById('side-nav');
  const navToggle = document.getElementById('nav-toggle');
  const menuButton = document.getElementById('sticky-menu-button');

  if (
    !sideNav.contains(event.target) &&
    !navToggle.contains(event.target) &&
    sideNav.classList.contains('manual-toggle') &&
    !menuButton.contains(event.target)
  ) {
    sideNav.classList.remove('manual-toggle');
    adjustNavBar();
  }
});

document.getElementById('side-nav').addEventListener('mouseleave', function () {
  const sideNav = document.getElementById('side-nav');

  if (!sideNav.classList.contains('manual-toggle')) {
    sideNav.style.left = '-250px';
  }
});

const DATABASEURL = `https://${getMovieVerseData()}/3/discover/movie?sort_by=popularity.desc&${generateMovieNames()}${getMovieCode()}`;
const IMGPATH = `https://image.tmdb.org/t/p/w500`;
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;

const directors = [
  { name: 'Alfred Hitchcock', id: '2636' },
  { name: 'Steven Spielberg', id: '488' },
  { name: 'Martin Scorsese', id: '1032' },
  { name: 'Quentin Tarantino', id: '138' },
  { name: 'Christopher Nolan', id: '525' },
  { name: 'Stanley Kubrick', id: '240' },
  { name: 'Bong Joon-ho', id: '21684' },
  { name: 'David Fincher', id: '7467' },
  { name: 'James Cameron', id: '2710' },
  { name: 'Francis Ford Coppola', id: '1776' },
  { name: 'Tim Burton', id: '510' },
  { name: 'Ridley Scott', id: '578' },
  { name: 'Joel Coen', id: '1223' },
  { name: 'Spike Lee', id: '5281' },
  { name: 'Woody Allen', id: '1243' },
  { name: 'Peter Jackson', id: '108' },
  { name: 'Oliver Stone', id: '1152' },
  { name: 'David Lynch', id: '5602' },
  { name: 'Roman Polanski', id: '3556' },
  { name: 'Wes Anderson', id: '5655' },
  { name: 'Sergio Leone', id: '4385' },
  { name: 'Akira Kurosawa', id: '5026' },
  { name: 'Federico Fellini', id: '4415' },
  { name: 'John Ford', id: '8500' },
  { name: 'Fritz Lang', id: '68' },
  { name: 'Frank Capra', id: '2662' },
];

let currentDirectorIndex = 0;
updateDirectorSpotlight();

function changeDirector() {
  currentDirectorIndex++;

  if (currentDirectorIndex >= directors.length) {
    currentDirectorIndex = 0;
  }
  updateDirectorSpotlight();
}

setInterval(changeDirector, 3600000);

function updateDirectorSpotlight() {
  const director = directors[currentDirectorIndex];
  document.getElementById('spotlight-director-name').textContent = director.name;

  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_people=${
    director.id
  }&sort_by=popularity.desc&sort_by=vote_average.desc`;
  getDirectorSpotlight(url);
}

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

async function getDirectorSpotlight(url) {
  const numberOfMovies = calculateMoviesToDisplay();
  const resp = await fetch(url);
  const respData = await resp.json();
  let allMovies = [];

  if (respData.results.length > 0) {
    allMovies = respData.results.slice(0, numberOfMovies);
    showMoviesDirectorSpotlight(allMovies);
  }
}

function showMoviesDirectorSpotlight(movies) {
  director_main.innerHTML = '';

  // Inject CSS for the sliding-up animation effect with delay support
  const style = document.createElement('style');
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

  // Observer to trigger the slide-up animation with a staggered delay
  const slideObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const movieEl = entry.target;

          // Apply a staggered delay based on the card's index
          movieEl.style.transitionDelay = `${index * 100}ms`; // Adjust delay as needed
          movieEl.classList.add('visible');

          slideObserver.unobserve(movieEl);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  );

  movies.forEach((movie, index) => {
    const { id, poster_path, title, vote_average, genre_ids } = movie;
    const movieEl = document.createElement('div');

    movieEl.classList.add('movie');
    movieEl.style.zIndex = '1000';

    // Movie image and fallback in case the image is unavailable
    const movieImage = poster_path
      ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
      : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

    const voteAvg = vote_average > 0 ? vote_average.toFixed(1) : 'Unrated';
    const ratingClass = vote_average > 0 ? getClassByRate(vote_average) : 'unrated';

    movieEl.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="display: flex; justify-content: space-between; align-items: start; cursor: pointer;">
                <h3 style="flex: 1; text-align: left; margin-right: 5px;">${title}</h3>
                <span class="${ratingClass}" style="white-space: nowrap;">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Overview: </h4>
                ${movie.overview}
            </div>`;

    movieEl.addEventListener('click', () => {
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
      // Navigate to movie details page with the movieId as a query parameter
      window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${id}`;
    });

    director_main.appendChild(movieEl);

    // Observe for the slide-up animation
    slideObserver.observe(movieEl);
  });
}

function handleSignInOut() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

  if (isSignedIn) {
    localStorage.setItem('isSignedIn', JSON.stringify(false));
    alert('You have been signed out.');
  } else {
    window.location.href = 'MovieVerse-Frontend/html/sign-in.html';
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

  const mobileSignInText = document.getElementById('mobileSignInOutText');
  const mobileSignInIcon = document.getElementById('mobileSignInIcon');
  const mobileSignOutIcon = document.getElementById('mobileSignOutIcon');

  if (isSignedIn) {
    mobileSignInText.textContent = 'Sign Out';
    mobileSignInIcon.style.display = 'none';
    mobileSignOutIcon.style.display = 'inline-block';
  } else {
    mobileSignInText.textContent = 'Sign In';
    mobileSignInIcon.style.display = 'inline-block';
    mobileSignOutIcon.style.display = 'none';
  }
}

setupPagination(
  'award-winning',
  'award-winning-pagination',
  'award-winning-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=1000`
);

setupPagination(
  'hidden-gems',
  'hidden-gems-pagination',
  'hidden-gems-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7&popularity.lte=10`
);

setupPagination(
  'western',
  'western-pagination',
  'western-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=37&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'war',
  'war-pagination',
  'war-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=10752&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'vietnamese',
  'vietnamese-pagination',
  'vietnamese-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_original_language=vi&sort_by=popularity.desc`
);

setupPagination(
  'korean',
  'korean-pagination',
  'korean-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_original_language=ko&sort_by=vote_average.desc,popularity.desc&vote_count.gte=10&vote_average.gte=8`
);

setupPagination(
  'musical',
  'musical-pagination',
  'musical-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=10402&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'drama',
  'drama-pagination',
  'drama-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=18&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'indian',
  'indian-pagination',
  'indian-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_original_language=hi&sort_by=popularity.desc`
);

setupPagination(
  'action',
  'action-pagination',
  'action-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=28&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'horror',
  'horror-pagination',
  'horror-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=27&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'documentary',
  'documentary-pagination',
  'documentary-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=99&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'animation',
  'animation-pagination',
  'animation-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=16&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'sci-fi',
  'sci-fi-pagination',
  'sci-fi-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=878&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'romantic',
  'romantic-pagination',
  'romantic-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=10749&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'thriller',
  'thriller-pagination',
  'thriller-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=53&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'mystery',
  'mystery-pagination',
  'mystery-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=9648&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'comedy',
  'comedy-pagination',
  'comedy-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=35&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'fantasy',
  'fantasy-pagination',
  'fantasy-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=14&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'family',
  'family-pagination',
  'family-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=10751&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'tv-series',
  'tv-series-pagination',
  'tv-series-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=10770&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'crime',
  'crime-pagination',
  'crime-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_genres=80&sort_by=popularity.desc&vote_count.gte=8`
);

setupPagination(
  'classic',
  'classic-pagination',
  'classic-div',
  `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=popularity.desc&release_date.lte=1980`
);

document.addEventListener('DOMContentLoaded', function () {
  updateSignInButtonState();
  document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

function handleSearch() {
  const searchQuery = document.getElementById('search').value;

  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'MovieVerse-Frontend/html/search.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const notificationBtn = document.getElementById('notificationBtn');

  notificationBtn.addEventListener('click', () => {
    window.location.href = 'MovieVerse-Frontend/html/notifications.html';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const stickyMenuButton = document.getElementById('sticky-menu-button');

  stickyMenuButton.style.display = 'none';

  // Function to check if the device is mobile
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  // Function to toggle visibility based on scroll position and device type
  function toggleStickyMenuButton() {
    if (isMobileDevice() && window.scrollY > 0) {
      stickyMenuButton.style.display = 'flex';
    } else {
      stickyMenuButton.style.display = 'none';
    }
  }

  window.addEventListener('scroll', toggleStickyMenuButton);
  window.addEventListener('resize', toggleStickyMenuButton);
});
