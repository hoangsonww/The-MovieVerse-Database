const main = document.getElementById('movie-match-form');
const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const searchTitle = document.getElementById("search-title");
const otherTitle = document.getElementById("other1");

document.getElementById('movie-match-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const mood = document.getElementById('mood').value;
    const genre = document.getElementById('genre').value;
    const period = document.getElementById('period').value;

    findMovieMatch(mood, genre, period);
});

function findMovieMatch(mood, genre, period) {
    const movieDatabase = [
        // Movies starting with the mood "happy"
        { id: "432413", title: "The Avengers", mood: "happy", genre: "action", period: "2010s" },
        { id: "299534", title: "Avengers: Endgame", mood: "happy", genre: "action", period: "2020s" },
        { id: "1726", title: "Iron Man", mood: "happy", genre: "action", period: "2000s" },
        { id: "562", title: "Die Hard", mood: "happy", genre: "action", period: "90s" },
        { id: "89", title: "Indiana Jones and the Last Crusade", mood: "happy", genre: "action", period: "80s" },

        { id: "620", title: "Ghostbusters", mood: "happy", genre: "comedy", period: "80s" },
        { id: "105", title: "Back to the Future", mood: "happy", genre: "comedy", period: "90s" },
        { id: "18785", title: "The Hangover", mood: "happy", genre: "comedy", period: "2000s" },
        { id: "284053", title: "Thor: Ragnarok", mood: "happy", genre: "comedy", period: "2010s" },
        { id: "515001", title: "Jojo Rabbit", mood: "happy", genre: "comedy", period: "2020s" },

        { id: "773", title: "Little Miss Sunshine", mood: "happy", genre: "drama", period: "2000s" },
        { id: "1402", title: "The Pursuit of Happyness", mood: "happy", genre: "drama", period: "2010s" },
        { id: "508442", title: "Soul", mood: "happy", genre: "drama", period: "2020s" },
        { id: "489", title: "Good Will Hunting", mood: "happy", genre: "drama", period: "90s" },
        { id: "207", title: "Dead Poets Society", mood: "happy", genre: "drama", period: "80s" },

        { id: "118340", title: "Guardians of the Galaxy", mood: "happy", genre: "sci-fi", period: "2010s" },
        { id: "607", title: "Men in Black", mood: "happy", genre: "sci-fi", period: "90s" },
        { id: "601", title: "E.T. the Extra-Terrestrial", mood: "happy", genre: "sci-fi", period: "80s" },
        { id: "333339", title: "Ready Player One", mood: "happy", genre: "sci-fi", period: "2000s" },
        { id: "438631", title: "Dune", mood: "happy", genre: "sci-fi", period: "2020s" },

        { id: "50646", title: "Crazy Stupid Love", mood: "happy", genre: "romance", period: "2010s" },
        { id: "1581", title: "The Holiday", mood: "happy", genre: "romance", period: "2000s" },
        { id: "114", title: "Pretty Woman", mood: "happy", genre: "romance", period: "90s" },
        { id: "2028", title: "Say Anything...", mood: "happy", genre: "romance", period: "80s" },
        { id: "614409", title: "To All the Boys: Always and Forever", mood: "happy", genre: "romance", period: "2020s" },

        // Movies starting with the mood "sad"
        { id: "424", title: "Schindler's List", mood: "sad", genre: "drama", period: "90s" },
        { id: "334541", title: "Manchester by the Sea", mood: "sad", genre: "drama", period: "2010s" },
        { id: "4148", title: "Revolutionary Road", mood: "sad", genre: "drama", period: "2000s" },
        { id: "16619", title: "Ordinary People", mood: "sad", genre: "drama", period: "80s" },
        { id: "1135095", title: "Pieces of a Woman", mood: "sad", genre: "drama", period: "2020s" },

        { id: "38", title: "Eternal Sunshine of the Spotless Mind", mood: "sad", genre: "romance", period: "2000s" },
        { id: "46705", title: "Blue Valentine", mood: "sad", genre: "romance", period: "2010s" },
        { id: "222935", title: "The Fault in Our Stars", mood: "sad", genre: "romance", period: "2010s" },
        { id: "142", title: "Brokeback Mountain", mood: "sad", genre: "romance", period: "2000s" },
        { id: "589049", title: "The Photograph", mood: "sad", genre: "romance", period: "2020s" },

        { id: "335984", title: "Blade Runner 2049", mood: "sad", genre: "sci-fi", period: "2010s" },
        { id: "644", title: "A.I. Artificial Intelligence", mood: "sad", genre: "sci-fi", period: "2000s" },
        { id: "152601", title: "Her", mood: "sad", genre: "sci-fi", period: "2010s" },
        { id: "9426", title: "The Fly", mood: "sad", genre: "sci-fi", period: "80s" },
        { id: "419704", title: "Ad Astra", mood: "sad", genre: "sci-fi", period: "2020s" },

        { id: "637", title: "Life Is Beautiful", mood: "sad", genre: "comedy", period: "90s" },
        { id: "9428", title: "The Royal Tenenbaums", mood: "sad", genre: "comedy", period: "2000s" },
        { id: "153", title: "Lost in Translation", mood: "sad", genre: "comedy", period: "2000s" },
        { id: "9675", title: "Sideways", mood: "sad", genre: "comedy", period: "2000s" },
        { id: "7326", title: "Juno", mood: "sad", genre: "comedy", period: "2000s" },

        { id: "263115", title: "Logan", mood: "sad", genre: "action", period: "2010s" },
        { id: "70", title: "Million Dollar Baby", mood: "sad", genre: "action", period: "2000s" },
        { id: "49026", title: "The Dark Knight Rises", mood: "sad", genre: "action", period: "2010s" },
        { id: "475557", title: "Joker", mood: "sad", genre: "action", period: "2010s" },
        { id: "98", title: "Gladiator", mood: "sad", genre: "action", period: "2000s" },

        // Movies starting with the mood "adventurous"
        { id: "85", title: "Indiana Jones and the Raiders of the Lost Ark", mood: "adventurous", genre: "action", period: "80s" },
        { id: "76341", title: "Mad Max: Fury Road", mood: "adventurous", genre: "action", period: "2010s" },
        { id: "98", title: "Gladiator", mood: "adventurous", genre: "action", period: "2000s" },
        { id: "562", title: "Die Hard", mood: "adventurous", genre: "action", period: "90s" },
        { id: "438631", title: "Dune", mood: "adventurous", genre: "action", period: "2020s" },

        { id: "620", title: "Ghostbusters", mood: "adventurous", genre: "comedy", period: "80s" },
        { id: "353486", title: "Jumanji: Welcome to the Jungle", mood: "adventurous", genre: "comedy", period: "2010s" },
        { id: "22", title: "Pirates of the Caribbean", mood: "adventurous", genre: "comedy", period: "2000s" },
        { id: "607", title: "Men in Black", mood: "adventurous", genre: "comedy", period: "90s" },
        { id: "550988", title: "Free Guy", mood: "adventurous", genre: "comedy", period: "2020s" },

        { id: "281957", title: "The Revenant", mood: "adventurous", genre: "drama", period: "2010s" },
        { id: "8358", title: "Cast Away", mood: "adventurous", genre: "drama", period: "2000s" },
        { id: "947", title: "Lawrence of Arabia", mood: "adventurous", genre: "drama", period: "80s" },
        { id: "13", title: "Forrest Gump", mood: "adventurous", genre: "drama", period: "90s" },
        { id: "581734", title: "Nomadland", mood: "adventurous", genre: "drama", period: "2020s" },

        { id: "11", title: "Star Wars", mood: "adventurous", genre: "sci-fi", period: "80s" },
        { id: "19995", title: "Avatar", mood: "adventurous", genre: "sci-fi", period: "2000s" },
        { id: "27205", title: "Inception", mood: "adventurous", genre: "sci-fi", period: "2010s" },
        { id: "335984", title: "Blade Runner", mood: "adventurous", genre: "sci-fi", period: "90s" },
        { id: "438631", title: "Dune", mood: "adventurous", genre: "sci-fi", period: "2020s" },

        { id: "2493", title: "The Princess Bride", mood: "adventurous", genre: "romance", period: "80s" },
        { id: "313369", title: "La La Land", mood: "adventurous", genre: "romance", period: "2010s" },
        { id: "24420", title: "The Time Traveler's Wife", mood: "adventurous", genre: "romance", period: "2000s" },
        { id: "597", title: "Titanic", mood: "adventurous", genre: "romance", period: "90s" },
        { id: "672647", title: "The Map of Tiny Perfect Things", mood: "adventurous", genre: "romance", period: "2020s" },

        // Movies starting with the mood "romantic"
        { id: "11036", title: "The Notebook", mood: "romantic", genre: "drama", period: "2000s" },
        { id: "332562", title: "A Star is Born", mood: "romantic", genre: "drama", period: "2010s" },
        { id: "4348", title: "Pride and Prejudice", mood: "romantic", genre: "drama", period: "2000s" },
        { id: "289", title: "Casablanca", mood: "romantic", genre: "drama", period: "classic" },
        { id: "398818", title: "Call Me by Your Name", mood: "romantic", genre: "drama", period: "2010s" },

        { id: "194", title: "Amélie", mood: "romantic", genre: "romance", period: "2000s" },
        { id: "313369", title: "La La Land", mood: "romantic", genre: "romance", period: "2010s" },
        { id: "76", title: "Before Sunrise", mood: "romantic", genre: "romance", period: "90s" },
        { id: "416477", title: "The Big Sick", mood: "romantic", genre: "romance", period: "2010s" },
        { id: "531428", title: "Portrait of a Lady on Fire", mood: "romantic", genre: "romance", period: "2020s" },

        { id: "152601", title: "Her", mood: "romantic", genre: "sci-fi", period: "2010s" },
        { id: "38050", title: "The Adjustment Bureau", mood: "romantic", genre: "sci-fi", period: "2010s" },
        { id: "38", title: "Eternal Sunshine of the Spotless Mind", mood: "romantic", genre: "sci-fi", period: "2000s" },
        { id: "274870", title: "Passengers", mood: "romantic", genre: "sci-fi", period: "2010s" },
        { id: "122906", title: "About Time", mood: "romantic", genre: "sci-fi", period: "2010s" },

        { id: "639", title: "When Harry Met Sally", mood: "romantic", genre: "comedy", period: "80s" },
        { id: "455207", title: "Crazy Rich Asians", mood: "romantic", genre: "comedy", period: "2010s" },
        { id: "509", title: "Notting Hill", mood: "romantic", genre: "comedy", period: "90s" },
        { id: "4951", title: "10 Things I Hate About You", mood: "romantic", genre: "comedy", period: "90s" },
        { id: "18240", title: "The Proposal", mood: "romantic", genre: "comedy", period: "2000s" },

        { id: "787", title: "Mr. & Mrs. Smith", mood: "romantic", genre: "action", period: "2000s" },
        { id: "36955", title: "True Lies", mood: "romantic", genre: "action", period: "90s" },
        { id: "10529", title: "Outlander", mood: "romantic", genre: "action", period: "2000s" },
        { id: "2493", title: "The Princess Bride", mood: "romantic", genre: "action", period: "80s" },
        { id: "547016", title: "The Old Guard", mood: "romantic", genre: "action", period: "2020s" },

        // Movies starting with the mood "scary"
        { id: "493922", title: "Hereditary", mood: "scary", genre: "drama", period: "2010s" },
        { id: "274", title: "The Silence of the Lambs", mood: "scary", genre: "drama", period: "90s" },
        { id: "539", title: "Psycho", mood: "scary", genre: "drama", period: "classic" },
        { id: "44214", title: "Black Swan", mood: "scary", genre: "drama", period: "2000s" },
        { id: "503919", title: "The Lighthouse", mood: "scary", genre: "drama", period: "2020s" },

        { id: "310131", title: "The Witch", mood: "scary", genre: "horror", period: "2010s" },
        { id: "694", title: "The Shining", mood: "scary", genre: "horror", period: "80s" },
        { id: "377", title: "A Nightmare on Elm Street", mood: "scary", genre: "horror", period: "80s" },
        { id: "419430", title: "Get Out", mood: "scary", genre: "horror", period: "2010s" },
        { id: "565", title: "The Ring", mood: "scary", genre: "horror", period: "2000s" },

        { id: "8413", title: "Event Horizon", mood: "scary", genre: "sci-fi", period: "90s" },
        { id: "348", title: "Alien", mood: "scary", genre: "sci-fi", period: "80s" },
        { id: "300668", title: "Annihilation", mood: "scary", genre: "sci-fi", period: "2010s" },
        { id: "447332", title: "A Quiet Place", mood: "scary", genre: "sci-fi", period: "2010s" },
        { id: "443791", title: "Underwater", mood: "scary", genre: "sci-fi", period: "2020s" },

        { id: "747", title: "Shaun of the Dead", mood: "scary", genre: "comedy", period: "2000s" },
        { id: "19908", title: "Zombieland", mood: "scary", genre: "comedy", period: "2000s" },
        { id: "4011", title: "Beetlejuice", mood: "scary", genre: "comedy", period: "80s" },
        { id: "22970", title: "The Cabin in the Woods", mood: "scary", genre: "comedy", period: "2010s" },
        { id: "425909", title: "Ghostbusters: Afterlife", mood: "scary", genre: "comedy", period: "2020s" },

        { id: "72190", title: "World War Z", mood: "scary", genre: "action", period: "2010s" },
        { id: "6479", title: "I Am Legend", mood: "scary", genre: "action", period: "2000s" },
        { id: "106", title: "Predator", mood: "scary", genre: "action", period: "80s" },
        { id: "396535", title: "Train to Busan", mood: "scary", genre: "action", period: "2010s" },
        { id: "503736", title: "Army of the Dead", mood: "scary", genre: "action", period: "2020s" },

        // Movies starting with the mood "thoughtful"
        { id: "8967", title: "The Tree of Life", mood: "thoughtful", genre: "drama", period: "2010s" },
        { id: "14", title: "American Beauty", mood: "thoughtful", genre: "drama", period: "90s" },
        { id: "453", title: "A Beautiful Mind", mood: "thoughtful", genre: "drama", period: "2000s" },
        { id: "595", title: "To Kill a Mockingbird", mood: "thoughtful", genre: "drama", period: "classic" },
        { id: "581734", title: "Nomadland", mood: "thoughtful", genre: "drama", period: "2020s" },

        { id: "419430", title: "Get Out", mood: "thoughtful", genre: "horror", period: "2010s" },
        { id: "1933", title: "The Others", mood: "thoughtful", genre: "horror", period: "2000s" },
        { id: "745", title: "The Sixth Sense", mood: "thoughtful", genre: "horror", period: "90s" },
        { id: "805", title: "Rosemary's Baby", mood: "thoughtful", genre: "horror", period: "classic" },
        { id: "530385", title: "Midsommar", mood: "thoughtful", genre: "horror", period: "2020s" },

        { id: "335984", title: "Blade Runner 2049", mood: "thoughtful", genre: "sci-fi", period: "2010s" },
        { id: "27205", title: "Inception", mood: "thoughtful", genre: "sci-fi", period: "2010s" },
        { id: "141", title: "Donnie Darko", mood: "thoughtful", genre: "sci-fi", period: "2000s" },
        { id: "62", title: "2001: A Space Odyssey", mood: "thoughtful", genre: "sci-fi", period: "classic" },
        { id: "264660", title: "Ex Machina", mood: "thoughtful", genre: "sci-fi", period: "2020s" },

        { id: "120467", title: "The Grand Budapest Hotel", mood: "thoughtful", genre: "comedy", period: "2010s" },
        { id: "153", title: "Lost in Translation", mood: "thoughtful", genre: "comedy", period: "2000s" },
        { id: "137", title: "Groundhog Day", mood: "thoughtful", genre: "comedy", period: "90s" },
        { id: "935", title: "Dr. Strangelove", mood: "thoughtful", genre: "comedy", period: "classic" },
        { id: "515001", title: "Jojo Rabbit", mood: "thoughtful", genre: "comedy", period: "2020s" },

        { id: "603", title: "The Matrix", mood: "thoughtful", genre: "action", period: "90s" },
        { id: "76341", title: "Mad Max: Fury Road", mood: "thoughtful", genre: "action", period: "2010s" },
        { id: "9693", title: "Children of Men", mood: "thoughtful", genre: "action", period: "2000s" },
        { id: "577922", title: "Tenet", mood: "thoughtful", genre: "action", period: "2020s" },
        { id: "335984", title: "Blade Runner", mood: "thoughtful", genre: "action", period: "80s" },
    ];

    const filteredMovies = movieDatabase.filter(movie =>
        movie.mood === mood && movie.genre === genre && movie.period === period);

    if (filteredMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredMovies.length);
        const matchedMovie = filteredMovies[randomIndex];

        localStorage.setItem('selectedMovieId', matchedMovie.id);
        window.location.href = 'movie-details.html';
    }
    else {
        alert('No match found. Try different criteria.');
    }
}

