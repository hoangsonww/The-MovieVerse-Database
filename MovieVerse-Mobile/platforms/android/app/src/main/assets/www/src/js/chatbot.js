const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");
let initialMainContent;

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
    const chatbotBody = document.getElementById("chatbotBody");
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

    function sendMessage(message) {
        chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: white;"><span style="color: #ff8623">You:</span> ${message}</div>
    `;
        let botReply = movieVerseResponse(message);
        setTimeout(() => {
            chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: #fff;"><span style="color: #ff8623">MovieVerse Assistant:</span> ${botReply}</div>
        `;
            scrollToBottom();
        }, 1000);
        scrollToBottom();
    }
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
                Welcome to MovieVerse Assistant! Here's how you can use me:
            </span>
        </div>
        <ul style="text-align: left; margin-bottom: 10px; color: #fff;">
            <li>To find details about a movie, type "Show me details about [movie name]".</li>
            <li>To watch a movie trailer, type "Show trailer for [movie name]".</li>
            <li>To get information about a director, type "Details about director [director's name]".</li>
            <li>To learn about an actor, type "Details about actor [actor's name]".</li>
            <li>To find information on a production company, type "Details about company [company name]".</li>
            <li>You can also ask about genres, top-rated movies, latest movies, and many more!</li>
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
        console.error('Error fetching movie details:', error);
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
        console.error('Error fetching movie trailer:', error);
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
        console.error('Error fetching trailer:', error);
        return null;
    }
}

