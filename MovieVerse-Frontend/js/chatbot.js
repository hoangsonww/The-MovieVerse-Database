import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");
const movieee = `https://${getMovieVerseData()}/3`;

let initialMainContent;
let conversationHistory = [];

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

document.addEventListener('DOMContentLoaded', function() {
    initialMainContent = document.getElementById('main').innerHTML;
    initializeChatbot();
    document.getElementById('clear-search-btn').style.display = 'none';
});

const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other1");
const SEARCHPATH = `https://${getMovieVerseData()}/3/search/movie?&${generateMovieNames()}${getMovieCode()}&query=`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById("main");

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
    let uniqueMoviesViewed = JSON.parse(localStorage.getItem('uniqueMoviesViewed')) || [];

    if (!movieVisits[movieId]) {
        movieVisits[movieId] = { count: 0, title: movieTitle };
    }

    movieVisits[movieId].count += 1;

    if (!uniqueMoviesViewed.includes(movieId)) {
        uniqueMoviesViewed.push(movieId);
    }

    localStorage.setItem('movieVisits', JSON.stringify(movieVisits));
    localStorage.setItem('uniqueMoviesViewed', JSON.stringify(uniqueMoviesViewed));
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

function updateUniqueDirectorsViewed(directorId) {
    let viewedDirectors = JSON.parse(localStorage.getItem('uniqueDirectorsViewed')) || [];
    if (!viewedDirectors.includes(directorId)) {
        viewedDirectors.push(directorId);
        localStorage.setItem('uniqueDirectorsViewed', JSON.stringify(viewedDirectors));
    }
}

function updateActorVisitCount(actorId, actorName) {
    let actorVisits = JSON.parse(localStorage.getItem('actorVisits')) || {};
    if (!actorVisits[actorId]) {
        actorVisits[actorId] = { count: 0, name: actorName };
    }

    actorVisits[actorId].count += 1;
    localStorage.setItem('actorVisits', JSON.stringify(actorVisits));
}

function updateDirectorVisitCount(directorId, directorName) {
    let directorVisits = JSON.parse(localStorage.getItem('directorVisits')) || {};
    if (!directorVisits[directorId]) {
        directorVisits[directorId] = { count: 0, name: directorName };
    }

    directorVisits[directorId].count += 1;
    localStorage.setItem('directorVisits', JSON.stringify(directorVisits));
}

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

function initializeChatbot() {
    const chatbotInput = document.getElementById("chatbotInput");
    sendInitialInstructions();
    chatbotInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage(chatbotInput.value);
            chatbotInput.value = "";
        }
    });

    const sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", function() {
        sendMessage(chatbotInput.value);
        chatbotInput.value = "";
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

function showMovies(movies, mainElement) {
    mainElement.innerHTML = '';
    movies.forEach(movie => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        const voteAvg = vote_average.toFixed(1);
        movieEl.innerHTML = `
            ${movieImage}
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAvg}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Intro: </h4>
                ${overview}
            </div>`;

        movieEl.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id);
            window.location.href = 'movie-details.html';
            updateMovieVisitCount(id, title);
        });

        mainElement.appendChild(movieEl);
    });
}

