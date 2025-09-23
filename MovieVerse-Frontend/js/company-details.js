const search = document.getElementById('search');
const searchButton = document.getElementById('button-search');

function showSpinner() {
  document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
  document.getElementById('myModal').classList.remove('modal-visible');
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

const form = document.getElementById('form1');
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
const main = document.getElementById('main');
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const IMGPATH2 = 'https://image.tmdb.org/t/p/w185';
const searchTitle = document.getElementById('search-title');

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

document.addEventListener('DOMContentLoaded', () => {
  const companyId = localStorage.getItem('selectedCompanyId');
  if (companyId) {
    fetchCompanyDetails(companyId);
    fetchCompanyMovies(companyId);
  } else {
    fetchCompanyDetails(521);
    fetchCompanyMovies(521);
  }
});

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

async function fetchCompanyDetails(companyId) {
  showSpinner();
  const url = `https://${getMovieVerseData()}/3/company/${companyId}?${generateMovieNames()}${getMovieCode()}`;
  try {
    const response = await fetch(url);
    const company = await response.json();
    const logoImg = document.getElementById('company-logo');

    if (company.logo_path) {
      logoImg.src = `https://image.tmdb.org/t/p/w500${company.logo_path}`;
    } else {
      logoImg.style.display = 'none';
      const logoFallbackText = document.createElement('p');
      logoFallbackText.textContent = 'Logo Not Available';
      logoImg.parentNode.insertBefore(logoFallbackText, logoImg);
    }

    const fullCountryName = twoLetterCountryCodes.find(country => country.code === company.origin_country)?.name;

    document.getElementById('company-name').textContent = company.name || 'Information Unavailable';
    document.title = `${company.name} - Company Details`;

    // Transform company info into dashboard-style cards
    const companyRight = document.querySelector('.company-right');
    companyRight.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <!-- Company Overview Card -->
        <div style="background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1)); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h3 style="margin-bottom: 15px; font-size: 18px; color: #4ecdc4;">
            <i class="fas fa-building" style="margin-right: 8px;"></i>Company Overview
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p id="company-description" class="company-description" style="font-size: 14px; line-height: 1.6; color: #ccc;">
              ${company.description || 'A leading production company in the entertainment industry.'}
            </p>
          </div>
        </div>

        <!-- Headquarters Card -->
        <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h3 style="margin-bottom: 15px; font-size: 18px; color: #667eea;">
            <i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i>Location Details
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <span style="color: #aaa; font-size: 13px;">Headquarters:</span>
              <p style="margin: 5px 0; font-size: 15px; font-weight: 500;">${company.headquarters || 'Information Unavailable'}</p>
            </div>
            <div>
              <span style="color: #aaa; font-size: 13px;">Country:</span>
              <p style="margin: 5px 0; font-size: 15px; font-weight: 500;">${fullCountryName || 'Information Unavailable'}</p>
            </div>
          </div>
        </div>

        <!-- Contact Info Card -->
        <div style="background: linear-gradient(135deg, rgba(255, 217, 61, 0.1), rgba(252, 74, 74, 0.1)); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h3 style="margin-bottom: 15px; font-size: 18px; color: #ffd93d;">
            <i class="fas fa-globe" style="margin-right: 8px;"></i>Digital Presence
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <span style="color: #aaa; font-size: 13px;">Official Website:</span>
              ${
                company.homepage
                  ? `<p style="margin: 5px 0;"><a href="${company.homepage}" target="_blank" style="color: #4ecdc4; text-decoration: none; font-size: 15px;">${new URL(company.homepage).hostname}</a></p>`
                  : `<p style="margin: 5px 0; font-size: 15px;">Not Available</p>`
              }
            </div>
            <div>
              <span style="color: #aaa; font-size: 13px;">Company ID:</span>
              <p style="margin: 5px 0; font-size: 15px; font-weight: 500;">#${company.id}</p>
            </div>
          </div>
        </div>

        <!-- Parent Company Card (if exists) -->
        ${
          company.parent_company
            ? `
        <div style="background: linear-gradient(135deg, rgba(168, 230, 207, 0.1), rgba(220, 237, 193, 0.1)); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);">
          <h3 style="margin-bottom: 15px; font-size: 18px; color: #a8e6cf;">
            <i class="fas fa-sitemap" style="margin-right: 8px;"></i>Corporate Structure
          </h3>
          <div>
            <span style="color: #aaa; font-size: 13px;">Parent Company:</span>
            <p style="margin: 5px 0; font-size: 15px; font-weight: 500;">${company.parent_company.name}</p>
            ${
              company.parent_company.logo_path
                ? `<img src="https://image.tmdb.org/t/p/w92${company.parent_company.logo_path}" alt="${company.parent_company.name}" style="margin-top: 10px; max-height: 40px;">`
                : ''
            }
          </div>
        </div>
        `
            : ''
        }
      </div>

      <p style="text-align: center; font-size: 20px; margin-top: 30px;"><strong>Produced Movies:</strong></p>
      <div style="text-align: center" id="company-movies-list" class="movies-list"></div>
    `;

    updateBrowserURL(company.name);
    hideSpinner();
  } catch (error) {
    console.log('Error fetching company details:', error);
    const companyDetailsContainer = document.getElementById('company-details-container');
    companyDetailsContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; width: 100vw;">
                <h2>Company details currently unavailable - please try again</h2>
            </div>`;
    hideSpinner();
  }
}

async function fetchCompanyMovies(companyId) {
  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&with_companies=${companyId}&sort_by=release_date.desc`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length === 0) {
      const companyMoviesContainer = document.getElementById('company-movies-container');
      companyMoviesContainer.innerHTML = `<p>No movies found for this company.</p>`;
      return;
    }

    // Fetch additional pages to get more movies for statistics
    const allMovies = [...data.results];
    const totalPages = Math.min(data.total_pages, 5); // Limit to 5 pages for performance

    for (let page = 2; page <= totalPages; page++) {
      const pageUrl = `${url}&page=${page}`;
      const pageResponse = await fetch(pageUrl);
      const pageData = await pageResponse.json();
      allMovies.push(...pageData.results);
    }

    displayCompanyMovies(allMovies.slice(0, 20)); // Display first 20 movies
    displayCompanyStatsDashboard(allMovies, companyId);
    displayProductionTimeline(allMovies);
  } catch (error) {
    console.log('Error fetching movies:', error);
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

const twoLetterCountryCodes = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bonaire', code: 'BQ' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Curacao', code: 'CW' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Ivory Coast', code: 'CI' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'DPR Korea', code: 'KP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'Saint Barthelemy', code: 'BL' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Martin', code: 'MF' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Sint Maarten', code: 'SX' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
  { name: 'Åland Islands', code: 'AX' },
];

function displayCompanyMovies(movies) {
  const moviesList = document.getElementById('company-movies-list');
  moviesList.style.display = 'flex';
  moviesList.style.flexWrap = 'wrap';
  moviesList.style.justifyContent = 'center';
  moviesList.style.gap = '5px';

  let moviesToDisplay = movies.sort((a, b) => b.popularity - a.popularity);

  moviesToDisplay.forEach((movie, index) => {
    const movieLink = document.createElement('a');
    movieLink.classList.add('movie-link');
    movieLink.href = 'javascript:void(0);';
    movieLink.style.marginRight = '0';
    movieLink.style.marginTop = '10px';
    movieLink.style.color = 'inherit'; // Inherit text color
    movieLink.setAttribute('onclick', `selectMovieId(${movie.id});`);

    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.style.height = 'auto';

    const movieImage = document.createElement('img');
    movieImage.classList.add('movie-image');
    movieImage.style.maxHeight = '155px';
    movieImage.style.maxWidth = '115px';

    if (movie.poster_path) {
      movieImage.src = IMGPATH2 + movie.poster_path;
      movieImage.alt = `${movie.title} Poster`;
    } else {
      movieImage.alt = 'Image Not Available';
      movieImage.src = 'https://movie-verse.com/images/movie-default.jpg';
      movieImage.style.filter = 'grayscale(100%)';
      movieImage.style.objectFit = 'cover';
    }

    movieItem.appendChild(movieImage);

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    const movieTitle = document.createElement('p');
    movieTitle.classList.add('movie-title');
    movieTitle.style.color = 'inherit'; // Inherit text color
    const movieTitleWords = movie.title.split(' ');
    const truncatedMovieTitle = movieTitleWords.length > 5 ? movieTitleWords.slice(0, 5).join(' ') + ' ...' : movie.title;

    movieTitle.textContent = truncatedMovieTitle;

    movieDetails.appendChild(movieTitle);

    movieItem.appendChild(movieDetails);
    movieLink.appendChild(movieItem);
    moviesList.appendChild(movieLink);

    if (index < movies.length - 1) {
      const separator = document.createTextNode(' ');
      moviesList.appendChild(separator);
    }
  });
}

function selectMovieId(movieId) {
  // Navigate to movie details page with movieId as a query parameter
  window.location.href = `movie-details.html?movieId=${movieId}`;
}

function updateBrowserURL(title) {
  const nameSlug = createNameSlug(title);
  const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + nameSlug;
  window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '');
}

async function displayCompanyStatsDashboard(movies, companyId) {
  const dashboard = document.getElementById('company-stats-dashboard');
  if (!dashboard) return;

  // Show the dashboard
  dashboard.style.display = 'block';
  dashboard.style.opacity = '0';

  // Ensure genre map is available and normalized
  await ensureGenreMapIsAvailable();
  let storedGenreMap = {};
  try {
    const raw = localStorage.getItem('genreMap');
    storedGenreMap = raw ? JSON.parse(raw) : {};
  } catch (e) {
    storedGenreMap = {};
  }
  // Normalize to id -> name mapping (handles array or object forms)
  const idToGenreName = Array.isArray(storedGenreMap)
    ? storedGenreMap.reduce((acc, g) => {
        if (g && (g.id !== undefined) && g.name) acc[String(g.id)] = g.name;
        return acc;
      }, {})
    : Object.keys(storedGenreMap || {}).reduce((acc, k) => {
        const v = storedGenreMap[k];
        acc[String(k)] = typeof v === 'string' ? v : (v && v.name) || '';
        return acc;
      }, {});

  // Calculate statistics
  const totalFilms = movies.length;
  const avgRating = movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / totalFilms;

  // Calculate total revenue (fetch detailed info for top movies)
  let totalRevenue = 0;
  const topMovies = movies.slice(0, 10); // Get top 10 movies for revenue calculation

  for (const movie of topMovies) {
    try {
      const detailUrl = `https://${getMovieVerseData()}/3/movie/${movie.id}?${generateMovieNames()}${getMovieCode()}`;
      const response = await fetch(detailUrl);
      const details = await response.json();
      totalRevenue += details.revenue || 0;
    } catch (error) {
      console.log('Error fetching movie details:', error);
    }
  }

  // Calculate genre distribution
  // Support both `genre_ids: number[]` and `genres: {id,name}[]` shapes
  const genreNameCounts = {};
  movies.forEach(movie => {
    const ids = Array.isArray(movie.genre_ids)
      ? movie.genre_ids
      : Array.isArray(movie.genres)
        ? movie.genres.map(g => g && g.id).filter(id => id !== undefined && id !== null)
        : [];
    ids.forEach(genreId => {
      const name = idToGenreName[String(genreId)] || 'Unknown';
      genreNameCounts[name] = (genreNameCounts[name] || 0) + 1;
    });
  });

  // Prepare top genres by name (merging duplicate Unknown into one)
  const topGenres = Object.entries(genreNameCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / totalFilms) * 100).toFixed(1),
    }));

  // Get years active
  const years = movies
    .map(m => (m.release_date ? new Date(m.release_date).getFullYear() : null))
    .filter(y => y)
    .sort();
  const yearsActive = years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : 'N/A';

  // Update dashboard elements
  document.getElementById('totalFilms').textContent = totalFilms;
  document.getElementById('avgRating').textContent = avgRating.toFixed(1) + ' ⭐';
  document.getElementById('topGenre').textContent = topGenres[0]?.name || 'N/A';
  document.getElementById('yearsActive').textContent = yearsActive;

  // Animate revenue meter
  const revenuePercentage = Math.min((totalRevenue / 10000000000) * 100, 100); // Scale to $10B max
  setTimeout(() => {
    const revenueFill = document.getElementById('revenueFill');
    revenueFill.style.transition = 'width 2s ease-out';
    revenueFill.style.width = revenuePercentage * 1.8 + 'px';

    const revenueText = document.getElementById('revenueText');
    let currentRevenue = 0;
    const increment = revenuePercentage / 50;
    const interval = setInterval(() => {
      currentRevenue += increment;
      if (currentRevenue >= revenuePercentage) {
        currentRevenue = revenuePercentage;
        clearInterval(interval);
      }
      revenueText.textContent = currentRevenue.toFixed(0) + '%';
    }, 40);
  }, 500);

  // Create genre distribution chart
  const genreChart = document.getElementById('genreChart');
  genreChart.innerHTML = '';

  topGenres.forEach((genre, index) => {
    const genreBar = document.createElement('div');
    genreBar.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    const label = document.createElement('span');
    label.style.cssText = 'font-size: 12px; color: #aaa; min-width: 80px;';
    label.textContent = genre.name;

    const barContainer = document.createElement('div');
    barContainer.style.cssText = 'flex: 1; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;';

    const bar = document.createElement('div');
    bar.style.cssText = `height: 100%; width: 0%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 10px; transition: width 1.5s ease-out;`;

    const percentage = document.createElement('span');
    percentage.style.cssText = 'font-size: 12px; color: white; min-width: 40px; text-align: right;';
    percentage.textContent = genre.percentage + '%';

    barContainer.appendChild(bar);
    genreBar.appendChild(label);
    genreBar.appendChild(barContainer);
    genreBar.appendChild(percentage);
    genreChart.appendChild(genreBar);

    // Animate bar
    setTimeout(
      () => {
        bar.style.width = genre.percentage + '%';
      },
      500 + index * 100
    );
  });

  // Fade in dashboard
  requestAnimationFrame(() => {
    dashboard.style.transition = 'opacity 1s ease-in';
    dashboard.style.opacity = '1';
  });
}