function createTrailerButton(trailerUrl, movieTitle) {
    const buttonId = "trailerButton";
    chatbotBody.innerHTML += `
        <button id="trailerButton" style="margin-top: 10px;">Watch Trailer for ${movieTitle}</button>
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
        console.error(`Error fetching ${type} details:`, error);
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
        console.error('Error fetching company details:', error);
        alert('Failed to fetch company details. Please try again later.');
    }
}

function movieVerseResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.startsWith("show me details about ") || lowerMessage.startsWith("i want to know more about ")) {
        const movieName = lowerMessage.replace("show me details about ", "").replace("i want to know more about ", "");
        fetchAndRedirectToMovieDetails(movieName);
        return `Searching for details about "${movieName}". Please wait...`;
    }
    if (lowerMessage.startsWith("show trailer for ")) {
        const movieName = lowerMessage.replace("show trailer for ", "");
        fetchMovieTrailer(movieName);
        return `Searching for the trailer of "${movieName}". Please wait...`;
    }
    if (lowerMessage.startsWith("details about director ")) {
        const directorName = lowerMessage.replace("details about director ", "");
        fetchPersonDetails(directorName, 'director');
        return `Searching for details about director "${directorName}". Please wait...`;
    }
    if (lowerMessage.startsWith("details about actor ")) {
        const actorName = lowerMessage.replace("details about actor ", "");
        fetchPersonDetails(actorName, 'actor');
        return `Searching for details about actor "${actorName}". Please wait...`;
    }
    if (lowerMessage.startsWith("details about company ")) {
        const companyName = lowerMessage.replace("details about company ", "");
        fetchCompanyDetails(companyName);
        return `Searching for details about company "${companyName}". Please wait...`;
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return "Hello! How can I assist you with MovieVerse today?";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
        return "Goodbye! Thank you for using MovieVerse Assistant and have a nice day!";
    } else if (lowerMessage.includes("how are you")) {
        return "I'm your digital MovieVerse assistant, ready to help! How can I assist you with movie info?";
    } else if (lowerMessage.includes("search movie")) {
        return "To find information about a movie, please provide its name or keyword related to it.";
    } else if (lowerMessage.includes("imdb rating")) {
        return "You can search for a movie, and I'll provide its IMDb rating among other details. Please provide the movie name!";
    } else if (lowerMessage.includes("movie description") || lowerMessage.includes("tell me about")) {
        return "Sure, please provide the movie name you want to learn about, and I'll fetch its description for you!";
    } else if (lowerMessage.includes("how many movies")) {
        return "MovieVerse has a vast MovieVerse-Databases of millions of movies. You can search for any movie, and I'll try to fetch details for you!";
    } else if (lowerMessage.includes("latest movies")) {
        return "I can provide information on recent movie releases. However, for the most up-to-date releases, consider checking the 'Latest Movies' section of MovieVerse!";
    } else if (lowerMessage.includes("recommend a movie") || lowerMessage.includes("suggestion")) {
        return "Certainly! How about watching 'Inception'? It's a critically acclaimed movie with a captivating plot!";
    } else if (lowerMessage.includes("how does this work") || lowerMessage.includes("how to use")) {
        return "Simply type in your query related to a movie, and I'll provide details from our MovieVerse MovieVerse-Databases. You can ask about IMDb ratings, descriptions, and more!";
    } else if (lowerMessage.includes("who created this") || lowerMessage.includes("developer")) {
        return "MovieVerse is the result of the hard work of dedicated developers passionate about movies. We hope you find it helpful!";
    } else if (lowerMessage.includes("top rated movies")) {
        return "Our top-rated movies include 'The Shawshank Redemption', 'The Godfather', and 'The Dark Knight'. Would you like a detailed list?";
    } else if (lowerMessage.includes("genre")) {
        return "We have movies spanning various genres: Action, Drama, Comedy, Romance, Thriller, and more! Which genre are you interested in?";
    } else if (lowerMessage.includes("actor") || lowerMessage.includes("actress")) {
        return "Sure, which actor or actress are you interested in? Provide a name, and I'll fetch the movies they've starred in!";
    } else if (lowerMessage.includes("director")) {
        return "Great! Which director's filmography are you interested in?";
    } else if (lowerMessage.includes("animated movies")) {
        return "We have a wide collection of animated movies! Some popular ones include 'Toy Story', 'Frozen', and 'Spirited Away'.";
    } else if (lowerMessage.includes("thank you") || lowerMessage.includes("thanks")) {
        return "You're welcome! If you have any more questions, feel free to ask. Enjoy your movie experience!";
    } else if (lowerMessage.includes("subscription") || lowerMessage.includes("membership")) {
        return "MovieVerse offers different subscription tiers. For detailed information, you might want to check our 'Subscription' section.";
    } else if (lowerMessage.includes("watch movie")) {
        return "While MovieVerse provides detailed information on movies, to watch them, you might need to visit specific streaming platforms or theaters!";
    } else if (lowerMessage.includes("are you a bot")) {
        return "Yes, I'm the MovieVerse digital assistant. How can I help you further?";
    } else if (lowerMessage.includes("documentary")) {
        return "We have an extensive collection of documentaries. From nature to history and science, what topic interests you?";
    } else if (lowerMessage.includes("foreign films")) {
        return "MovieVerse has films from all around the world. Looking for any specific region or language?";
    } else if (lowerMessage.includes("classic movies")) {
        return "Ah, classics! Some all-time favorites include 'Casablanca', 'Gone with the Wind', and 'Citizen Kane'. Would you like more recommendations?";
    } else if (lowerMessage.includes("family movies")) {
        return "We have plenty of family-friendly movies. 'The Lion King', 'Finding Nemo', and 'Toy Story' are a few favorites. Looking for anything specific?";
    } else if (lowerMessage.includes("comedy")) {
        return "In need of a good laugh? We've got comedies like 'Dumb and Dumber', 'Bridesmaids', and 'Anchorman' to name a few!";
    } else if (lowerMessage.includes("action movies")) {
        return "For adrenaline junkies, we've got action-packed movies like 'Die Hard', 'Mad Max: Fury Road', and 'The Dark Knight'. Ready to dive in?";
    } else if (lowerMessage.includes("horror")) {
        return "Looking for a scare? Consider watching 'The Exorcist', 'Psycho', or 'Get Out'. Don't forget to keep the lights on!";
    } else if (lowerMessage.includes("romance")) {
        return "Feeling romantic? Check out 'The Notebook', 'Pride and Prejudice', or 'Before Sunrise'. Love is in the air!";
    } else if (lowerMessage.includes("sci-fi")) {
        return "For sci-fi enthusiasts, we recommend 'Blade Runner', 'Star Wars', or 'Interstellar'. Ready to travel through space and time?";
    } else if (lowerMessage.includes("trailers")) {
        return "Want to see what's coming up? Our 'Trailers' section has the latest teasers and previews of upcoming films!";
    } else if (lowerMessage.includes("membership benefits")) {
        return "Members get exclusive access to early releases, high-definition streaming, and ad-free experience. Interested in upgrading?";
    } else if (lowerMessage.includes("create an account")) {
        return "Creating an account is easy! Just head to the 'Sign Up' section on our website and follow the steps.";
    } else if (lowerMessage.includes("forgot password")) {
        return "No worries! Just click on the 'Forgot Password' link on the login page, and we'll guide you through the reset process.";
    } else if (lowerMessage.includes("movie ratings")) {
        return "Our ratings are sourced from critics and viewers like you. They provide a combined score to help you pick the best movies!";
    } else if (lowerMessage.includes("how do you work")) {
        return "I'm here to answer your questions about MovieVerse and movies in general. Just ask away!";
    } else if (lowerMessage.includes("are you real")) {
        return "I'm a virtual assistant powered by code. While I'm not real, I'm here to help!";
    } else if (lowerMessage.includes("oscar winners")) {
        return "Looking for Oscar winners? We have a dedicated section for 'Academy Award Winners'. Check it out for a list of acclaimed films!";
    } else if (lowerMessage.includes("in theaters now")) {
        return "Our 'Now Showing' section provides a list of movies currently playing in theaters. Planning a movie outing?";
    } else if (lowerMessage.includes("coming soon")) {
        return "Anticipating new releases? Head over to our 'Coming Soon' tab to check out movies hitting the theaters soon!";
    } else if (lowerMessage.includes("movie runtime")) {
        return "Please specify the movie you're inquiring about, and I'll fetch its runtime for you!";
    } else if (lowerMessage.includes("indie films")) {
        return "Indie films offer unique storytelling. Some of our favorites include 'Moonlight', 'Lady Bird', and 'Whiplash'. Would you like to explore more indie titles?";
    } else if (lowerMessage.includes("film festivals")) {
        return "We have a collection of movies that have made waves in film festivals. From Cannes to Sundance, which festival's winners are you interested in?";
    } else if (lowerMessage.includes("animation studios")) {
        return "From Pixar to Studio Ghibli, we have movies from renowned animation studios. Any particular studio you're fond of?";
    } else if (lowerMessage.includes("musicals")) {
        return "Sing your heart out! 'La La Land', 'The Greatest Showman', or classics like 'The Sound of Music' are all available. Ready for a song and dance?";
    } else if (lowerMessage.includes("kid movies")) {
        return "For the little ones, we have 'Despicable Me', 'Frozen', and many more. Anything in particular they enjoy?";
    } else if (lowerMessage.includes("adaptations")) {
        return "Books turned movies? We have 'Harry Potter', 'The Hunger Games', and classics like 'To Kill a Mockingbird'. Interested in a specific adaptation?";
    } else if (lowerMessage.includes("based on true stories")) {
        return "The truth can be stranger than fiction! Check out 'The Imitation Game', 'Schindler's List', or 'Catch Me If You Can'. Any specific era or event you're interested in?";
    } else if (lowerMessage.includes("customer support")) {
        return "Having issues? Our customer support team is here to help. You can reach out via the 'Support' section on our website.";
    } else if (lowerMessage.includes("subscription cancel")) {
        return "We're sad to see you go. To cancel your subscription, please go to the 'Account Settings' section.";
    } else if (lowerMessage.includes("refunds")) {
        return "For refund queries, please get in touch with our customer support. They'll guide you through the process.";
    } else if (lowerMessage.includes("device compatibility")) {
        return "MovieVerse is compatible with a range of devices, from smartphones and tablets to desktops and smart TVs. Any specific device you're asking about?";
    } else if (lowerMessage.includes("movie suggestions based on mood")) {
        return "Of course! Let me know your mood, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie for date night")) {
        return "How about a romantic comedy? 'Pride & Prejudice' or something light-hearted like '500 Days of Summer'?";
    } else if (lowerMessage.includes("is there a series section")) {
        return "Yes, apart from movies, we also have a collection of TV series. From 'Breaking Bad' to 'Stranger Things', binge away!";
    } else if (lowerMessage.includes("award-winning movies")) {
        return "Looking for critically acclaimed cinema? Check our 'Award Winners' section for movies that have received major accolades!";
    } else if (lowerMessage.includes("do you have classics from the 80s")) {
        return "Absolutely! The 80s were iconic. Dive into classics like 'E.T.', 'The Breakfast Club', or 'Back to the Future'. Ready for some nostalgia?";
    } else if (lowerMessage.includes("movie suggestions based on genre")) {
        return "Sure! Let me know your favorite genre, and I'll suggest some movies accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on actor")) {
        return "Of course! Let me know your favorite actor, and I'll suggest some movies accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on director")) {
        return "Of course! Let me know your favorite director, and I'll suggest some movies accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on year")) {
        return "Of course! Let me know your favorite year, and I'll suggest some movies accordingly!";
    } else if (lowerMessage.includes("movie") || lowerMessage.includes("movies")) {
        return "You can search for a movie using the search field above!";
    } else if (lowerMessage.includes("1900s")) {
        return "Movies in the 1900s include: A Trip to the Moon, The Great Train Robbery, etc.";
    } else if (lowerMessage.includes("1910s")) {
        return "Movies in the 1910s include: The Birth of a Nation, Intolerance, etc.";
    } else if (lowerMessage.includes("1920s")) {
        return "Movies in the 1920s include: The Kid, The Gold Rush, etc.";
    } else if (lowerMessage.includes("1930s")) {
        return "Movies in the 1930s include: King Kong, Snow White and the Seven Dwarfs, etc.";
    } else if (lowerMessage.includes("1940s")) {
        return "Movies in the 1940s include: Citizen Kane, Casablanca, etc.";
    } else if (lowerMessage.includes("1950s")) {
        return "Movies in the 1950s include: Sunset Boulevard, Singin' in the Rain, etc.";
    } else if (lowerMessage.includes("1960s")) {
        return "Movies in the 1960s include: Psycho, The Apartment, etc.";
    } else if (lowerMessage.includes("1970s")) {
        return "Movies in the 1970s include: The Godfather, Star Wars, etc.";
    } else if (lowerMessage.includes("1980s")) {
        return "Movies in the 1980s include: Back to the Future, The Shining, etc.";
    } else if (lowerMessage.includes("1990s")) {
        return "Movies in the 1990s include: The Silence of the Lambs, Titanic, etc.";
    } else if (lowerMessage.includes("2000s")) {
        return "Movies in the 2000s include: The Lord of the Rings: The Return of the King, The Dark Knight, etc.";
    } else if (lowerMessage.includes("2010s")) {
        return "Movies in the 2010s include: Inception, The Avengers, etc.";
    } else if (lowerMessage.includes("2020s")) {
        return "Movies in the 2020s include: Tenet, Soul, etc.";
    } else if (lowerMessage.includes("2022")) {
        return "Movies in 2022 include: Thor: Love and Thunder, Doctor Strange in the Multiverse of Madness, etc.";
    } else if (lowerMessage.includes("2023")) {
        return "Movies in 2023 include: The Flash, Black Panther: Wakanda Forever, etc.";
    } else if (lowerMessage.includes("2024")) {
        return "Movies in 2024 include: Indiana Jones 5, The Batman, etc.";
    } else if (lowerMessage.includes("movieverse analytics") || lowerMessage.includes("movieverse stats") || lowerMessage.includes("movieverse insights")) {
        return "MovieVerse Analytics provides insights into user activity, popular movies, and more. You can access it by pressing the About button on the top right, then selecting MovieVerse Analytics at the bottom of the page.";
    } else {
        return "Sorry, I didn't catch that. Can you rephrase or ask another question about movies?";
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
        console.error('Error fetching movie:', error);
        fallbackMovieSelection();
    }
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

function fallbackMovieSelection() {
    const fallbackMovies = [432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340, 424, 98];
    const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
    localStorage.setItem('selectedMovieId', randomFallbackMovie);
    window.location.href = 'movie-details.html';
}