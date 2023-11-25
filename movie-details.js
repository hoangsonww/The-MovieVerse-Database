document.addEventListener('DOMContentLoaded', () => {
    const movieId = localStorage.getItem('selectedMovieId');
    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        document.getElementById('movie-details-container').innerHTML = '<p>Movie details not found.</p>';
    }
});

async function fetchMovieDetails(movieId) {
    const apiKey = 'c5a20c861acf7bb8d9e987dcc7f1b558';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,keywords,similar`;

    try {
        const response = await fetch(url);
        const movie = await response.json();
        populateMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function populateMovieDetails(movie) {
    document.getElementById('movie-image').src = `https://image.tmdb.org/t/p/w1280${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-description').textContent = movie.overview;
    document.getElementById('movie-rating').textContent = `IMDB Rating: ${movie.vote_average}`;

    // Create elements for additional movie details
    const genres = movie.genres.map(genre => genre.name).join(', ');
    const releaseDate = movie.release_date;
    const runtime = movie.runtime + ' minutes';
    const budget = movie.budget.toLocaleString();
    const revenue = movie.revenue.toLocaleString();
    const productionCompanies = movie.production_companies.map(pc => pc.name).join(', ');
    const tagline = movie.tagline;
    const languages = movie.spoken_languages.map(lang => lang.name).join(', ');
    const countries = movie.production_countries.map(country => country.name).join(', ');
    const originalLanguage = movie.original_language.toUpperCase();
    const popularityScore = movie.popularity.toFixed(2);
    const status = movie.status;
    const userScore = movie.vote_average;
    const voteCount = movie.vote_count.toLocaleString();
    const keywords = movie.keywords ? movie.keywords.keywords.map(kw => kw.name).join(', ') : 'N/A';
    const similarTitles = movie.similar ? movie.similar.results.map(m => m.title).join(', ') : 'N/A';

    // Append these details to the movie-right div
    document.getElementById('movie-description').innerHTML += `
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Release Date:</strong> ${releaseDate}</p>
        <p><strong>Runtime:</strong> ${runtime}</p>
        <p><strong>Budget:</strong> $${budget}</p>
        <p><strong>Revenue:</strong> $${revenue}</p>
        <p><strong>Production Companies:</strong> ${productionCompanies}</p>
        <p><strong>Tagline:</strong> ${tagline}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Countries of Production:</strong> ${countries}</p>
        <p><strong>Original Language:</strong> ${originalLanguage}</p>
        <p><strong>Popularity Score:</strong> ${popularityScore}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>User Score:</strong> ${userScore} (based on ${voteCount} votes)</p>
        <p><strong>Keywords:</strong> ${keywords}</p>
    `;

    const similarMoviesHeading = document.createElement('p');
    similarMoviesHeading.innerHTML = '<strong>Similar Movies:</strong> ';
    document.getElementById('movie-description').appendChild(similarMoviesHeading);

    // Check if similar movies are available
    if (movie.similar && movie.similar.results.length > 0) {
        movie.similar.results.forEach((similarMovie, index) => {
            const movieLink = document.createElement('span');
            movieLink.textContent = similarMovie.title;
            movieLink.style.cursor = 'pointer';
            movieLink.style.textDecoration = 'underline';
            movieLink.addEventListener('mouseenter', () => {
                movieLink.style.color = '#f509d9';
            });
            movieLink.addEventListener('mouseleave', () => {
                movieLink.style.color = 'white';
            });
            movieLink.addEventListener('click', () => {
                localStorage.setItem('selectedMovieId', similarMovie.id); // Store the clicked movie's ID
                window.location.href = 'movie-details.html'; // Redirect to the details page
            });

            // Append the clickable movie link
            similarMoviesHeading.appendChild(movieLink);

            // If not the last movie, add a comma and space
            if (index < movie.similar.results.length - 1) {
                similarMoviesHeading.appendChild(document.createTextNode(', '));
            }
        });
    } else {
        similarMoviesHeading.appendChild(document.createTextNode('None available.'));
    }
}
