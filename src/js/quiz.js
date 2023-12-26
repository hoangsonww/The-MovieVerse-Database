const questionBank = [
    { question: "What movie won the Academy Award for Best Picture in 2020?", options: ["Joker", "1917", "Parasite"], answer: "Parasite" },
    { question: "Who directed the movie 'The Godfather'?", options: ["Steven Spielberg", "Francis Ford Coppola", "Martin Scorsese"], answer: "Francis Ford Coppola" },
    { question: "What was the first feature-length animated movie ever released?", options: ["Snow White and the Seven Dwarfs", "Bambi", "Pinocchio"], answer: "Snow White and the Seven Dwarfs" },
    { question: "What was the highest-grossing movie of all time before the release of 'Avatar'?", options: ["Titanic", "Star Wars: The Force Awakens", "Avengers: Endgame"], answer: "Titanic" },
    { question: "Who played the lead role in the movie 'Forrest Gump'?", options: ["Tom Hanks", "Brad Pitt", "Leonardo DiCaprio"], answer: "Tom Hanks" },
    { question: "What movie won the Academy Award for Best Picture in 2019?", options: ["Bohemian Rhapsody", "Green Book", "Roma"], answer: "Green Book" },
    { question: "Who played the character of John McClane in the Die Hard movie series?", options: ["Arnold Schwarzenegger", "Sylvester Stallone", "Bruce Willis"], answer: "Bruce Willis" },
    { question: "What movie is based on a novel by Stephen King and features a character named Jack Torrance?", options: ["Carrie", "The Shining", "Misery"], answer: "The Shining" },
    { question: "Who directed the movie 'Forrest Gump'?", options: ["Steven Spielberg", "Robert Zemeckis", "Martin Scorsese"], answer: "Robert Zemeckis" },
    { question: "What is the highest-grossing movie of all time (as of 2021)?", options: ["Avatar", "Avengers: Endgame", "Titanic"], answer: "Avatar" },
    { question: "What movie features the line 'You can't handle the truth!'?", options: ["The Shawshank Redemption", "A Few Good Men", "Goodfellas"], answer: "A Few Good Men" },
    { question: "Who played the character of Tony Stark/Iron Man in the Marvel Cinematic Universe?", options: ["Chris Hemsworth", "Mark Ruffalo", "Robert Downey Jr."], answer: "Robert Downey Jr." },
    { question: "In which movie did Tom Hanks say, 'Houston, we have a problem'?", options: ["Apollo 13", "Cast Away", "The Terminal"], answer: "Apollo 13" },
    { question: "What is the name of the hobbit played by Elijah Wood in the Lord of the Rings movies?", options: ["Frodo", "Sam", "Merry"], answer: "Frodo" },
    { question: "What is the name of the kingdom where the 2013 animated movie 'Frozen' is set?", options: ["Arendelle", "Genovia", "DunBroch"], answer: "Arendelle" },
    { question: "Which 1997 science fiction movie stars Will Smith and Tommy Lee Jones?", options: ["Independence Day", "Men in Black", "Wild Wild West"], answer: "Men in Black" },
    { question: "Which movie features Bruce Willis as a child psychologist?", options: ["Die Hard", "The Sixth Sense", "Unbreakable"], answer: "The Sixth Sense" },
    { question: "In 'The Matrix', does Neo take the blue pill or the red pill?", options: ["Blue", "Red", "Green"], answer: "Red" },
    { question: "Which actress played Katniss Everdeen in 'The Hunger Games' movies?", options: ["Jennifer Lawrence", "Emma Watson", "Shailene Woodley"], answer: "Jennifer Lawrence" },
    { question: "Who directed 'Jurassic Park'?", options: ["James Cameron", "Steven Spielberg", "George Lucas"], answer: "Steven Spielberg" },
    { question: "What 1980s movie was the highest grossing film of the decade?", options: ["E.T. the Extra-Terrestrial", "Star Wars: Episode V", "Back to the Future"], answer: "E.T. the Extra-Terrestrial" },
    { question: "Which movie features the song 'My Heart Will Go On'?", options: ["The Bodyguard", "Titanic", "Romeo + Juliet"], answer: "Titanic" },
    { question: "What was the first Pixar movie?", options: ["Toy Story", "A Bug's Life", "Monsters, Inc."], answer: "Toy Story" },
    { question: "Who played Wolverine in the X-Men movies?", options: ["Hugh Jackman", "Liam Hemsworth", "Chris Evans"], answer: "Hugh Jackman" },
    { question: "Which film did NOT win the Academy Award for Best Picture?", options: ["The Shawshank Redemption", "The Godfather", "Forrest Gump"], answer: "The Shawshank Redemption" },
    { question: "What is Indiana Jones' real first name?", options: ["Henry", "John", "Walter"], answer: "Henry" },
    { question: "In 'The Wizard of Oz', what did the Scarecrow want from the wizard?", options: ["Heart", "Brain", "Courage"], answer: "Brain" },
    { question: "Who is the only actor to receive an Oscar nomination for acting in a Lord of the Rings movie?", options: ["Viggo Mortensen", "Ian McKellen", "Elijah Wood"], answer: "Ian McKellen" },
    { question: "Which movie features an iconic dance scene between Uma Thurman and John Travolta?", options: ["Pulp Fiction", "Kill Bill", "Saturday Night Fever"], answer: "Pulp Fiction" },
    { question: "What is the highest-grossing R-rated movie of all time?", options: ["Deadpool", "Joker", "The Matrix"], answer: "Joker" },
    { question: "Which Alfred Hitchcock movie is notorious for its shower scene?", options: ["Vertigo", "Psycho", "Rear Window"], answer: "Psycho" },
    { question: "What is Darth Vader's real name?", options: ["Anakin Skywalker", "Luke Skywalker", "Obi-Wan Kenobi"], answer: "Anakin Skywalker" },
    { question: "Who directed 'Schindler's List'?", options: ["Martin Scorsese", "Steven Spielberg", "Ridley Scott"], answer: "Steven Spielberg" },
    { question: "In which movie does Tom Cruise perform his own stunts climbing the Burj Khalifa?", options: ["Mission: Impossible - Rogue Nation", "Mission: Impossible - Ghost Protocol", "Edge of Tomorrow"], answer: "Mission: Impossible - Ghost Protocol" },
    { question: "What is the name of the fictional African country where 'Black Panther' is set?", options: ["Wakanda", "Genovia", "Zamunda"], answer: "Wakanda" },
    { question: "Who directed 'Inception' and 'Interstellar'?", options: ["Christopher Nolan", "James Cameron", "Steven Spielberg"], answer: "Christopher Nolan" },
    { question: "In 'The Hunger Games', what district do Katniss and Peeta represent?", options: ["District 12", "District 9", "District 7"], answer: "District 12" },
    { question: "Which movie features a character named Tyler Durden?", options: ["Fight Club", "Gone Girl", "Seven"], answer: "Fight Club" },
    { question: "What is the name of the island in 'Jurassic Park'?", options: ["Isla Nublar", "Isla Sorna", "Skull Island"], answer: "Isla Nublar" },
    { question: "Who played the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Joaquin Phoenix", "Jared Leto"], answer: "Heath Ledger" },
    { question: "In which movie is the fictional company Initech featured?", options: ["Office Space", "The Social Network", "Wall Street"], answer: "Office Space" },
    { question: "What year was the first 'Harry Potter' movie released?", options: ["2001", "2003", "1999"], answer: "2001" },
    { question: "What fictional country is 'Wonder Woman' from?", options: ["Themyscira", "Asgard", "Genovia"], answer: "Themyscira" },
    { question: "Which movie is known for the quote 'Here's looking at you, kid'?", options: ["Casablanca", "Gone with the Wind", "The Maltese Falcon"], answer: "Casablanca" },
    { question: "In 'The Lion King', what is Simba's mother's name?", options: ["Nala", "Sarabi", "Shenzi"], answer: "Sarabi" },
    { question: "Who directed 'Avengers: Endgame'?", options: ["The Russo Brothers", "Joss Whedon", "Jon Favreau"], answer: "The Russo Brothers" },
    { question: "What is the name of the kingdom in 'Tangled'?", options: ["Corona", "Far Far Away", "Arendelle"], answer: "Corona" },
    { question: "Which film features a famous dance scene with Uma Thurman and John Travolta?", options: ["Pulp Fiction", "Saturday Night Fever", "Kill Bill"], answer: "Pulp Fiction" },
    { question: "Who played Jack Dawson in 'Titanic'?", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp"], answer: "Leonardo DiCaprio" },
    { question: "What is the highest-grossing film of all time?", options: ["Avengers: Endgame", "Avatar", "Titanic"], answer: "Avatar" },
    { question: "In which movie does the character Neo appear?", options: ["The Matrix", "John Wick", "Speed"], answer: "The Matrix" },
    { question: "What is the real name of the Black Panther in the Marvel Cinematic Universe?", options: ["T'Challa", "M'Baku", "N'Jadaka"], answer: "T'Challa" },
    { question: "Who directed 'Mad Max: Fury Road'?", options: ["George Miller", "Ridley Scott", "Peter Jackson"], answer: "George Miller" },
    { question: "What animated film features a character named 'Hiccup'?", options: ["Brave", "How to Train Your Dragon", "Shrek"], answer: "How to Train Your Dragon" },
    { question: "In which film is the fictional mineral 'Unobtainium' sought after?", options: ["Avatar", "The Core", "Transformers"], answer: "Avatar" },
    { question: "What is the name of the fictional city where the Batman movies take place?", options: ["Gotham City", "Metropolis", "Star City"], answer: "Gotham City" },
    { question: "Who directed 'The Dark Knight'?", options: ["Christopher Nolan", "Martin Scorsese", "Steven Spielberg"], answer: "Christopher Nolan" },
];