function displayProductionTimeline(movies) {
  const timelineContainer = document.getElementById('production-timeline-container');
  if (!timelineContainer || movies.length === 0) return;

  // Show the timeline
  timelineContainer.style.display = 'block';
  timelineContainer.style.opacity = '0';

  // Sort movies by release date
  const sortedMovies = movies
    .filter(m => m.release_date)
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    .slice(0, 15); // Show top 15 recent movies

  const timelineScroll = document.getElementById('timeline-scroll');
  timelineScroll.innerHTML = '';

  sortedMovies.forEach((movie, index) => {
    const releaseDate = new Date(movie.release_date);
    const year = releaseDate.getFullYear();
    const month = releaseDate.toLocaleString('default', { month: 'short' });

    const timelineItem = document.createElement('div');
    timelineItem.style.cssText = `
      min-width: 200px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      opacity: 0;
      transform: translateY(20px);
    `;

    timelineItem.innerHTML = `
      <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 2px 10px; border-radius: 10px; font-size: 11px;">
        ${month} ${year}
      </div>
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" alt="${movie.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">`
          : `<div style="width: 100%; height: 120px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>`
      }
      <h4 style="font-size: 13px; margin: 5px 0; line-height: 1.3;">${movie.title}</h4>
      <div style="display: flex; justify-content: space-between; margin-top: 8px;">
        <span style="font-size: 11px; color: #4ecdc4;">⭐ ${movie.vote_average.toFixed(1)}</span>
        <span style="font-size: 11px; color: #ffd93d;">👁 ${movie.popularity.toFixed(0)}</span>
      </div>
    `;

    timelineItem.addEventListener('click', () => {
      selectMovieId(movie.id);
    });

    timelineItem.addEventListener('mouseenter', () => {
      timelineItem.style.transform = 'translateY(-5px) scale(1.02)';
      timelineItem.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
    });

    timelineItem.addEventListener('mouseleave', () => {
      timelineItem.style.transform = 'translateY(0) scale(1)';
      timelineItem.style.boxShadow = 'none';
    });

    timelineScroll.appendChild(timelineItem);

    // Animate item appearance
    setTimeout(() => {
      timelineItem.style.transition = 'all 0.6s ease';
      timelineItem.style.opacity = '1';
      timelineItem.style.transform = 'translateY(0)';
    }, 100 * index);
  });

  // Setup navigation arrows
  const prevBtn = document.getElementById('timeline-prev');
  const nextBtn = document.getElementById('timeline-next');

  prevBtn.addEventListener('click', () => {
    timelineScroll.scrollBy({ left: -220, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    timelineScroll.scrollBy({ left: 220, behavior: 'smooth' });
  });

  // Fade in timeline
  setTimeout(() => {
    timelineContainer.style.transition = 'opacity 1s ease-in';
    timelineContainer.style.opacity = '1';
  }, 300);
}