function getClassByRate(vote){
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

function sendInitialInstructions() {
    const initialMessage = `
        <div style="text-align: left">
            <span style="color: #ff8623;">MovieVerse Assistant:</span>
            <span style="display: inline-block; text-align: left; color: #fff;">
                Welcome to MovieVerse Assistant! Here's how to get started:
            </span>
        </div>
        <ul style="text-align: left; margin-bottom: 10px; color: #fff;">
            <li>To find details about a movie, type "Show me details about [movie name]".</li>
            <li>To watch a movie trailer, type "Show trailer for [movie name]".</li>
            <li>Or, if you just want quick information about a movie, type "Tell me about [movie name]" or "Do you know about [movie name]".</li>
            <li>You can also ask about genres, top-rated movies, latest movies, get a recommended movie, and any general questions!</li>
            <li>💡<b>Tip:</b> To get the best results, try to avoid phrasing requests like the first three pre-defined functionalities above, as they might trigger those specific functions instead of a broader search.</li> 
        </ul>
        <div style="text-align: left; color: #fff;">How may I assist you today?</div>
    `;
    chatbotBody.innerHTML += `<div>${initialMessage}</div>`;
    scrollToBottom();
}

function scrollToBottom() {
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

async function getMovies(url, mainElement) {
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
        showMovies(allMovies.slice(0, numberOfMovies), mainElement);
        document.getElementById('clear-search-btn').style.display = 'inline-block';
    }
    else {
        mainElement.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none';
    }

    document.getElementById('alt-title').innerHTML = '';
}

document.getElementById('clear-search-btn').addEventListener('click', function() {
    document.getElementById('main').innerHTML = initialMainContent;
    initializeChatbot();
    searchTitle.innerHTML = '';
    this.style.display = 'none';
});

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

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('main');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

async function fetchAndRedirectToMovieDetails(movieName) {
    const searchUrl = SEARCHPATH + encodeURIComponent(movieName);
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const movie = data.results[0];
        if (movie) {
            localStorage.setItem('selectedMovieId', movie.id);
            window.location.href = 'movie-details.html';
        }
        else {
            alert('Movie not found. Please try another search.');
        }
    }
    catch (error) {
        console.log('Error fetching movie details:', error);
        alert('Failed to fetch movie details. Please try again later.');
    }
}

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
            }
            else {
                chatbotBody.innerHTML += '<div>No trailer available for this movie.</div>';
            }
        }
        else {
            chatbotBody.innerHTML += '<div>Movie not found. Please try another search.</div>';
        }
    }
    catch (error) {
        console.log('Error fetching movie trailer:', error);
    }
}

async function getTrailerUrl(movieId) {
    const trailerApiUrl = `https://${getMovieVerseData()}/3/movie/${movieId}/videos?${generateMovieNames()}${getMovieCode()}`;

    try {
        const response = await fetch(trailerApiUrl);
        const data = await response.json();
        const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    }
    catch (error) {
        console.log('Error fetching trailer:', error);
        return null;
    }
}

function createTrailerButton(trailerUrl, movieTitle) {
    const buttonId = "trailerButton";
    chatbotBody.innerHTML += `
        <button id="trailerButton">Watch Trailer for ${movieTitle}</button>
    `;
    chatbotBody.addEventListener('click', function(event) {
        if (event.target && event.target.id === buttonId) {
            window.open(trailerUrl, '_blank');
        }
    });
}

async function fetchPersonDetails(name, type) {
    const searchUrl = `https://${getMovieVerseData()}/3/search/person?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(name)}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const person = data.results[0];

        if (person) {
            localStorage.setItem(type === 'director' ? 'selectedDirectorId' : 'selectedActorId', person.id);
            window.location.href = type === 'director' ? 'director-details.html' : 'actor-details.html';
        }
        else {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} not found. Please try another search.`);
        }
    }
    catch (error) {
        console.log(`Error fetching ${type} details:`, error);
        alert(`Failed to fetch ${type} details. Please try again later.`);
    }
}