const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById("main");
const search = document.getElementById("search");
const searchButton = document.getElementById("button-search");
const SEARCHPATH = "https://api.themoviedb.org/3/search/movie?&api_key=c5a20c861acf7bb8d9e987dcc7f1b558&query=";
const searchTitle = document.getElementById("trivia-label");

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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block'; // Show the button
});

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHPATH + searchTerm);
        searchTitle.innerHTML = 'Search Results for: ' + searchTerm;
        search.value = '';
    }
    else {
        searchTitle.innerHTML = 'Please enter a search term.';
    }
    document.getElementById('clear-search-btn').style.display = 'block'; // Show the button
});

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

    // Sort movies by vote_average in descending order
    allMovies.sort((a, b) => b.vote_average - a.vote_average);
    document.getElementById('clear-search-btn').style.display = 'block';

    // Display the sorted movies
    if (allMovies.length > 0) {
        showMovies(allMovies.slice(0, numberOfMovies));
        document.getElementById('clear-search-btn').style.display = 'none'; // Hide the button if no results
    }
    else {
        main.innerHTML = `<p>No movie with the specified search term found. Please try again.</p>`;
        document.getElementById('clear-search-btn').style.display = 'none'; // Hide the button if no results
    }
}

document.getElementById('clear-search-btn').addEventListener('click', () => {
    location.reload();
});

