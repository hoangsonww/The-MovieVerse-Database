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
    const mostPopularUrl = `https://${getMovieVerseData()}/3/trending/movie/day?${generateMovieNames()}${getMovieCode()}`;
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

const API_PAGE_SIZE = 20;

function sortResultsByPopularity(results) {
  if (!Array.isArray(results)) return [];
  const popularityThreshold = 0.5;
  return results.slice().sort((a, b) => {
    const popularityDifference = Math.abs(a.popularity - b.popularity);
    return popularityDifference < popularityThreshold ? b.vote_average - a.vote_average : b.popularity - a.popularity;
  });
}

async function fetchResultsForLocalPage(baseUrl, localPage, itemsPerPage) {
  const offset = (localPage - 1) * itemsPerPage;
  const startApiPage = Math.floor(offset / API_PAGE_SIZE) + 1;
  const startIndex = offset % API_PAGE_SIZE;
  const pagesNeeded = Math.ceil((startIndex + itemsPerPage) / API_PAGE_SIZE);

  let combinedResults = [];
  let totalResults = null;

  for (let i = 0; i < pagesNeeded; i += 1) {
    const apiPage = startApiPage + i;
    const url = `${baseUrl}&page=${apiPage}&_=${Date.now()}`;
    const response = await fetch(url);
    const data = await response.json();
    if (totalResults === null) {
      totalResults = data.total_results ?? (data.total_pages ? data.total_pages * API_PAGE_SIZE : null);
    }
    const pageResults = sortResultsByPopularity(data.results || []);
    combinedResults = combinedResults.concat(pageResults);
  }

  return {
    results: combinedResults.slice(startIndex, startIndex + itemsPerPage),
    totalResults,
  };
}

function setupPagination(mainElementId, paginationContainerId, genresContainerId, baseUrl, options = {}) {
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
    getMovies(baseUrl, mainElement, currentPage, options);
  };

  async function getMovies(url, mainElement, page, options) {
    showSpinner();

    try {
      const numberOfMovies = calculateMoviesToDisplay();
      const { results, totalResults } = await fetchResultsForLocalPage(url, page, numberOfMovies);

      if (totalResults) {
        totalPages = Math.min(Math.ceil(totalResults / numberOfMovies), 250);
      }

      if (results.length > 0) {
        showMovies(results, mainElement, options);
      } else {
        mainElement.innerHTML = `<p style="color: inherit;">No movies found on this page.</p>`;
      }
    } catch (error) {
      console.log('Error fetching data: ', error);
      mainElement.innerHTML = `<p style="color: inherit;">No movies found on this page.</p>`;
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

  // 📌 Reapply User Preferred Color After DOM Update
  setTimeout(() => {
    const savedTextColor = localStorage.getItem('textColor');
    if (savedTextColor) {
      paginationContainer.querySelectorAll('button').forEach(btn => {
        btn.style.color = savedTextColor;
      });
    }
  }, 0);
}

async function fetchDiscoverResults(url) {
  const response = await fetch(`${url}`);
  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

function getStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch (error) {
    console.log('Error parsing localStorage for', key, error);
    return {};
  }
}

function getStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.log('Error parsing localStorage for', key, error);
    return [];
  }
}

function getGenreCache(cacheKey) {
  return getStoredObject(cacheKey);
}

function setGenreCache(cacheKey, cache) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch (error) {
    console.log('Error saving genre cache', cacheKey, error);
  }
}

async function fetchGenresForMovie(movieId) {
  const movieDetailsUrl = `https://${getMovieVerseData()}/3/movie/${movieId}?${generateMovieNames()}${getMovieCode()}`;
  const response = await fetch(movieDetailsUrl);
  const movieDetails = await response.json();
  return Array.isArray(movieDetails.genres) ? movieDetails.genres.map(genre => genre.id) : [];
}

async function fetchGenresForTvSeries(tvSeriesId) {
  const tvDetailsUrl = `https://${getMovieVerseData()}/3/tv/${tvSeriesId}?${generateMovieNames()}${getMovieCode()}`;
  const response = await fetch(tvDetailsUrl);
  const tvDetails = await response.json();
  return Array.isArray(tvDetails.genres) ? tvDetails.genres.map(genre => genre.id) : [];
}

async function getGenresWithCache(mediaType, mediaId) {
  const cacheKey = mediaType === 'tv' ? 'tvGenreCache' : 'movieGenreCache';
  const cache = getGenreCache(cacheKey);
  const cacheId = String(mediaId);

  if (cache[cacheId]) {
    return cache[cacheId];
  }

  const genres = mediaType === 'tv' ? await fetchGenresForTvSeries(mediaId) : await fetchGenresForMovie(mediaId);
  cache[cacheId] = genres;
  setGenreCache(cacheKey, cache);
  return genres;
}

function addGenreWeights(weights, genres, weight) {
  genres.forEach(genreId => {
    if (!genreId) return;
    const key = String(genreId);
    weights[key] = (weights[key] || 0) + weight;
  });
}

function getTopEntriesByValue(items, limit = 6) {
  return Object.entries(items)
    .sort((a, b) => (b[1]?.count || b[1]) - (a[1]?.count || a[1]))
    .slice(0, limit);
}