async function fetchCompanyDetails(companyName) {
    const searchUrl = `https://${getMovieVerseData()}/3/search/company?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(companyName)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const company = data.results[0];

        if (company) {
            localStorage.setItem('selectedCompanyId', company.id);
            window.location.href = 'company-details.html';
        }
        else {
            alert('Company not found. Please try another search.');
        }
    }
    catch (error) {
        console.log('Error fetching company details:', error);
        alert('Failed to fetch company details. Please try again later.');
    }
}

async function movieVerseResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.startsWith("do you know about ") ||
        lowerMessage.startsWith("tell me about ") ||
        lowerMessage.startsWith("what is ")) {
        const movieName = lowerMessage.replace(/^(do you know about|show me|tell me about|what is) /, '');
        return await fetchMovieDetailsFromTMDB(movieName);
    }
    if (lowerMessage.startsWith("show me details about ") ||
        lowerMessage.startsWith("i want to know more about ") ||
        lowerMessage.startsWith("details about ") ||
        lowerMessage.startsWith("search for ")) {
        const movieName = lowerMessage.replace("show me details about ", "").replace("i want to know more about ", "");
        fetchAndRedirectToMovieDetails(movieName);
        return `Searching for details about "${movieName}". Please wait...`;
    }
    if (lowerMessage.startsWith("show trailer for ")) {
        const movieName = lowerMessage.replace("show trailer for ", "");
        fetchMovieTrailer(movieName);
        return `Searching for the trailer of "${movieName}". Please wait...`;
    }

    if (lowerMessage.startsWith("hello") || lowerMessage.startsWith("hi") || lowerMessage.startsWith("hey")) {
        return "Hello! How can I assist you with MovieVerse today?";
    }
    else if (lowerMessage.startsWith("bye") || lowerMessage.startsWith("goodbye")) {
        return "Goodbye! Thank you for using MovieVerse Assistant and have a nice day!";
    }
    else if (lowerMessage.startsWith("who r u") || lowerMessage.startsWith("who are you") || lowerMessage.startsWith("what is your name") || lowerMessage.startsWith("what's your name") || lowerMessage.startsWith("what are you") || lowerMessage.startsWith("what r u") || lowerMessage.startsWith("what can u do") || lowerMessage.startsWith("what can you do") || lowerMessage.startsWith("introduce yourself")) {
        return "I am MovieVerse Assistant, here to help you with all your movie-related or any other general queries. I am trained and powered by MovieVerse AI and Google to provide you with the best assistance!";
    }
    else {
        showSpinner();
        animateLoadingDots();

        let fullResponse = '';
        try {
            const genAI = new GoogleGenerativeAI(getAIResponse());
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "You are MovieVerse Assistant. You are here to help users with movie-related or any other general queries. You are trained and powered by MovieVerse AI and Google to provide the best assistance. You can also provide information about movies, actors, directors, genres, and companies.",
            });

            conversationHistory.push({ role: "user", parts: [{ text: message }] });

            const chatSession = model.startChat({
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain"
                },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                ],
                history: conversationHistory
            });

            const result = await chatSession.sendMessage(message);
            fullResponse = result.response.text();
            conversationHistory.push({ role: "model", parts: [{ text: fullResponse }] });
        }
        catch (error) {
            console.error('Error fetching response:', error.message);
            fullResponse = "An error occurred while generating the response, possibly due to high traffic or safety concerns. Please understand that I am trained by MovieVerse to provide safe and helpful responses within my limitations. I apologize for any inconvenience caused. Please try again with a different query or contact MovieVerse support for further assistance.";
        }

        hideSpinner();
        return removeMarkdown(fullResponse);
    }
}

async function animateLoadingDots() {
    const loadingTextElement = document.querySelector('#myModal p');
    let dots = "";

    while (document.getElementById('myModal').classList.contains('modal-visible')) {
        loadingTextElement.textContent = `Loading response${dots}`;
        dots = (dots.length < 3) ? dots + "." : ".";
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
    const response = 'QUl6YVN5Q1RoUWVFdmNUb01ka0NqWlM3UTNxNzZBNUNlNjVyMW9r';
    return atob(response);
}

function showSpinner() {
    document.getElementById('myModal').classList.add('modal-visible');
}

function hideSpinner() {
    document.getElementById('myModal').classList.remove('modal-visible');
}

async function fetchMovieDetailsFromTMDB(movieName) {
    const url = `${movieee}/search/movie?${generateMovieNames()}${getMovieCode()}&query=${encodeURIComponent(movieName)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            const movie = data.results[0];
            localStorage.setItem('selectedMovieId', movie.id);

            let movieOverview = movie.overview;
            if (movieOverview.length > 500) {
                movieOverview = movieOverview.substring(0, 500) + '...';
            }
            if (movieOverview === '' || movieOverview === null || !movieOverview) {
                movieOverview = 'N/A';
            }

            let movieReleaseDate = movie.release_date;
            if (movieReleaseDate === '' || movieReleaseDate === null || !movieReleaseDate) {
                movieReleaseDate = 'N/A';
            }

            let movieVoteAverage = movie.vote_average.toFixed(1);
            if (movieVoteAverage === '' || movieVoteAverage === null || !movieVoteAverage) {
                movieVoteAverage = 'N/A';
            }

            return `The title of the movie is ${movie.title}. Its overview is: ${movieOverview}. Its release date is ${movieReleaseDate}, and rating is ${movieVoteAverage}. You can find more info about it if you wish <a href="../html/movie-details.html" class='movie-details-link' style='color: #ff8623; cursor: pointer; text-decoration: underline;' data-movie-id='${movie.id}'>here</a>.`;
        }
        else {
            return "I couldn't find any movie with that name. Please try another movie name.";
        }
    }
    catch (error) {
        console.log('Error fetching movie details:', error);
        return "Sorry, I encountered an error while trying to fetch movie details. Please try again later.";
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

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}
