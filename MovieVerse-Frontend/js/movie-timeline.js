let alertShown = false;

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

// Era information
const eraInfo = {
  '1920s': {
    title: 'The Silent Era (1920s)',
    description:
      "The dawn of cinema featuring silent films, pioneering directors like Charlie Chaplin and Buster Keaton, and the birth of Hollywood as the world's film capital.",
  },
  '1930s': {
    title: 'The Golden Age (1930s)',
    description:
      'Introduction of sound revolutionized cinema. This era saw the rise of the studio system, glamorous stars, and genres like musicals and gangster films.',
  },
  '1940s': {
    title: 'The War Era (1940s)',
    description:
      'World War II influenced film themes. Film noir emerged, and Hollywood produced propaganda films while maintaining escapist entertainment.',
  },
  '1950s': {
    title: 'The Television Age (1950s)',
    description:
      'Cinema competed with television through widescreen formats, technicolor, and epic productions. The rise of method acting and international cinema.',
  },
  '1960s': {
    title: 'The New Wave (1960s)',
    description:
      'Revolutionary filmmaking from French New Wave influenced global cinema. Counter-culture themes and the breakdown of censorship codes.',
  },
  '1970s': {
    title: 'New Hollywood (1970s)',
    description: 'Young directors brought artistic vision to mainstream cinema. The birth of the blockbuster with Jaws and Star Wars.',
  },
  '1980s': {
    title: 'The Blockbuster Era (1980s)',
    description: 'High-concept films, action heroes, and teen comedies dominated. The rise of home video changed film distribution forever.',
  },
  '1990s': {
    title: 'The Digital Dawn (1990s)',
    description: 'Independent cinema flourished. CGI began transforming visual effects, and the first fully computer-animated features appeared.',
  },
  '2000s': {
    title: 'The CGI Revolution (2000s)',
    description: 'Digital filmmaking became standard. Superhero films began their dominance, and franchises became the focus of major studios.',
  },
  '2010s': {
    title: 'The Superhero Age (2010s)',
    description:
      'Marvel Cinematic Universe redefined franchises. Streaming services began producing original content, changing the industry landscape.',
  },
  '2020s': {
    title: 'The Streaming Era (2020s)',
    description: 'Pandemic accelerated streaming dominance. Theatrical windows shortened, and global content became more accessible than ever.',
  },
};

// Initialize timeline markers
function initializeTimeline() {
  const markersContainer = document.getElementById('timeline-markers');
  const decades = [1920, 1940, 1960, 1980, 2000, 2020];

  markersContainer.innerHTML = '';
  decades.forEach(year => {
    const marker = document.createElement('div');
    marker.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer;';
    marker.innerHTML = `
      <div style="width: 12px; height: 12px; background: white; border-radius: 50%; margin-bottom: 5px;"></div>
      <span style="font-size: 11px; color: #aaa;">${year}s</span>
    `;
    marker.onclick = () => selectEra(year, year + 9);
    markersContainer.appendChild(marker);
  });
}

// Select an era
function selectEra(startYear, endYear) {
  document.getElementById('start-year').value = startYear;
  document.getElementById('end-year').value = endYear;

  // Update visual timeline selection
  updateTimelineSelection();

  // Show era information
  const decade = Math.floor(startYear / 10) * 10 + 's';
  if (eraInfo[decade]) {
    const eraInfoDiv = document.getElementById('era-info');
    document.getElementById('era-title').textContent = eraInfo[decade].title;
    document.getElementById('era-description').textContent = eraInfo[decade].description;
    eraInfoDiv.style.display = 'block';

    // Animate appearance
    eraInfoDiv.style.opacity = '0';
    setTimeout(() => {
      eraInfoDiv.style.transition = 'opacity 0.5s';
      eraInfoDiv.style.opacity = '1';
    }, 100);
  }

  // Highlight selected era button
  document.querySelectorAll('.era-btn').forEach(btn => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = 'none';
  });

  event.target.closest('.era-btn').style.transform = 'scale(1.05)';
  event.target.closest('.era-btn').style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';

  // Automatically load movies
  updateMovies();
}