async function buildGenreWeightsForMovies() {
  const weights = {};
  const favoriteGenres = getStoredArray('favoriteGenres');
  favoriteGenres.forEach(genreId => addGenreWeights(weights, [genreId], 2));

  const movieVisits = getStoredObject('movieVisits');
  const topVisited = getTopEntriesByValue(movieVisits, 6);
  for (const [movieId, visitData] of topVisited) {
    const genres = await getGenresWithCache('movie', movieId);
    const weight = Math.min(visitData.count || 1, 5) + 1;
    addGenreWeights(weights, genres, weight);
  }

  const moviesFavorited = getStoredArray('moviesFavorited').slice(0, 8);
  for (const movieId of moviesFavorited) {
    const genres = await getGenresWithCache('movie', movieId);
    addGenreWeights(weights, genres, 4);
  }

  const movieRatings = getStoredObject('movieRatings');
  const topRated = Object.entries(movieRatings)
    .filter(([, rating]) => Number(rating) >= 4)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 6);
  for (const [movieId, rating] of topRated) {
    const genres = await getGenresWithCache('movie', movieId);
    addGenreWeights(weights, genres, Number(rating));
  }

  return weights;
}

async function buildGenreWeightsForTvSeries() {
  const weights = {};
  const favoritesTVSeries = getStoredArray('favoritesTVSeries').slice(0, 8);
  for (const tvSeriesId of favoritesTVSeries) {
    const genres = await getGenresWithCache('tv', tvSeriesId);
    addGenreWeights(weights, genres, 4);
  }

  const tvSeriesVisits = getStoredObject('tvSeriesVisits');
  const topVisited = getTopEntriesByValue(tvSeriesVisits, 6);
  for (const [tvSeriesId, visitData] of topVisited) {
    const genres = await getGenresWithCache('tv', tvSeriesId);
    const weight = Math.min(visitData.count || 1, 5) + 1;
    addGenreWeights(weights, genres, weight);
  }

  const tvSeriesRatings = getStoredObject('tvSeriesRatings');
  const topRated = Object.entries(tvSeriesRatings)
    .filter(([, rating]) => Number(rating) >= 4)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 6);
  for (const [tvSeriesId, rating] of topRated) {
    const genres = await getGenresWithCache('tv', tvSeriesId);
    addGenreWeights(weights, genres, Number(rating));
  }

  const movieGenreSignals = getStoredArray('favoriteGenres');
  movieGenreSignals.forEach(genreId => addGenreWeights(weights, [genreId], 1));

  return weights;
}

function getTopGenresFromWeights(weights, limit = 3) {
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genreId]) => genreId)
    .filter(Boolean);
}

function collectExcludedIds(mediaType) {
  const excluded = new Set();
  if (mediaType === 'tv') {
    getStoredArray('favoritesTVSeries').forEach(id => excluded.add(String(id)));
    Object.keys(getStoredObject('tvSeriesRatings')).forEach(id => excluded.add(String(id)));
    Object.keys(getStoredObject('tvSeriesVisits')).forEach(id => excluded.add(String(id)));
    return excluded;
  }

  getStoredArray('moviesFavorited').forEach(id => excluded.add(String(id)));
  Object.keys(getStoredObject('movieVisits')).forEach(id => excluded.add(String(id)));
  getStoredArray('uniqueMoviesViewed').forEach(id => excluded.add(String(id)));
  Object.keys(getStoredObject('movieRatings')).forEach(id => excluded.add(String(id)));
  return excluded;
}

async function fetchRecommendationsByGenres(genreIds, mediaType, pageNum, limit) {
  const safeMediaType = mediaType === 'tv' ? 'tv' : 'movie';
  const excludedIds = collectExcludedIds(safeMediaType);
  const urls = genreIds.map(
    genreId =>
      `https://${getMovieVerseData()}/3/discover/${safeMediaType}?${generateMovieNames()}${getMovieCode()}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=10&page=${pageNum}`
  );

  const results = await Promise.all(urls.map(fetchDiscoverResults));
  const merged = results.flat().filter(item => !excludedIds.has(String(item.id)));
  const dedupedMap = new Map();

  merged.forEach(item => {
    if (!dedupedMap.has(item.id)) {
      dedupedMap.set(item.id, item);
    }
  });

  const deduped = Array.from(dedupedMap.values());
  deduped.sort(() => Math.random() - 0.5);
  return deduped.slice(0, limit);
}

