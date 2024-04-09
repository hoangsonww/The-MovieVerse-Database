document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search');
    const searchButton = document.getElementById('button-search');
    const myHeading = document.getElementById('my-heading');
    const localTime = document.getElementById('local-time');

    function toggleVisibility() {
        const query = searchBar.value.trim();
        if (query) {
            if (window.innerWidth > 800) {
                myHeading.style.position = 'fixed';
                myHeading.style.top = '28px';
                localTime.style.display = 'none';
                myHeading.style.zIndex = '0.05';
                searchBar.style.marginTop = '16px';
                searchButton.style.marginTop = '16px';
            }
        }
        else {
            myHeading.style.position = '';
            myHeading.style.top = '';
            myHeading.style.zIndex = '';
            localTime.style.display = '';
            searchBar.style.marginTop = '';
            searchButton.style.marginTop = '';
        }
    }

    searchBar.addEventListener('input', toggleVisibility);
    toggleVisibility();

    const clearSearchBtn = document.getElementById('clear-search');
    clearSearchBtn.addEventListener('click', function() {
        searchBar.value = '';
        toggleVisibility();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const viewAllResultsBtn = document.getElementById('view-all-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsContainer = document.getElementById('search-results');

    function toggleButtons() {
        const query = searchInput.value.trim();
        viewAllResultsBtn.style.display = query ? 'inline-block' : 'none';
        clearSearchBtn.style.display = query ? 'inline-block' : 'none';
    }

    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchResultsContainer.innerHTML = '';
        document.getElementById('local-time').style.display = '';
        toggleButtons();
        searchInput.focus();
    });

    toggleButtons();
    searchInput.addEventListener('input', toggleButtons);
});

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search').addEventListener('input', function(e) {
        showSpinner();
        const viewAllResultsBtn = document.getElementById('view-all-results');
        const searchInput = document.getElementById('search');
        const query = e.target.value.trim();
        const searchResultsContainer = document.getElementById('search-results');

        viewAllResultsBtn.style.display = query ? 'block' : 'none';

        function toggleButtons() {
            viewAllResultsBtn.style.display = query ? 'inline-block' : 'none';
            const clearSearchBtn = document.getElementById('clear-search');
            clearSearchBtn.style.display = query ? 'inline-block' : 'none';
        }

        if (query) {
            const searchURL = `https://${getMovieVerseData()}/3/search/multi?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(query)}`;
            fetch(searchURL)
                .then(response => response.json())
                .then(data => {
                    const sortedResults = data.results.sort((a, b) => b.popularity - a.popularity);
                    displaySearchResults(sortedResults.slice(0, 5));
                })
                .catch(err => console.log("Fetching error:", err));
        }
        else {
            searchInput.value = '';
            searchResultsContainer.innerHTML = '';
            toggleButtons();
            searchInput.focus();
        }

        searchInput.addEventListener('input', function() {
            if (searchInput.value.trim()) {
                viewAllResultsBtn.style.display = 'block';
            }
            else {
                viewAllResultsBtn.style.display = 'none';
            }
        });

        viewAllResultsBtn.addEventListener('click', function() {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                localStorage.setItem('searchQuery', searchQuery);
                window.location.href = 'search.html';
            }
            else {
                alert('Please enter a search query.');
            }
        });

        hideSpinner();
    });

    function displaySearchResults(results) {
        showSpinner();
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        results.forEach(item => {
            const card = document.createElement('div');
            card.className = 'search-result-card';
            card.style.cursor = 'pointer';

            const imagePath = item.poster_path || item.profile_path ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}` : null;

            if (imagePath) {
                const image = document.createElement('img');
                image.src = imagePath;
                image.className = 'result-image';
                card.appendChild(image);
            }
            else {
                const placeholder = document.createElement('div');
                placeholder.className = 'result-image-placeholder';
                placeholder.textContent = 'Image Not Available';
                placeholder.style.textAlign = 'center';
                placeholder.style.padding = '10px';
                card.appendChild(placeholder);
            }

            const details = document.createElement('div');
            details.className = 'result-details';

            const name = document.createElement('div');
            name.className = 'result-name';
            name.textContent = item.title || item.name;
            details.appendChild(name);

            const type = document.createElement('div');
            type.className = 'result-type';
            type.textContent = item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV Series' : 'Person';
            details.appendChild(type);

            card.appendChild(details);
            resultsContainer.appendChild(card);

            card.addEventListener('click', () => handleResultClick(item));
        });

        hideSpinner();
    }

    async function handleResultClick(item) {
        console.log('Clicked item:', item.media_type, item.id);

        if (!item.media_type) {
            console.log('Media type is undefined');
            return;
        }

        if (item.media_type === 'movie') {
            localStorage.setItem('selectedMovieId', item.id);
            window.location.href = 'movie-details.html';
        }
        else if (item.media_type === 'tv') {
            localStorage.setItem('selectedTvSeriesId', item.id);
            window.location.href = 'tv-details.html';
        }
        else if (item.media_type === 'person') {
            try {
                const personDetailsUrl = `https://${getMovieVerseData()}/3/person/${item.id}?${generateMovieNames()}${getMovieCode()}`;
                const response = await fetch(personDetailsUrl);
                const personDetails = await response.json();

                if (personDetails.known_for_department === 'Directing') {
                    localStorage.setItem('selectedDirectorId', item.id);
                    window.location.href = 'director-details.html?' + item.id;
                }
                else {
                    localStorage.setItem('selectedActorId', item.id);
                    window.location.href = 'actor-details.html?' + item.id;
                }
            }
            catch (error) {
                console.log('Error fetching person details:', error);
            }
        }
        else {
            console.log('Unknown media type:', item.media_type);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const viewAllResultsBtn = document.getElementById('view-all-results');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsContainer = document.getElementById('search-results');
    let selectedIndex = -1;

    function clearSelection() {
        const results = searchResultsContainer.getElementsByClassName('search-result-card');
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            results[selectedIndex].style.backgroundColor = '';
        }
        else if (selectedIndex === results.length) {
            viewAllResultsBtn.style.backgroundColor = '';
        }
        else if (selectedIndex === results.length + 1) {
            clearSearchBtn.style.backgroundColor = '';
        }
    }

    function moveSelection(direction) {
        const results = searchResultsContainer.getElementsByClassName('search-result-card');
        const totalElements = results.length + 2;
        clearSelection();

        if (direction === 'down') {
            selectedIndex = (selectedIndex + 1) % totalElements;
        }
        else if (direction === 'up') {
            selectedIndex = (selectedIndex - 1 + totalElements) % totalElements;
        }

        if (selectedIndex < results.length) {
            results[selectedIndex].style.backgroundColor = '#ff8623';
            results[selectedIndex].scrollIntoView({ block: "nearest" });
        }
        else if (selectedIndex === results.length) {
            viewAllResultsBtn.style.backgroundColor = '#ff8623';
            viewAllResultsBtn.scrollIntoView({ block: "nearest" });
        }
        else if (selectedIndex === results.length + 1) {
            clearSearchBtn.style.backgroundColor = '#ff8623';
            clearSearchBtn.scrollIntoView({ block: "nearest" });
        }
    }

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            moveSelection('down');
        }
        else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            moveSelection('up');
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < searchResultsContainer.getElementsByClassName('search-result-card').length) {
                searchResultsContainer.getElementsByClassName('search-result-card')[selectedIndex].click();
            }
            else if (selectedIndex === searchResultsContainer.getElementsByClassName('search-result-card').length) {
                viewAllResultsBtn.click();
            }
            else if (selectedIndex === searchResultsContainer.getElementsByClassName('search-result-card').length + 1) {
                clearSearchBtn.click();
            }
            else {
                const query = searchInput.value.trim();
                localStorage.setItem('searchQuery', query);
                window.location.href = 'search.html';
            }
        }
    });

    searchInput.addEventListener('blur', clearSelection);
});