// Update visual timeline selection
function updateTimelineSelection() {
  const startYear = parseInt(document.getElementById('start-year').value) || 1920;
  const endYear = parseInt(document.getElementById('end-year').value) || new Date().getFullYear();
  const minYear = 1920;
  const maxYear = new Date().getFullYear();
  const range = maxYear - minYear;

  const selectionRange = document.getElementById('selection-range');
  if (startYear && endYear && startYear <= endYear) {
    const startPercent = ((startYear - minYear) / range) * 100;
    const endPercent = ((endYear - minYear) / range) * 100;

    selectionRange.style.left = startPercent + '%';
    selectionRange.style.width = endPercent - startPercent + '%';
    selectionRange.style.display = 'block';
  } else {
    selectionRange.style.display = 'none';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTimeline();

  // Add hover effects to era buttons
  document.querySelectorAll('.era-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      if (!this.style.transform.includes('1.05')) {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
      }
    });
    btn.addEventListener('mouseleave', function () {
      if (!this.style.transform.includes('1.05')) {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      }
    });
  });
});

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

const IMGPATH = 'https://image.tmdb.org/t/p/w500';
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
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
          const posterPath = movieEl.dataset.posterPath;
          const movieImageContainer = movieEl.querySelector('.movie-images');

          if (!posterPath) {
            if (movieImageContainer) {
              movieImageContainer.innerHTML =
                '<div style="color: inherit; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #333;">Image Not Available</div>';
            }
            observer.unobserve(movieEl);
            continue;
          }

          // Fetch and set up additional posters
          const additionalPosters = await getAdditionalPosters(movieId);
          let allPosters = [posterPath, ...additionalPosters];
          allPosters = allPosters.sort(() => 0.5 - Math.random()).slice(0, 10);
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
    movieEl.style.zIndex = '2';
    movieEl.classList.add('movie');
    movieEl.dataset.id = id;
    movieEl.dataset.posterPath = poster_path || '';
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

    const fallbackHTML =
      '<div style="color: inherit; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: #333;">Image Not Available</div>';
    const fallbackOnError =
      "this.onerror=null; var p=this.parentElement; p.innerHTML=''; p.style.display='flex'; p.style.alignItems='center'; p.style.justifyContent='center'; p.style.backgroundColor='#333'; p.style.color='inherit'; p.style.fontWeight='bold'; p.textContent='Image Not Available';";

    // Define HTML structure for the movie card
    movieEl.innerHTML = `
            <div class="movie-image-container">
                <div class="movie-images" style="position: relative; width: 100%; height: 435px; overflow: hidden; background-color: #333;">
                  ${
                    poster_path
                      ? `<img src="${IMGPATH + poster_path}" loading="lazy" alt="${title} poster" width="150" height="225" style="position: absolute; top: 0; left: 0; transition: opacity 1s ease-in-out; opacity: 1;" onerror="${fallbackOnError}">`
                      : fallbackHTML
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
      // Navigate to movie details page with movieId as a query parameter
      window.location.href = `movie-details.html?movieId=${id}`;

      // Update analytics and tracking functions
      updateUniqueMoviesViewed(id);
      updateFavoriteGenre(genre_ids);
      updateMovieVisitCount(id, title);
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

  requestAnimationFrame(() => initSpotlightCarousel(mainElement));

  createLoadMoreButton(startYear, endYear, mainElement);
  if (!append) {
    requestAnimationFrame(() => {
      const resultsSection = document.getElementById('center-container1') || mainElement;
      if (resultsSection && typeof resultsSection.scrollIntoView === 'function') {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
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
  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${currentPage}`;
  const response = await fetch(url);
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