function renderRecommendationsEmptyState() {
  return `
    <div
      class="recommendations-empty"
      style="
        display: flex;
        gap: 18px;
        align-items: center;
        justify-content: flex-start;
        padding: 22px 24px;
        border-radius: 18px;
        background: linear-gradient(140deg, rgba(255, 134, 35, 0.18), rgba(10, 12, 24, 0.5));
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
        margin: 22px 0 16px;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
      "
    >
      <div
        style="
          font-size: 20px;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255, 134, 35, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffdc88;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(255, 134, 35, 0.3);
        "
      >
        ★
      </div>
      <div style="flex: 1;">
        <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 1.05rem;">No recommendations yet</h4>
        <p style="margin: 0; color: rgba(255, 255, 255, 0.75); font-size: 0.95rem; text-align: left;">
          Give us a few signals and we’ll build a mix that fits your taste.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px;">
          <div
            style="
              padding: 8px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.2);
              display: flex;
              gap: 8px;
              align-items: center;
              color: rgba(255, 255, 255, 0.85);
              font-size: 0.84rem;
              text-transform: uppercase;
              letter-spacing: 0.4px;
            "
          >
            <span style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.65);">01</span>
            <strong>Visit a movie or TV series</strong>
          </div>
          <div
            style="
              padding: 8px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.2);
              display: flex;
              gap: 8px;
              align-items: center;
              color: rgba(255, 255, 255, 0.85);
              font-size: 0.84rem;
              text-transform: uppercase;
              letter-spacing: 0.4px;
            "
          >
            <span style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.65);">02</span>
            <strong>Rate a title</strong>
          </div>
          <div
            style="
              padding: 8px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.2);
              display: flex;
              gap: 8px;
              align-items: center;
              color: rgba(255, 255, 255, 0.85);
              font-size: 0.84rem;
              text-transform: uppercase;
              letter-spacing: 0.4px;
            "
          >
            <span style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.65);">03</span>
            <strong>Favorite a movie/TV series</strong>
          </div>
          <div
            style="
              padding: 8px 12px;
              border-radius: 999px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.2);
              display: flex;
              gap: 8px;
              align-items: center;
              color: rgba(255, 255, 255, 0.85);
              font-size: 0.84rem;
              text-transform: uppercase;
              letter-spacing: 0.4px;
            "
          >
            <span style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.65);">04</span>
            <strong>Explore a category</strong>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <a
            href="#most-popular"
            style="
              padding: 8px 14px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.12);
              color: #fff;
              text-decoration: none;
              border: 1px solid rgba(255, 255, 255, 0.2);
              font-size: 0.78rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.4px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            "
            onmouseover="this.style.transform='translateY(-2px)';this.style.background='rgba(255,134,35,0.3)';this.style.borderColor='rgba(255,134,35,0.6)';this.style.boxShadow='0 10px 18px rgba(0,0,0,0.25)'"
            onmouseout="this.style.transform='translateY(0)';this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.2)';this.style.boxShadow='none'"
          >
            <span style="font-size: 0.9rem;">→</span>
            Popular Movies
          </a>
          <a
            href="#tv-series"
            style="
              padding: 8px 14px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.12);
              color: #fff;
              text-decoration: none;
              border: 1px solid rgba(255, 255, 255, 0.2);
              font-size: 0.78rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.4px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            "
            onmouseover="this.style.transform='translateY(-2px)';this.style.background='rgba(255,134,35,0.3)';this.style.borderColor='rgba(255,134,35,0.6)';this.style.boxShadow='0 10px 18px rgba(0,0,0,0.25)'"
            onmouseout="this.style.transform='translateY(0)';this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.2)';this.style.boxShadow='none'"
          >
            <span style="font-size: 0.9rem;">→</span>
            Popular TV
          </a>
          <a
            href="#award-winning"
            style="
              padding: 8px 14px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.12);
              color: #fff;
              text-decoration: none;
              border: 1px solid rgba(255, 255, 255, 0.2);
              font-size: 0.78rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.4px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            "
            onmouseover="this.style.transform='translateY(-2px)';this.style.background='rgba(255,134,35,0.3)';this.style.borderColor='rgba(255,134,35,0.6)';this.style.boxShadow='0 10px 18px rgba(0,0,0,0.25)'"
            onmouseout="this.style.transform='translateY(0)';this.style.background='rgba(255,255,255,0.12)';this.style.borderColor='rgba(255,255,255,0.2)';this.style.boxShadow='none'"
          >
            <span style="font-size: 0.9rem;">→</span>
            Award-Winning
          </a>
        </div>
      </div>
    </div>
  `;
}

function updatePaginationDisplay(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = '';

  const prevButton = createNavigationButton('<', currentPage > 1, () => onPageChange(currentPage - 1));
  container.appendChild(prevButton);

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + 4, totalPages);

  if (endPage === totalPages) startPage = Math.max(endPage - 4, 1);

  if (startPage > 1) {
    container.appendChild(createPageButton(1, onPageChange));
    if (startPage > 2) container.appendChild(createPageButton('...'));
  }

  for (let i = startPage; i <= endPage; i++) {
    container.appendChild(createPageButton(i, onPageChange, i === currentPage));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) container.appendChild(createPageButton('...'));
    container.appendChild(createPageButton(totalPages, onPageChange));
  }

  const nextButton = createNavigationButton('>', currentPage < totalPages, () => onPageChange(currentPage + 1));
  container.appendChild(nextButton);
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