function clearMovieDetails() {
    const movieDetailsContainer = document.getElementById('quiz-container');
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = '';
    }
    document.getElementById('regenerate-questions').style.display = 'none';
    document.getElementById('submit').style.display = 'none';
}

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

function calculateMoviesToDisplay() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 689.9) return 10;
    if (screenWidth <= 1021.24) return 20;
    if (screenWidth <= 1353.74) return 21;
    if (screenWidth <= 1684.9) return 20;
    if (screenWidth <= 2017.49) return 20;
    if (screenWidth <= 2349.99) return 18;
    if (screenWidth <= 2681.99) return 21;
    if (screenWidth <= 3014.49) return 24;
    if (screenWidth <= 3345.99) return 27;
    if (screenWidth <= 3677.99) return 20;
    if (screenWidth <= 4009.99) return 22;
    if (screenWidth <= 4340.99) return 24;
    if (screenWidth <= 4673.49) return 26;
    if (screenWidth <= 5005.99) return 28;
    if (screenWidth <= 5337.99) return 30;
    if (screenWidth <= 5669.99) return 32;
    if (screenWidth <= 6001.99) return 34;
    if (screenWidth <= 6333.99) return 36;
    if (screenWidth <= 6665.99) return 38;
    if (screenWidth <= 6997.99) return 40;
    if (screenWidth <= 7329.99) return 42;
    if (screenWidth <= 7661.99) return 44;
    if (screenWidth <= 7993.99) return 46;
    if (screenWidth <= 8325.99) return 48;
    return 20;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clear-search-btn').style.display = 'none';
});

function generateRandomQuestions() {
    const questionsToDisplay = 10;
    const shuffledQuestions = questionBank.sort(() => 0.5 - Math.random());
    let selectedQuestions = shuffledQuestions.slice(0, questionsToDisplay);

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    selectedQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <h2>Question ${index + 1}:</h2>
            <p>${question.question}</p>
            ${question.options.map((option, i) => `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`).join('')}
            <br>`;
        quizContainer.appendChild(questionElement);
    });
}

document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let score = 0;

    questionBank.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === question.answer) {
            score++;
        }
    });

    alert(`Your score is ${score} out of 10`);
});

document.getElementById('regenerate-questions').addEventListener('click', generateRandomQuestions);

generateRandomQuestions();

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
