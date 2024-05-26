function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
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

const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const form = document.getElementById("form1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
const main = document.getElementById("main");
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const searchTitle = document.getElementById("search-title");

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

function getMovieVerseData(input) {
    return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

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

document.addEventListener('DOMContentLoaded', () => {
    const directorId = localStorage.getItem('selectedDirectorId');
    if (directorId) {
        fetchDirectorDetails(directorId);
    }
    else {
        fetchDirectorDetails(488);
    }
});

async function fetchDirectorDetails(directorId) {
    showSpinner();
    const directorUrl = `https://${getMovieVerseData()}/3/person/${directorId}?${generateMovieNames()}${getMovieCode()}`;
    const creditsUrl = `https://${getMovieVerseData()}/3/person/${directorId}/movie_credits?${generateMovieNames()}${getMovieCode()}`;
    try {
        const [directorResponse, creditsResponse] = await Promise.all([
            fetch(directorUrl),
            fetch(creditsUrl)
        ]);

        const director = await directorResponse.json();
        const credits = await creditsResponse.json();

        if (director.success === false) {
            document.getElementById('director-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Director details not found - try again with a different director.</h2>
            </div>`;
        }
        else {
            updateBrowserURL(director.name);
            populateDirectorDetails(director, credits);
        }
        hideSpinner();
    }
    catch (error) {
        document.getElementById('director-details-container').innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-top: 40px; width: 100vw; height: 800px">
                <h2>Director details not found - try again with a different director.</h2>
            </div>`;
        console.log('Error fetching director details:', error);
        hideSpinner();
    }
}

async function populateDirectorDetails(director, credits) {
    const directorImage = document.getElementById('director-image');
    const directorName = document.getElementById('director-name');
    const directorDescription = document.getElementById('director-description');

    if (director.profile_path) {
        directorImage.src = `https://image.tmdb.org/t/p/w1280${director.profile_path}`;
        directorName.textContent = director.name;
        document.title = `${director.name} - Director's Details`;
    }
    else {
        directorImage.style.display = 'none';
        directorName.textContent = director.name;
        const noImageText = document.createElement('h2');
        noImageText.textContent = 'Image Not Available';
        noImageText.style.textAlign = 'center';
        noImageText.style.height = '800px';
        document.querySelector('.director-left').appendChild(noImageText);
    }

    let ageOrStatus;
    if (director.birthday) {
        if (director.deathday) {
            ageOrStatus = calculateAge(director.birthday, director.deathday) + ' (Deceased)';
        }
        else {
            ageOrStatus = calculateAge(director.birthday) + ' (Alive)';
        }
    }
    else {
        ageOrStatus = 'Unknown';
    }

    directorDescription.innerHTML = `
        <p><strong>Biography:</strong> ${director.biography || 'Information Unavailable'}</p>
        <p><strong>Also Known As:</strong> ${director.also_known_as.join(', ') || 'Information Unavailable'}</p>
        <p><strong>Date of Birth:</strong> ${director.birthday || 'Information Unavailable'}</p>
        <p><strong>Date of Death:</strong> ${director.deathday || 'Information Unavailable'}</p>
        <p><strong>Age:</strong> ${ageOrStatus}</p>
        <p><strong>Place of Birth:</strong> ${director.place_of_birth || 'Information Unavailable'}</p>
        <p><strong>Known For:</strong> Directing</p>
    `;

    const filmographyHeading = document.createElement('p');
    filmographyHeading.innerHTML = '<strong>Filmography:</strong> ';
    directorDescription.appendChild(filmographyHeading);

    const movieList = document.createElement('div');
    movieList.classList.add('movie-list');
    movieList.style.display = 'flex';
    movieList.style.flexWrap = 'wrap';
    movieList.style.justifyContent = 'center';
    movieList.style.gap = '10px';

    const directedMovies = credits.crew.filter(movie => movie.job === "Director");

    directedMovies.forEach((movie, index) => {
        const movieLink = document.createElement('a');
        movieLink.classList.add('movie-link');
        movieLink.href = 'javascript:void(0);';
        movieLink.setAttribute('onclick', `selectMovieId(${movie.id});`);

        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        const movieImage = document.createElement('img');
        movieImage.classList.add('movie-image');

        if (movie.poster_path) {
            movieImage.src = IMGPATH + movie.poster_path;
            movieImage.alt = `${movie.title} Poster`;
        } else {
            movieImage.alt = 'Image Not Available';
            movieImage.src = '../../images/movie-default.jpg';
            movieImage.style.filter = 'grayscale(100%)';
            movieImage.style.objectFit = 'cover';
        }

        movieItem.appendChild(movieImage);

        const movieDetails = document.createElement('div');
        movieDetails.classList.add('movie-details');

        const movieTitle = document.createElement('p');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = movie.title;
        movieDetails.appendChild(movieTitle);

        movieItem.appendChild(movieDetails);
        movieLink.appendChild(movieItem);
        movieList.appendChild(movieLink);

        if (index < directedMovies.length - 1) {
            movieList.appendChild(document.createTextNode(', '));
        }
    });

    filmographyHeading.appendChild(movieList);

    const mediaUrl = `https://${getMovieVerseData()}/3/person/${director.id}/images?${generateMovieNames()}${getMovieCode()}`;
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();
    const images = mediaData.profiles;

    const detailsContainer = document.getElementById('director-description');

    let mediaContainer = document.getElementById('media-container');
    if (!mediaContainer) {
        mediaContainer = document.createElement('div');
        mediaContainer.id = 'media-container';
        mediaContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 450px;
            margin: 20px auto;
            overflow: hidden;
            max-width: 100%;
            box-sizing: border-box;
        `;
        detailsContainer.appendChild(mediaContainer);
    }

    let mediaTitle = document.getElementById('media-title');
    if (!mediaTitle) {
        mediaTitle = document.createElement('p');
        mediaTitle.id = 'media-title';
        mediaTitle.textContent = 'Media:';
        mediaTitle.style = `
            font-weight: bold;
            align-self: center;
            margin-bottom: 5px;
        `;
    }

    detailsContainer.appendChild(mediaTitle);
    detailsContainer.appendChild(mediaContainer);

    let imageElement = document.getElementById('series-media-image');
    if (!imageElement) {
        imageElement = document.createElement('img');
        imageElement.id = 'series-media-image';
        imageElement.style = `
            max-width: 100%;
            max-height: 210px;
            transition: opacity 0.5s ease-in-out;
            opacity: 1;
            border-radius: 16px;
            cursor: pointer;
        `;
        mediaContainer.appendChild(imageElement);
    }

    if (images.length > 0) {
        imageElement.src = `https://image.tmdb.org/t/p/w1280${images[0].file_path}`;
    }

    if (images.length === 0) {
        mediaContainer.innerHTML = '<p>No media available</p>';
    }

    imageElement.addEventListener('click', function() {
        const imageUrl = this.src;
        const modalHtml = `
        <div id="image-modal" style="z-index: 100022222; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center;">
            <img src="${imageUrl}" style="max-width: 80%; max-height: 80%; border-radius: 10px; cursor: default;" onclick="event.stopPropagation();">
            <span style="position: absolute; top: 10px; right: 25px; font-size: 40px; cursor: pointer" id="removeBtn">&times;</span>
        </div>
    `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('image-modal');
        const closeModalBtn = document.getElementById('removeBtn');

        closeModalBtn.onclick = function() {
            modal.remove();
        };

        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.remove();
            }
        });
    });

    let prevButton = document.getElementById('prev-media-button');
    let nextButton = document.getElementById('next-media-button');
    if (!prevButton || !nextButton) {
        prevButton = document.createElement('button');
        nextButton = document.createElement('button');
        prevButton.id = 'prev-media-button';
        nextButton.id = 'next-media-button';
        prevButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        nextButton.innerHTML = '<i class="fas fa-arrow-right"></i>';

        [prevButton, nextButton].forEach(button => {
            button.style = `
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: #7378c5;
                color: white;
                border-radius: 8px;
                height: 30px;
                width: 30px;
                border: none;
                cursor: pointer;
            `;
            button.onmouseover = () => button.style.backgroundColor = '#ff8623';
            button.onmouseout = () => button.style.backgroundColor = '#7378c5';
        });

        prevButton.style.left = '0';
        nextButton.style.right = '0';

        mediaContainer.appendChild(prevButton);
        mediaContainer.appendChild(nextButton);
    }

    let currentIndex = 0;
    prevButton.onclick = () => navigateMedia(images, imageElement, -1);
    nextButton.onclick = () => navigateMedia(images, imageElement, 1);

    function navigateMedia(images, imgElement, direction) {
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        else if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.src = `https://image.tmdb.org/t/p/w1280${images[currentIndex].file_path}`;
            imgElement.style.opacity = '1';
        }, 420);
    }

    if (window.innerWidth <= 767) {
        mediaContainer.style.width = 'calc(100% - 40px)';
    }

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

function selectMovieId(movieId) {
    localStorage.setItem('selectedMovieId', movieId);
    window.location.href = 'movie-details.html';
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
                const favoritedMovies = JSON.parse(localStorage.getItem('moviesFavorited')) || [];
                return favoritedMovies.length;
            }
        },
        {
            label: "Favorite Genre",
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
                }
                catch (e) {
                    console.log('Error parsing genre map:', e);
                    return 'Not Available';
                }

                let genreObject;
                if (Array.isArray(genreMap)) {
                    genreObject = genreMap.reduce((acc, genre) => {
                        acc[genre.id] = genre.name;
                        return acc;
                    }, {});
                }
                else if (typeof genreMap === 'object' && genreMap !== null) {
                    genreObject = genreMap;
                }
                else {
                    console.log('genreMap is neither an array nor a proper object:', genreMap);
                    return 'Not Available';
                }

                return genreObject[mostCommonGenreCode] || 'Not Available';
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
    document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li')
        .forEach(element => {
            element.style.color = color;
        });
}

function updateBrowserURL(name) {
    const nameSlug = createNameSlug(name);
    const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + nameSlug;
    window.history.replaceState({ path: newURL }, '', newURL);
}

function createNameSlug(name) {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
}
