const form = document.getElementById('form');
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

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

    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleSearch();
    });
});

function rotateUserStats() {
    const stats = [
        {
            label: "Your Current Time",
            getValue: () => {
                const now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                return `${hours}:${minutes}`;
            }
        },
        { label: "Most Visited Movie", getValue: getMostVisitedMovie },
        { label: "Your Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Your Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Your Unique Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Your Favorited Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favorites')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Your Most Common Favorited Genre",
            getValue: getMostCommonGenre
        },
        { label: "Your Created Watchlists", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Your Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Your Unique Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Your Unique Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
            }
        },
        {
            label: "Your Unique Production Companies Discovered",
            getValue: () => {
                const viewedCompanies = JSON.parse(localStorage.getItem('uniqueCompaniesViewed')) || [];
                return viewedCompanies.length;
            }
        },
        { label: "Your Trivia Accuracy", getValue: getTriviaAccuracy },
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
    let triviaStats = JSON.parse(localStorage.getItem('triviaStats')) || { totalCorrect: 0, totalAttempted: 0 };
    if (triviaStats.totalAttempted === 0) {
        return 'No trivia attempted';
    }

    let accuracy = (triviaStats.totalCorrect / triviaStats.totalAttempted) * 100;
    return `${accuracy.toFixed(1)}% accuracy`;
}