document.addEventListener('DOMContentLoaded', async () => {
  let currentPageRecommended = 1;
  const totalPagesRecommended = 60;
  let recommendationSpinnerCount = 0;
  const recommendedMain = document.getElementById('recommended-list');
  const paginationContainer = document.getElementById('recommended-pagination');
  const emptyState = document.getElementById('recommended-empty');
  const recommendedHeader = document.getElementById('recommendedDIV');

  if (!recommendedMain || !paginationContainer || !emptyState || !recommendedHeader) {
    return;
  }

  function showRecommendationSpinner() {
    recommendationSpinnerCount += 1;
    showSpinner();
  }

  function hideRecommendationSpinner() {
    recommendationSpinnerCount = Math.max(0, recommendationSpinnerCount - 1);
    if (recommendationSpinnerCount === 0) {
      hideSpinner();
    }
  }

  function interleaveRecommendations(movieRecs, tvRecs, limit) {
    const combined = [];
    let movieIndex = 0;
    let tvIndex = 0;
    let useMovie = movieRecs.length >= tvRecs.length;

    while (combined.length < limit && (movieIndex < movieRecs.length || tvIndex < tvRecs.length)) {
      if (useMovie && movieIndex < movieRecs.length) {
        combined.push({ ...movieRecs[movieIndex], _mediaType: 'movie' });
        movieIndex += 1;
      } else if (!useMovie && tvIndex < tvRecs.length) {
        combined.push({ ...tvRecs[tvIndex], _mediaType: 'tv' });
        tvIndex += 1;
      } else if (movieIndex < movieRecs.length) {
        combined.push({ ...movieRecs[movieIndex], _mediaType: 'movie' });
        movieIndex += 1;
      } else if (tvIndex < tvRecs.length) {
        combined.push({ ...tvRecs[tvIndex], _mediaType: 'tv' });
        tvIndex += 1;
      }

      useMovie = !useMovie;
    }

    return combined;
  }

  async function generateRecommendations(pageNum = currentPageRecommended) {
    showRecommendationSpinner();
    try {
      currentPageRecommended = pageNum;
      recommendedMain.innerHTML = '';

      const [movieWeights, tvWeights] = await Promise.all([buildGenreWeightsForMovies(), buildGenreWeightsForTvSeries()]);
      const topMovieGenres = getTopGenresFromWeights(movieWeights, 3);
      const topTvGenres = getTopGenresFromWeights(tvWeights, 3);

      if (!topMovieGenres.length && !topTvGenres.length) {
        emptyState.innerHTML = renderRecommendationsEmptyState();
        emptyState.hidden = false;
        paginationContainer.style.display = 'none';
        return;
      }

      const totalToDisplay = calculateMoviesToDisplay();
      const moviePromise = topMovieGenres.length
        ? fetchRecommendationsByGenres(topMovieGenres, 'movie', currentPageRecommended, totalToDisplay)
        : Promise.resolve([]);
      const tvPromise = topTvGenres.length
        ? fetchRecommendationsByGenres(topTvGenres, 'tv', currentPageRecommended, totalToDisplay)
        : Promise.resolve([]);

      const [movieRecs, tvRecs] = await Promise.all([moviePromise, tvPromise]);
      const combined = interleaveRecommendations(movieRecs, tvRecs, totalToDisplay);

      if (!combined.length) {
        emptyState.innerHTML = renderRecommendationsEmptyState();
        emptyState.hidden = false;
        paginationContainer.style.display = 'none';
        return;
      }

      emptyState.hidden = true;
      paginationContainer.style.display = '';
      await showMovies(combined, recommendedMain, { mediaType: 'mixed' });
      updatePaginationDisplay(paginationContainer, currentPageRecommended, totalPagesRecommended, generateRecommendations);
    } finally {
      hideRecommendationSpinner();
    }
  }

  await generateRecommendations();

  function movePagination() {
    if (window.innerWidth <= 767) {
      recommendedMain.parentNode.insertBefore(paginationContainer, recommendedMain);
    } else {
      recommendedHeader.appendChild(paginationContainer);
    }
  }

  movePagination();
  window.addEventListener('resize', movePagination);
});

document.addEventListener('DOMContentLoaded', () => {
  const directorPagination = document.getElementById('director-spotlight-pagination');
  const directorHeader = document.getElementById('director-spotlight-header');
  const directorTitleRow = document.getElementById('director-spotlight-title-row');
  const directorMain = document.getElementById('director-spotlight');

  if (!directorPagination || !directorHeader || !directorMain || !directorTitleRow) {
    return;
  }

  function moveDirectorPagination() {
    if (window.innerWidth <= 767) {
      directorMain.parentNode.insertBefore(directorPagination, directorMain);
    } else {
      directorTitleRow.appendChild(directorPagination);
    }
  }

  moveDirectorPagination();
  window.addEventListener('resize', moveDirectorPagination);
});

async function getMovies(url, mainElement, page = 1, options = {}) {
  showSpinner();

  const numberOfMovies = calculateMoviesToDisplay();
  try {
    const { results } = await fetchResultsForLocalPage(url, page, numberOfMovies);
    if (results.length > 0) {
      showMovies(results, mainElement, options);
    } else {
      mainElement.innerHTML = `<p>We're having trouble fetching movies right now. Please try again later.</p>`;
    }
  } catch (error) {
    console.log('Error fetching data: ', error);
    mainElement.innerHTML = `<p>We're having trouble fetching movies right now. Please try again later.</p>`;
  } finally {
    hideSpinner();
  }
}

