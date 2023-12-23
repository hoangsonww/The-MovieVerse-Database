const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");
let initialMainContent;

document.addEventListener('DOMContentLoaded', function() {
    initialMainContent = document.getElementById('main').innerHTML;
    initializeChatbot();
    document.getElementById('clear-search-btn').style.display = 'none';
});

function sendMessage(message) {
    chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: white;">You: ${message}</div>
    `;
    let botReply = movieVerseResponse(message);  // Renamed function for clarity
    setTimeout(() => {
        chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: #bbb;">MovieVerse Assistant: ${botReply}</div>
        `;
    }, 1000);
}

const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other1");
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById("main");

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
    // Getting elements that may have been reloaded in the DOM
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotBody = document.getElementById("chatbotBody");

    // Reattaching the event listener for Enter key on chatbot input
    chatbotInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage(chatbotInput.value);
            chatbotInput.value = "";
        }
    });

    // Define the sendMessage function inside initializeChatbot to ensure scope
    function sendMessage(message) {
        chatbotBody.innerHTML += `
            <div style="text-align: right; margin-bottom: 10px; color: white;">You: ${message}</div>
        `;
        let botReply = movieVerseResponse(message);
        setTimeout(() => {
            chatbotBody.innerHTML += `
                <div style="text-align: left; margin-bottom: 10px; color: #bbb;">MovieVerse Assistant: ${botReply}</div>
            `;
        }, 1000);
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
    allMovies.sort((a, b) => b.vote_average - a.vote_average);
    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies), mainElement);
        document.getElementById('clear-search-btn').style.display = 'inline-block'; // Show the button
    }
    else {
        mainElement.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none'; // Hide the button if no results
    }
    document.getElementById('alt-title').innerHTML = '';
}

document.getElementById('clear-search-btn').addEventListener('click', function() {
    document.getElementById('main').innerHTML = initialMainContent;
    initializeChatbot(); // Re-initialize chatbot after restoring content
    searchTitle.innerHTML = '';
    this.style.display = 'none';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm, main);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies, too:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
});

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm, main);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        otherTitle.innerHTML = 'Check out other movies:';
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
});

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('main');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
}

function movieVerseResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return "Hello! How can I assist you with MovieVerse today?";
    } else if (lowerMessage.includes("how are you")) {
        return "I'm your digital MovieVerse assistant, ready to help! How can I assist you with movie info?";
    } else if (lowerMessage.includes("search movie")) {
        return "To find information about a movie, please provide its name or keyword related to it.";
    } else if (lowerMessage.includes("imdb rating")) {
        return "You can search for a movie, and I'll provide its IMDb rating among other details. Please provide the movie name!";
    } else if (lowerMessage.includes("movie description") || lowerMessage.includes("tell me about")) {
        return "Sure, please provide the movie name you want to learn about, and I'll fetch its description for you!";
    } else if (lowerMessage.includes("how many movies")) {
        return "MovieVerse has a vast database of millions of movies. You can search for any movie, and I'll try to fetch details for you!";
    } else if (lowerMessage.includes("latest movies")) {
        return "I can provide information on recent movie releases. However, for the most up-to-date releases, consider checking the 'Latest Movies' section of MovieVerse!";
    } else if (lowerMessage.includes("recommend a movie") || lowerMessage.includes("suggestion")) {
        return "Certainly! How about watching 'Inception'? It's a critically acclaimed movie with a captivating plot!";
    } else if (lowerMessage.includes("how does this work") || lowerMessage.includes("how to use")) {
        return "Simply type in your query related to a movie, and I'll provide details from our MovieVerse database. You can ask about IMDb ratings, descriptions, and more!";
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
        return "Sure! Let me know your favorite genre, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on actor")) {
        return "Of course! Let me know your favorite actor, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on director")) {
        return "Of course! Let me know your favorite director, and I'll suggest a movie accordingly!";
    } else if (lowerMessage.includes("movie suggestions based on year")) {
        return "Of course! Let me know your favorite year, and I'll suggest a movie accordingly!";
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
    } else {
        return "Sorry, I didn't catch that. Can you rephrase or ask another question about movies?";
    }
}

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        localStorage.setItem('selectedMovieId', randomMovie.id);
        window.location.href = 'movie-details.html';
    }
    catch (error) {
        console.error('Error fetching movie:', error);
        alert('Failed to fetch the movie of the day. Please try again later.');
    }
}

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes;
    document.getElementById('clock').innerHTML = timeString;
}

setInterval(updateClock, 1000);
window.onload = updateClock;