const movieCodes = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCodes.part1) + atob(movieCodes.part2) + atob(movieCodes.part3);
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

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
            localStorage.setItem('selectedMovieId', randomMovie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            fallbackMovieSelection();
        }
    }
    catch (error) {
        console.log('Error fetching movie:', error);
        fallbackMovieSelection();
    }
}

document.getElementById('settings-btn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

document.addEventListener('DOMContentLoaded', () => {
    applySettings();

    function applySettings() {
        const defaultBg = '../../images/universe-1.png';
        const savedBg = localStorage.getItem('backgroundImage') || defaultBg;
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');
        document.body.style.backgroundImage = `url('${savedBg}')`;

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
    }
    catch (error) {
        console.log('Error fetching genre map:', error);
    }
}

async function rotateUserStats() {
    await ensureGenreMapIsAvailable();

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
        { label: "Most Visited Director", getValue: getMostVisitedDirector },
        { label: "Most Visited Actor", getValue: getMostVisitedActor },
        {
            label: "Movies Discovered",
            getValue: () => {
                const viewedMovies = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];
                return viewedMovies.length;
            }
        },
        {
            label: "Favorite Movies",
            getValue: () => {
                const favoritedMovies = JSON.parse(localStorage.getItem('favoritesMovies')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
            getValue: () => {
                const mostCommonGenreCode = getMostCommonGenre();
                const genreMap = JSON.parse(localStorage.getItem('genreMap')) || {};
                return genreMap[mostCommonGenreCode] || 'Not Available';
            }
        },
        { label: "Watchlists Created", getValue: () => localStorage.getItem('watchlistsCreated') || 0 },
        { label: "Average Movie Rating", getValue: () => localStorage.getItem('averageMovieRating') || 'Not Rated' },
        {
            label: "Directors Discovered",
            getValue: () => {
                const viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
                return viewedDirectors.length;
            }
        },
        {
            label: "Actors Discovered",
            getValue: () => {
                const viewedActors = JSON.parse(localStorage.getItem('uniqueActorsViewed')) || [];
                return viewedActors.length;
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

const form = document.getElementById('form1');

form.addEventListener('submit', (e) => {
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

function closeModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}