async function getAdditionalPosters(movieId, mediaType = 'movie') {
  const safeMediaType = mediaType === 'tv' ? 'tv' : 'movie';
  const response = await fetch(`https://${getMovieVerseData()}/3/${safeMediaType}/${movieId}/images?${generateMovieNames()}${getMovieCode()}`);
  const data = await response.json();
  const posters = Array.isArray(data.posters) ? data.posters : [];
  return posters.map(poster => poster.file_path);
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
    interactionTarget.addEventListener('pointermove', onPointerMove, {
      passive: false,
    });
    interactionTarget.addEventListener('pointerup', onPointerUp);
    interactionTarget.addEventListener('pointercancel', onPointerUp);
  } else if (supportsTouch) {
    interactionTarget.addEventListener('touchstart', onTouchStart, {
      passive: false,
    });
    interactionTarget.addEventListener('touchmove', onTouchMove, {
      passive: false,
    });
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

window.addEventListener('resize', () => {
  document.querySelectorAll('main').forEach(mainElement => initSpotlightCarousel(mainElement));
});

async function showMovies(movies, mainElement, options = {}) {
  const mediaType = options.mediaType === 'tv' ? 'tv' : options.mediaType === 'mixed' ? 'mixed' : 'movie';
  const isMixed = mediaType === 'mixed';

  if (!options.append) {
    mainElement.innerHTML = '';
  }

  // Inject CSS for the sliding-up animation effect with delay support
  const style = document.createElement('style');
  style.innerHTML = `
    .movie {
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity 0.6s ease,
        transform 0.6s ease,
        filter 0.6s ease,
        box-shadow 0.6s ease;
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
          const posterMediaType = movieEl.dataset.mediaType === 'tv' ? 'tv' : 'movie';
          const movieImageContainer = movieEl.querySelector('.movie-images');

          // If there's no valid poster_path, do not run rotation
          if (!movieEl.dataset.posterPath || typeof IMGPATH === 'undefined') {
            movieImageContainer.innerHTML = `<div style="color: inherit; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Image Not Available</div>`;
            observer.unobserve(movieEl);
            continue; // Skip the rest of the loop for this movie
          }

          // Fetch additional posters and set up rotation in the background
          const additionalPosters = await getAdditionalPosters(movieId, posterMediaType);
          let allPosters = [movieEl.dataset.posterPath, ...additionalPosters];

          // Shuffle and limit to 10 posters
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

          // Start rotating images in the background only if there are valid images
          if (allPosters.length > 1) {
            rotateImages(Array.from(movieImageContainer.children));
          }

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
    let { id, poster_path, title, name, vote_average, vote_count, overview, genre_ids } = movie;
    const itemMediaType = isMixed ? (movie._mediaType === 'tv' ? 'tv' : 'movie') : mediaType;
    const isTv = itemMediaType === 'tv';
    const fullTitle = title || name || 'Title not available';
    let displayTitle = fullTitle;

    const movieEl = document.createElement('div');
    movieEl.style.zIndex = '1000';
    movieEl.classList.add('movie');
    movieEl.dataset.id = id;
    movieEl.dataset.posterPath = poster_path;
    movieEl.dataset.title = fullTitle;
    movieEl.dataset.mediaType = itemMediaType;

    const words = displayTitle.split(' ');
    if (words.length >= 8) {
      words[7] = '...';
      displayTitle = words.slice(0, 8).join(' ');
    }

    const voteAvg = vote_count === 0 ? 'Unrated' : vote_average.toFixed(1);
    const ratingClass = vote_count === 0 ? 'unrated' : getClassByRate(vote_average);

    if (overview === '') {
      overview = 'No overview available.';
    }

    movieEl.innerHTML = `
    <div class="movie-image-container">
        <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #333;">
            ${
              typeof IMGPATH !== 'undefined' && poster_path
                ? `<img src="${IMGPATH + poster_path}" loading="lazy" alt="${displayTitle} poster" width="150" height="225" 
                     style="position: absolute; top: 0; left: 0; transition: opacity 1s ease-in-out; opacity: 1;" 
                     onerror="this.onerror=null; this.parentNode.innerHTML='<div style=\\'color: inherit; font-weight: bold; text-align: center;\\'>Image Not Available</div>';">`
                : `<div style="color: inherit; font-weight: bold; text-align: center;">Image Not Available</div>`
            }
        </div>
    </div>
    <div class="movie-info" style="display: flex; align-items: flex-start; cursor: pointer;">
        <h3 style="text-align: left; margin-right: 10px; flex: 1 1 auto;">${displayTitle}</h3>
        <span class="${ratingClass}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; margin-left: auto;">${voteAvg}</span>
    </div>
    <div class="overview" style="cursor: pointer;">
        <h4>Overview: </h4>
        ${overview}
    </div>`;

    movieEl.addEventListener('click', () => {
      if (!isTv) {
        updateUniqueMoviesViewed(id);
        updateFavoriteGenre(genre_ids);
        updateMovieVisitCount(id, displayTitle);
        // Navigate to movie details page with the movieId as a query parameter
        window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${id}`;
        return;
      }

      updateTvSeriesVisitCount(id, displayTitle);
      // Navigate to TV details page with the tvSeriesId as a query parameter
      window.location.href = `MovieVerse-Frontend/html/tv-details.html?tvSeriesId=${id}`;
    });

    mainElement.appendChild(movieEl);

    // Observe for the slide-up animation
    slideObserver.observe(movieEl);

    // Observe for background image loading and rotation
    imageObserver.observe(movieEl);
  });

  initSpotlightCarousel(mainElement);
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

function updateTvSeriesVisitCount(tvSeriesId, tvSeriesTitle) {
  let tvSeriesVisits = JSON.parse(localStorage.getItem('tvSeriesVisits')) || {};
  if (!tvSeriesVisits[tvSeriesId]) {
    tvSeriesVisits[tvSeriesId] = { count: 0, title: tvSeriesTitle };
  }
  tvSeriesVisits[tvSeriesId].count += 1;
  localStorage.setItem('tvSeriesVisits', JSON.stringify(tvSeriesVisits));
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
  return API_PAGE_SIZE;
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

  if (!sideNav.contains(event.target) && !navToggle.contains(event.target) && sideNav.classList.contains('manual-toggle')) {
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

document.addEventListener('DOMContentLoaded', () => {
  const tocToggle = document.querySelector('.side-nav .toc-toggle');
  const tocList = document.getElementById('side-nav-toc-list');
  const tocItem = document.querySelector('.side-nav .side-nav-toc');

  if (!tocToggle || !tocList || !tocItem) {
    return;
  }

  const setTocState = isOpen => {
    tocItem.classList.toggle('is-open', isOpen);
    tocToggle.setAttribute('aria-expanded', String(isOpen));
    tocList.setAttribute('aria-hidden', String(!isOpen));
    tocList.style.maxHeight = isOpen ? `${tocList.scrollHeight}px` : '0px';
  };

  setTocState(false);

  tocToggle.addEventListener('click', () => {
    const isOpen = tocItem.classList.contains('is-open');
    setTocState(!isOpen);
  });

  window.addEventListener('resize', () => {
    if (tocItem.classList.contains('is-open')) {
      tocList.style.maxHeight = `${tocList.scrollHeight}px`;
    }
  });
});

const DATABASEURL = `https://${getMovieVerseData()}/3/discover/movie?sort_by=popularity.desc&${generateMovieNames()}${getMovieCode()}`;
const IMGPATH = `https://image.tmdb.org/t/p/w500`;
const SPOTLIGHT_BACKDROP_IMGPATH = `https://image.tmdb.org/t/p/w1280`;
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
let currentDirectorPage = 1;
let directorTotalPages = 1;
updateDirectorSpotlight();

function changeDirector() {
  currentDirectorIndex++;

  if (currentDirectorIndex >= directors.length) {
    currentDirectorIndex = 0;
  }
  currentDirectorPage = 1;
  updateDirectorSpotlight();
}

setInterval(changeDirector, 3600000);

function updateDirectorSpotlight() {
  const director = directors[currentDirectorIndex];
  document.getElementById('spotlight-director-name').textContent = director.name;

  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_people=${
    director.id
  }&sort_by=popularity.desc&sort_by=vote_average.desc`;
  getDirectorSpotlight(url, currentDirectorPage);
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

async function getDirectorSpotlight(url, page = 1) {
  showSpinner();
  const numberOfMovies = calculateMoviesToDisplay();
  try {
    const { results, totalResults } = await fetchResultsForLocalPage(url, page, numberOfMovies);

    if (totalResults) {
      directorTotalPages = Math.min(Math.ceil(totalResults / numberOfMovies), 250);
    } else {
      directorTotalPages = 1;
    }

    if (results.length > 0) {
      showMoviesDirectorSpotlight(results);
    } else {
      director_main.innerHTML = `<p style="color: inherit;">No movies found for this director.</p>`;
    }

    updateDirectorPagination();
  } finally {
    hideSpinner();
  }
}

function updateDirectorPagination() {
  const paginationContainer = document.getElementById('director-spotlight-pagination');
  if (!paginationContainer) return;

  updatePaginationDisplay(paginationContainer, currentDirectorPage, directorTotalPages, pageNum => {
    currentDirectorPage = pageNum;
    updateDirectorSpotlight();
  });
}

async function showMoviesDirectorSpotlight(movies) {
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
          movieEl.style.transitionDelay = `${index * 100}ms`;
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
          const movieImageContainer = movieEl.querySelector('.movie-images');

          // If there's no valid poster_path, do not run rotation
          if (!movieEl.dataset.posterPath || typeof IMGPATH === 'undefined') {
            movieImageContainer.innerHTML = `<div style="color: inherit; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Image Not Available</div>`;
            observer.unobserve(movieEl);
            continue;
          }

          // Fetch additional posters and set up rotation in the background
          const additionalPosters = await getAdditionalPosters(movieId);
          let allPosters = [movieEl.dataset.posterPath, ...additionalPosters];

          // Shuffle and limit to 10 posters
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
              if (index === 0) img.style.opacity = '1';
            };
          });

          // Start rotating images in the background only if there are valid images
          if (allPosters.length > 1) {
            rotateImages(Array.from(movieImageContainer.children));
          }

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
        <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #333;">
          ${
            typeof IMGPATH !== 'undefined' && poster_path
              ? `<img src="${IMGPATH + poster_path}" loading="lazy" alt="${title} poster" width="150" height="225" style="position: absolute; top: 0; left: 0; transition: opacity 1s ease-in-out; opacity: 1;" onerror="this.onerror=null; this.parentNode.innerHTML='<div style=\\'color: inherit; font-weight: bold; text-align: center;\\'>Image Not Available</div>';">`
              : `<div style="color: inherit; font-weight: bold; text-align: center;">Image Not Available</div>`
          }
        </div>
      </div>
      <div class="movie-info" style="display: flex; align-items: flex-start; cursor: pointer;">
          <h3 style="text-align: left; margin-right: 10px; flex: 1;">${title}</h3>
          <span class="${ratingClass}" style="white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; margin-left: auto;">${voteAvg}</span>
      </div>
      <div class="overview" style="cursor: pointer;">
          <h4>Overview: </h4>
          ${overview}
      </div>`;

    movieEl.addEventListener('click', () => {
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
      window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${id}`;
    });

    director_main.appendChild(movieEl);
    slideObserver.observe(movieEl);
    imageObserver.observe(movieEl);
  });

  initSpotlightCarousel(director_main);
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
  `https://${getMovieVerseData()}/3/tv/popular?${generateMovieNames()}${getMovieCode()}`,
  { mediaType: 'tv' }
);