function getMostCommonGenre() {
    const favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres')) || {};
    let mostCommonGenre = '';
    let maxCount = 0;

    for (const genre in favoriteGenres) {
        if (favoriteGenres[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = favoriteGenres[genre];
        }
    }

    return mostCommonGenre || 'Not Available';
}

document.addEventListener('DOMContentLoaded', rotateUserStats);

function attachEventListeners() {
    const movieBtn = document.querySelector('[data-category="movie"]');
    const tvBtn = document.querySelector('[data-category="tv"]');
    const peopleBtn = document.querySelector('[data-category="person"]');

    movieBtn.addEventListener('click', function() {
        showResults('movie');
        updateCategoryButtonStyles('movie');
    });

    tvBtn.addEventListener('click', function() {
        showResults('tv');
        updateCategoryButtonStyles('tv');
    });

    peopleBtn.addEventListener('click', function() {
        showResults('person');
        updateCategoryButtonStyles('person');
    });
}

function attachArrowKeyNavigation() {
    const categories = ['movie', 'tv', 'person'];
    let currentIndex = 0;

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                currentIndex = (currentIndex + 1) % categories.length;
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex - 1 + categories.length) % categories.length;
                break;
            case 'ArrowUp':
                currentIndex = (currentIndex + 1) % categories.length;
                break;
            case 'ArrowDown':
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
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
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

async function showResults(category) {
    showSpinner();
    localStorage.setItem('selectedCategory', category);
    const searchQuery = localStorage.getItem('searchQuery');
    const movieName = `${getMovieCode()}`;
    let movieUrl;

    if (category === 'movie') {
        movieUrl = `https://${getMovieVerseData()}/3/search/movie?${generateMovieNames()}${movieName}&query=${encodeURIComponent(searchQuery)}`;
    }
    else if (category === 'tv') {
        movieUrl = `https://${getMovieVerseData()}/3/search/tv?${generateMovieNames()}${movieName}&query=${encodeURIComponent(searchQuery)}`;
    }
    else {
        movieUrl = `https://${getMovieVerseData()}/3/search/person?${generateMovieNames()}${movieName}&query=${encodeURIComponent(searchQuery)}`;
    }

    const searchLabel = document.getElementById('search-results-label');
    searchLabel.textContent = `Search results for "${searchQuery}"`;

    try {
        const response = await fetch(movieUrl);
        const data = await response.json();
        const sortedResults = data.results.sort((a, b) => b.popularity - a.popularity);
        displayResults(sortedResults, category, searchQuery);
        hideSpinner();
    }
    catch (error) {
        console.error('Error fetching search results:', error);
        document.querySelector('.movie-match-container1').innerHTML = '<p>Error fetching results. Please try again later.</p>';
        hideSpinner();
    }

    updateBrowserURL(searchQuery);
    document.title = `Search Results for "${searchQuery}" - The MovieVerse`;
    hideSpinner();
}

document.querySelector('button[onclick="showResults(\'movie\')"]').addEventListener('click', function() {
    showResults('movie');
    localStorage.setItem('selectedCategory', 'movie');
    updateCategoryButtonStyles();
});

document.querySelector('button[onclick="showResults(\'tv\')"]').addEventListener('click', function() {
    showResults('tv');
    localStorage.setItem('selectedCategory', 'tv');
    updateCategoryButtonStyles();
});

document.querySelector('button[onclick="showResults(\'person\')"]').addEventListener('click', function() {
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
    }
    else if (selectedCategory === 'tv') {
        tvBtn.style.backgroundColor = '#ff8623';
    }
    else if (selectedCategory === 'person') {
        peopleBtn.style.backgroundColor = '#ff8623';
    }
}

function displayResults(results, category, searchTerm) {
    const container = document.getElementById('movie-match-container1');
    container.innerHTML = '';

    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    if (results.length === 0) {
        container.innerHTML = `<p>No results found for "${searchTerm}" in the ${capitalizedCategory} category. Please try again with a different query or look for it in another category.</p>`;
        return;
    }

    showMovies(results, container, category);
}

const main = document.getElementById('movie-match-container1');

function showMovies(items, container, category) {
    container.innerHTML = '';

    items.forEach((item) => {
        const isPerson = !item.title && !item.vote_average;
        const title = item.title || item.name || "N/A";

        const overview = item.overview || 'No overview available.';
        let biography = item.biography || 'Click to view the details of this person.';

        const { id, profile_path, poster_path } = item;
        const imagePath = profile_path || poster_path ? IMGPATH + (profile_path || poster_path) : null;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        let movieContentHTML = `<div class="image-container" style="text-align: center;">`;

        if (imagePath) {
            movieContentHTML += `<img src="${imagePath}" alt="${title}" style="cursor: pointer; max-width: 100%; height: auto;" onError="this.parentElement.innerHTML = '<div style=\'text-align: center; padding: 20px;\'>Image Unavailable</div>';">`;
        }
        else {
            movieContentHTML += `<div style="text-align: center; padding: 20px;">Image Unavailable</div>`;
        }

        movieContentHTML += `</div><div class="movie-info" style="cursor: pointer;"><h3>${title}</h3>`;

        if (!isPerson && item.vote_average !== undefined) {
            const voteAverage = item.vote_average.toFixed(1);
            movieContentHTML += `<span class="${getClassByRate(item.vote_average)}">${voteAverage}</span>`;
        }

        movieContentHTML += `</div>`;

        if (isPerson) {
            movieContentHTML += `<div class="overview" style="cursor: pointer;"><h4>Details: </h4>${biography}</div>`;
        }
        else {
            movieContentHTML += `<div class="overview" style="cursor: pointer;"><h4>Overview: </h4>${overview}</div>`;
        }

        movieEl.innerHTML = movieContentHTML;

        movieEl.addEventListener('click', async () => {
            if (isPerson) {
                try {
                    const personDetailsUrl = `https://${getMovieVerseData()}/3/person/${id}?${generateMovieNames()}${getMovieCode()}`;
                    const response = await fetch(personDetailsUrl);
                    const personDetails = await response.json();
                    if (personDetails.known_for_department === 'Directing') {
                        localStorage.setItem('selectedDirectorId', id);
                        window.location.href = 'director-details.html?id=' + id;
                    }
                    else {
                        localStorage.setItem('selectedActorId', id);
                        window.location.href = 'actor-details.html?id=' + id;
                    }
                }
                catch (error) {
                    console.error('Error fetching person details:', error);
                }
            }
            else {
                if (category === 'tv') {
                    localStorage.setItem('selectedTvSeriesId', id);
                    window.location.href = 'tv-details.html';
                }
                else {
                    localStorage.setItem('selectedMovieId', id);
                    window.location.href = 'movie-details.html';
                }
                updateMovieVisitCount(id, title);
            }
        });
        container.appendChild(movieEl);
    });
}

function handleSignInOut() {
    const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

    if (isSignedIn) {
        localStorage.setItem('isSignedIn', JSON.stringify(false));
        alert('You have been signed out.');
    }
    else {
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
    }
    else {
        signInText.textContent = 'Sign In';
        signInIcon.style.display = 'inline-block';
        signOutIcon.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButtonState();
    document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    }
    else if (vote >= 5) {
        return 'orange';
    }
    else {
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
    const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?search_query=' + nameSlug;
    window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(title) {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}