async function getMovies(url, mainElement) {
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
    }
    else {
        mainElement.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
    }
}

const form = document.getElementById('form1');

const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";

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

let isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;
updateSignInButton();

function handleSignInOut() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');

    if (!isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
        isSignedIn = true;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signIn();
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
        isSignedIn = false;
        localStorage.setItem('isSignedIn', isSignedIn);
        gapi.auth2.getAuthInstance().signOut();
    }
}

function updateSignInButton() {
    const signInOutButton = document.getElementById('googleSignInBtn');
    const signInOutText = signInOutButton.querySelector('span');
    const signInOutIcon = signInOutButton.querySelector('i');
    if (isSignedIn) {
        signInOutText.textContent = 'Sign Out';
        signInOutIcon.className = 'fas fa-sign-out-alt';
    }
    else {
        signInOutText.textContent = 'Sign In';
        signInOutIcon.className = 'fas fa-sign-in-alt';
    }
}

function initClient() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '979580896903-hllisv9ev8pgn302e2959o7mlgkp2k9s.apps.googleusercontent.com' // Replace with your Google Client ID
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    updateSignInButton();
    initClient();
});

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

function showMovies(movies){
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { id, poster_path, title, vote_average, overview } = movie;
        const movieE1 = document.createElement('div');
        const voteAverage = vote_average.toFixed(1);
        movieE1.classList.add('movie');

        const movieImage = poster_path
            ? `<img src="${IMGPATH + poster_path}" alt="${title}" style="cursor: pointer;" />`
            : `<div class="no-image" style="text-align: center; padding: 20px;">Image Not Available</div>`;

        movieE1.innerHTML = `
            ${movieImage} 
            <div class="movie-info" style="cursor: pointer;">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${voteAverage}</span>
            </div>
            <div class="overview" style="cursor: pointer;">
                <h4>Movie Overview: </h4>
                ${overview}
            </div>`;

        movieE1.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', id); // Store the movie ID
            window.location.href = 'movie-details.html';
        });

        main.appendChild(movieE1);
    });
}