setupPagination(
  'top-rated-tv-series',
  'top-rated-tv-series-pagination',
  'top-rated-tv-series-div',
  `https://${getMovieVerseData()}/3/tv/top_rated?${generateMovieNames()}${getMovieCode()}`,
  { mediaType: 'tv' }
);

setupPagination(
  'airing-today-tv-series',
  'airing-today-tv-series-pagination',
  'airing-today-tv-series-div',
  `https://${getMovieVerseData()}/3/tv/airing_today?${generateMovieNames()}${getMovieCode()}`,
  { mediaType: 'tv' }
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

function escapeTrendingText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TRENDING_GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

function getTrendingGenres(genreIds, limit = 3) {
  if (!Array.isArray(genreIds)) return [];
  const names = genreIds.map(id => TRENDING_GENRE_MAP[id]).filter(Boolean);
  return Array.from(new Set(names)).slice(0, limit);
}

function formatTrendingYear(dateValue) {
  if (!dateValue) return '—';
  const year = new Date(dateValue).getFullYear();
  return Number.isNaN(year) ? '—' : year;
}

function formatTrendingDate(dateValue) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function truncateTrendingOverview(text, maxLength = 280) {
  if (!text) return 'No overview available yet.';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function buildTrendingSlide(item, index) {
  const title = escapeTrendingText(item.title || item.name || 'Untitled');
  const overview = escapeTrendingText(truncateTrendingOverview(item.overview));
  const mediaLabel = item.media_type === 'tv' ? 'TV Series' : 'Movie';
  const year = formatTrendingYear(item.release_date || item.first_air_date);
  const fullDate = formatTrendingDate(item.release_date || item.first_air_date);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '—';
  const popularity = typeof item.popularity === 'number' ? Math.round(item.popularity) : '—';
  const votes = item.vote_count ? item.vote_count.toLocaleString() : '—';
  const language = item.original_language ? item.original_language.toUpperCase() : '—';
  const originalTitle = escapeTrendingText(item.original_title || item.original_name || title);
  const originCountry = Array.isArray(item.origin_country) && item.origin_country.length ? item.origin_country[0] : '—';
  const adultLabel = item.adult ? '18+' : 'PG';
  const genres = getTrendingGenres(item.genre_ids);
  const genresMarkup = genres.length
    ? genres.map(name => `<span class="hero-tag">${escapeTrendingText(name)}</span>`).join('')
    : `<span class="hero-tag">Trending</span>`;
  const backdropUrl = item.backdrop_path ? `${SPOTLIGHT_BACKDROP_IMGPATH}${item.backdrop_path}` : '';
  const posterUrl = item.poster_path ? `${IMGPATH}${item.poster_path}` : '';
  const backdropStyle = backdropUrl ? ` style="background-image: url('${backdropUrl}');"` : '';
  const posterMarkup = posterUrl ? `<img src="${posterUrl}" alt="${title} poster" loading="lazy" />` : '';

  return `
    <article class="trending-slide${index === 0 ? ' is-active' : ''}" data-index="${index}">
      <div class="hero-backdrop"${backdropStyle}></div>
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-pills">
          <span class="pill pill-primary">Trending Now</span>
          <span class="pill pill-outline">${mediaLabel}</span>
          <span class="pill pill-muted">Spotlight</span>
        </div>
        <h2>${title}</h2>
        <p>${overview}</p>
        <div class="hero-meta">
          <span><i class="fas fa-calendar-alt"></i> ${year}</span>
          <span><i class="fas fa-star"></i> ${rating}</span>
          <span><i class="fas fa-fire"></i> Hot pick</span>
        </div>
        <div class="hero-meta hero-meta-secondary">
          <span><i class="fas fa-chart-line"></i> ${popularity} popularity</span>
          <span><i class="fas fa-users"></i> ${votes} votes</span>
          <span><i class="fas fa-language"></i> ${language}</span>
          <span><i class="fas fa-trophy"></i> #${index + 1}</span>
        </div>
        <div class="hero-details">
          <div class="detail-item">
            <span class="detail-label">Original</span>
            <span class="detail-value">${originalTitle}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Release</span>
            <span class="detail-value">${fullDate}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Origin</span>
            <span class="detail-value">${originCountry}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Rating</span>
            <span class="detail-value">${adultLabel}</span>
          </div>
        </div>
        <div class="hero-tags">
          ${genresMarkup}
        </div>
        <div class="hero-actions">
          <button class="hero-btn trending-cta" data-media-type="${item.media_type}" data-id="${item.id}">
            <i class="fas fa-play"></i>
            View details
          </button>
        </div>
      </div>
      <div class="hero-poster">${posterMarkup}</div>
    </article>
  `;
}

function renderTrendingSkeleton(slidesContainer, dotsContainer, prevButton, nextButton) {
  slidesContainer.innerHTML = `
    <article class="trending-slide is-active trending-skeleton">
      <div class="hero-backdrop skeleton-block"></div>
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-pills">
          <span class="pill pill-primary skeleton-pill"></span>
          <span class="pill pill-outline skeleton-pill"></span>
          <span class="pill pill-muted skeleton-pill"></span>
        </div>
        <div class="skeleton-line line-lg"></div>
        <div class="skeleton-line line-md"></div>
        <div class="skeleton-line line-md"></div>
        <div class="hero-meta">
          <span class="skeleton-line line-sm"></span>
          <span class="skeleton-line line-sm"></span>
          <span class="skeleton-line line-sm"></span>
        </div>
        <div class="hero-meta hero-meta-secondary">
          <span class="skeleton-line line-xs"></span>
          <span class="skeleton-line line-xs"></span>
          <span class="skeleton-line line-xs"></span>
          <span class="skeleton-line line-xs"></span>
        </div>
        <div class="hero-details">
          <div class="detail-item"><span class="skeleton-line line-sm"></span></div>
          <div class="detail-item"><span class="skeleton-line line-sm"></span></div>
          <div class="detail-item"><span class="skeleton-line line-sm"></span></div>
          <div class="detail-item"><span class="skeleton-line line-sm"></span></div>
        </div>
        <div class="hero-tags">
          <span class="hero-tag skeleton-pill"></span>
          <span class="hero-tag skeleton-pill"></span>
          <span class="hero-tag skeleton-pill"></span>
        </div>
        <div class="hero-actions">
          <span class="hero-btn skeleton-btn"></span>
        </div>
      </div>
      <div class="hero-poster">
        <div class="skeleton-poster"></div>
      </div>
    </article>
  `;
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
  }
  if (prevButton) {
    prevButton.setAttribute('disabled', 'true');
  }
  if (nextButton) {
    nextButton.setAttribute('disabled', 'true');
  }
}

async function initTrendingSpotlight() {
  const slider = document.getElementById('trendingSlider');
  const slidesContainer = document.getElementById('trendingSlides');
  const dotsContainer = document.getElementById('trendingDots');
  const prevButton = document.getElementById('trendingPrev');
  const nextButton = document.getElementById('trendingNext');

  if (!slider || !slidesContainer || !dotsContainer) return;
  renderTrendingSkeleton(slidesContainer, dotsContainer, prevButton, nextButton);
  const enableNav = () => {
    if (prevButton) prevButton.removeAttribute('disabled');
    if (nextButton) nextButton.removeAttribute('disabled');
  };

  try {
    const baseParams = `${generateMovieNames()}${getMovieCode()}`;
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://${getMovieVerseData()}/3/trending/movie/week?${baseParams}`),
      fetch(`https://${getMovieVerseData()}/3/trending/tv/week?${baseParams}`),
    ]);

    const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);
    const movieItems = (movieData.results || [])
      .filter(item => item.poster_path && item.backdrop_path)
      .slice(0, 10)
      .map(item => ({ ...item, media_type: 'movie' }));
    const tvItems = (tvData.results || [])
      .filter(item => item.poster_path && item.backdrop_path)
      .slice(0, 10)
      .map(item => ({ ...item, media_type: 'tv' }));

    const mixedItems = [];
    const maxLength = Math.max(movieItems.length, tvItems.length);

    for (let i = 0; i < maxLength; i += 1) {
      if (movieItems[i]) mixedItems.push(movieItems[i]);
      if (tvItems[i]) mixedItems.push(tvItems[i]);
    }

    const spotlightItems = mixedItems.slice(0, 20);

    if (!spotlightItems.length) {
      slidesContainer.innerHTML = `
        <article class="trending-slide is-active">
          <div class="hero-backdrop"></div>
          <div class="hero-glow"></div>
          <div class="hero-content">
            <div class="hero-pills">
              <span class="pill pill-primary">Trending Now</span>
              <span class="pill pill-outline">Loading</span>
              <span class="pill pill-muted">Spotlight</span>
            </div>
            <h2>Spotlight incoming</h2>
            <p>We’re warming up the spotlight. Check back in a moment for the latest trending picks.</p>
          </div>
        </article>
      `;
      dotsContainer.innerHTML = '';
      enableNav();
      return;
    }

    slidesContainer.innerHTML = spotlightItems.map(buildTrendingSlide).join('');
    dotsContainer.innerHTML = spotlightItems
      .map(
        (_, index) =>
          `<button class="trending-dot${index === 0 ? ' is-active' : ''}" data-index="${index}" aria-label="View spotlight ${index + 1}"></button>`
      )
      .join('');

    enableNav();
    const slides = Array.from(slidesContainer.querySelectorAll('.trending-slide'));
    const dots = Array.from(dotsContainer.querySelectorAll('.trending-dot'));
    let currentIndex = 0;
    let timerId;

    const setActiveSlide = nextIndex => {
      slides[currentIndex].classList.remove('is-active');
      dots[currentIndex]?.classList.remove('is-active');
      currentIndex = nextIndex;
      slides[currentIndex].classList.add('is-active');
      dots[currentIndex]?.classList.add('is-active');
    };

    const startRotation = () => {
      if (slides.length < 2) return;
      stopRotation();
      timerId = setInterval(() => {
        const next = (currentIndex + 1) % slides.length;
        setActiveSlide(next);
      }, 3000);
    };

    const stopRotation = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    prevButton?.addEventListener('click', () => {
      stopRotation();
      const next = (currentIndex - 1 + slides.length) % slides.length;
      setActiveSlide(next);
      startRotation();
    });

    nextButton?.addEventListener('click', () => {
      stopRotation();
      const next = (currentIndex + 1) % slides.length;
      setActiveSlide(next);
      startRotation();
    });

    dotsContainer.addEventListener('click', event => {
      const dot = event.target.closest('.trending-dot');
      if (!dot) return;
      const next = Number(dot.dataset.index);
      if (Number.isNaN(next)) return;
      stopRotation();
      setActiveSlide(next);
      startRotation();
    });

    slider.addEventListener('mouseenter', stopRotation);
    slider.addEventListener('mouseleave', startRotation);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopRotation();
      } else {
        startRotation();
      }
    });

    slidesContainer.addEventListener('click', event => {
      const cta = event.target.closest('.trending-cta');
      if (!cta) return;
      const { mediaType, id } = cta.dataset;
      if (!id) return;
      if (mediaType === 'tv') {
        window.location.href = `MovieVerse-Frontend/html/tv-details.html?tvSeriesId=${id}`;
      } else {
        window.location.href = `MovieVerse-Frontend/html/movie-details.html?movieId=${id}`;
      }
    });

    startRotation();
  } catch (error) {
    slidesContainer.innerHTML = `
      <article class="trending-slide is-active">
        <div class="hero-backdrop"></div>
        <div class="hero-glow"></div>
        <div class="hero-content">
          <div class="hero-pills">
            <span class="pill pill-primary">Trending Now</span>
            <span class="pill pill-outline">Loading</span>
            <span class="pill pill-muted">Spotlight</span>
          </div>
          <h2>Spotlight coming soon</h2>
          <p>We couldn’t load the latest spotlight just yet. Refresh in a moment to see what’s trending.</p>
        </div>
      </article>
    `;
    dotsContainer.innerHTML = '';
    enableNav();
    console.log('Trending spotlight error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const trendingSection = document.getElementById('trending-now');
  const trendingMoreBtn = document.getElementById('trendingMoreBtn');

  if (trendingSection) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trendingSection.classList.add('is-visible');
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(trendingSection);
    } else {
      trendingSection.classList.add('is-visible');
    }
  }

  if (trendingMoreBtn) {
    trendingMoreBtn.addEventListener('click', () => {
      const mostPopular = document.getElementById('most-popular-title');
      if (mostPopular) {
        mostPopular.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  initTrendingSpotlight();
});
