const chatbotBody = document.getElementById('chatbotBody');

let initialMainContent;
let conversationHistory = [];

document.addEventListener('DOMContentLoaded', function () {
  initialMainContent = document.getElementById('main').innerHTML;
  initializeChatbot();
  document.getElementById('clear-search-btn').style.display = 'none';
});

const searchTitle = document.getElementById('search-title');
const SEARCHPATH = `https://api-movieverse.vercel.app/api/3/search/movie&query=`;

// Make sure the genre map is available in localStorage.
async function ensureGenreMapIsAvailable() {
  if (!localStorage.getItem('genreMap')) {
    await fetchGenreMap();
  }
}

async function fetchGenreMap() {
  const token = localStorage.getItem('movieverseToken');
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

function initializeChatbot() {
  const chatbotInput = document.getElementById('chatbotInput');
  sendInitialInstructions();
  chatbotInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      sendMessage(chatbotInput.value);
      chatbotInput.value = '';
    }
  });

  const sendButton = document.getElementById('sendButton');
  sendButton.addEventListener('click', function () {
    sendMessage(chatbotInput.value);
    chatbotInput.value = '';
  });
}

async function sendMessage(message) {
  chatbotBody.innerHTML += `<div style="text-align: right; margin-bottom: 10px; color: white;"><span style="color: #ff8623">You:</span> ${message}</div>`;
  const botReply = await movieVerseResponse(message);
  setTimeout(() => {
    chatbotBody.innerHTML += `<div style="text-align: left; margin-bottom: 10px; color: #fff;"><span style="color: #ff8623">MovieVerse Assistant:</span> ${botReply}</div>`;
    scrollToBottom();
  }, 1000);
  scrollToBottom();
}

function sendInitialInstructions() {
  const initialMessage = `
        <div style="text-align: left">
            <span style="color: #ff8623;">MovieVerse Assistant:</span>
            <span style="display: inline-block; text-align: left; color: #fff;">
                Welcome to MovieVerse Assistant 🍿! Here's how to get started:
            </span>
        </div>
        <ul style="text-align: left; margin-bottom: 10px; color: #fff;">
            <li>To quickly find the trailer of a movie, type "Show trailer for [movie name]".</li>
            <li>You can also ask about genres, top-rated movies, latest movies, get a recommended movie, and any general questions!</li>
            <li>💡<b>Tip:</b> To get the best results, try to avoid phrasing requests like "Show trailer for ...", as they might trigger specific functions instead of a broader search.</li> 
        </ul>
        <div style="text-align: left; color: #fff;">How may I assist you today? 🎬🍿</div>
    `;
  chatbotBody.innerHTML += `<div>${initialMessage}</div>`;
  scrollToBottom();
}

function scrollToBottom() {
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

document.getElementById('clear-search-btn').addEventListener('click', function () {
  document.getElementById('main').innerHTML = initialMainContent;
  initializeChatbot();
  searchTitle.innerHTML = '';
  this.style.display = 'none';
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
});

async function fetchMovieTrailer(movieName) {
  const searchUrl = SEARCHPATH + encodeURIComponent(movieName);
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    const movie = data.results[0];
    if (movie) {
      const trailerUrl = await getTrailerUrl(movie.id);
      if (trailerUrl) {
        createTrailerButton(trailerUrl, movie.title);
      } else {
        chatbotBody.innerHTML += '<div>No trailer available for this movie.</div>';
      }
    } else {
      chatbotBody.innerHTML += '<div>Movie not found. Please try another search.</div>';
    }
  } catch (error) {
    console.log('Error fetching movie trailer:', error);
  }
}

async function getTrailerUrl(movieId) {
  const token = localStorage.getItem('movieverseToken');
  const trailerApiUrl = `https://api-movieverse.vercel.app/api/3/movie/${movieId}/videos`;

  try {
    const response = await fetch(trailerApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.log('Error fetching trailer:', error);
    return null;
  }
}

function createTrailerButton(trailerUrl, movieTitle) {
  const buttonId = 'trailerButton';
  chatbotBody.innerHTML += `
        <button id="trailerButton">Watch Trailer for ${movieTitle}</button>
    `;
  chatbotBody.addEventListener('click', function (event) {
    if (event.target && event.target.id === buttonId) {
      window.open(trailerUrl, '_blank');
    }
  });
}

async function movieVerseResponse(message) {
  const lowerMessage = message.toLowerCase();

  // If the user wants a trailer, call the trailer function.
  if (lowerMessage.startsWith('show trailer for ')) {
    const movieName = lowerMessage.replace('show trailer for ', '');
    fetchMovieTrailer(movieName);
    return `Searching for the trailer of "${movieName}". Please wait...`;
  }

  // Pre-defined greetings and sign-offs.
  if (lowerMessage.startsWith('hello') || lowerMessage.startsWith('hi') || lowerMessage.startsWith('hey')) {
    return 'Hello! How can I assist you with MovieVerse today?';
  } else if (lowerMessage.startsWith('bye') || lowerMessage.startsWith('goodbye')) {
    return 'Goodbye! Thank you for using MovieVerse Assistant and have a nice day!';
  } else {
    // For all other queries, show the spinner and call your AI API.
    showSpinner();
    animateLoadingDots();

    let fullResponse = '';
    try {
      const token = localStorage.getItem('movieverseToken');
      const response = await fetch('https://api-movieverse.vercel.app/api/ai/chat', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      fullResponse = data.response;
    } catch (error) {
      console.error('Error fetching response:', error);
      fullResponse = 'An error occurred while generating the response. Please try again.';
    }

    hideSpinner();
    return removeMarkdown(fullResponse);
  }
}

async function animateLoadingDots() {
  const loadingTextElement = document.querySelector('#myModal p');
  let dots = '';

  while (document.getElementById('myModal').classList.contains('modal-visible')) {
    loadingTextElement.textContent = `Loading response${dots}`;
    dots = dots.length < 3 ? dots + '.' : '.';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

function removeMarkdown(text) {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(text);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

function getAIResponse() {
  const response = 'QUl6YVN' + '5QnRIdGJIVW' + 'N6enExT1p3Z' + 'XB0TXNOd' + 'Fdlal9s' + 'U0lWcWZ3';
  console.log(atob(response));
  return atob(response);
}

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
}

async function showMovieOfTheDay() {
  const token = localStorage.getItem('movieverseToken');
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

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340,
    424, 98,
  ];
  const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];

  localStorage.setItem('selectedMovieId', randomFallbackMovie);
  window.location.href = 'movie-details.html';
}
