document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const accounts = JSON.parse(localStorage.getItem('accountsMovieVerse')) || [];
    const accountExists = accounts.some(account => account.email === email && account.password === password);

    if (accountExists) {
        alert('Successfully signed in!');
        window.location.href = '../../index.html';
        localStorage.setItem('isSignedIn', JSON.stringify(true));
    }
    else {
        alert('Invalid email or password. Ensure that you have entered a correct combination of email and password - one that we have on file.');
    }
});

document.getElementById('createAccountBtn').addEventListener('click', function() {
    window.location.href = 'create-account.html';
});

async function showMovieOfTheDay() {
    const year = new Date().getFullYear();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=c5a20c861acf7bb8d9e987dcc7f1b558&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

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