const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchReleasesByCategory('releasesSinceLastVisit', new Date(localStorage.getItem('lastVisit')));
    fetchReleasesByCategory('releasesThisMonth', new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    fetchReleasesByCategory('releasesThisYear', new Date(new Date().getFullYear(), 0, 1));
    fetchRecommendedReleases();
});

async function fetchReleasesByCategory(elementId, startDate) {
    const API_KEY = 'your_api_key_here';
    const formattedDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${getMovieCode()}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&release_date.gte=${formattedDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        populateList(elementId, data.results.slice(0, 5));  // Slicing to limit to 5 movies
    } catch (error) {
        console.error('Failed to fetch movies:', error);
    }
}

async function fetchRecommendedReleases() {
    const API_KEY = 'your_api_key_here';
    let url;

    try {
        const favoriteGenres = localStorage.getItem('favoriteGenre');
        if (!favoriteGenres) {
            throw new Error('No favorite genres found in localStorage.');
        }
        const genresArray = JSON.parse(favoriteGenres);
        const genreId = genresArray[0]; // Assuming the genre ID is the first element in the array
        if (!genreId) {
            throw new Error('Genre ID is not valid.');
        }
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${getMovieCode()}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;
    } catch (error) {
        console.error('Fetching recommended movies failed or data issues:', error);
        // Fallback to fetch the most popular movies
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${getMovieCode()}&language=en-US&page=1`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        populateList('recommendedReleases', data.results.slice(0, 5));
    } catch (error) {
        console.error('Failed to fetch movies:', error);
    }
}

function populateList(elementId, movies) {
    const list = document.getElementById(elementId);
    list.innerHTML = ''; // Clear existing content
    movies.forEach(movie => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'movie-details.html';
        a.textContent = movie.title;
        a.id = 'movie-link';
        a.style.color = 'black'; // Style for link color
        a.style.textDecoration = 'none'; // Remove underline
        a.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor click behavior
            localStorage.setItem('selectedMovieId', movie.id.toString());
            window.location.href = 'movie-details.html';
        });
        li.appendChild(a);
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateActors();
    populateDirectors();
});

function populateActors() {
    const actors = [
        { name: "Robert Downey Jr.", id: 3223 },
        { name: "Scarlett Johansson", id: 1245 },
        { name: "Denzel Washington", id: 5292 },
        { name: "Meryl Streep", id: 5064 },
        { name: "Leonardo DiCaprio", id: 6193 },
        { name: "Sandra Bullock", id: 18277 },
        { name: "Tom Hanks", id: 31 }
    ];

    const list = document.getElementById('popularActors').querySelector('ul');
    actors.forEach(actor => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = actor.name;
        a.href = '#';
        a.id = 'actor-link';
        a.onclick = () => {
            localStorage.setItem('selectedActorId', actor.id.toString());
            window.location.href = 'actor-details.html';
        };
        li.appendChild(a);
        list.appendChild(li);
    });
}

function populateDirectors() {
    const directors = [
        {name: "Steven Spielberg", id: 488},
        {name: "Martin Scorsese", id: 1032},
        {name: "Christopher Nolan", id: 525},
        {name: "Quentin Tarantino", id: 138},
        {name: "Kathryn Bigelow", id: 14392},
        {name: "James Cameron", id: 2710},
        {name: "Sofia Coppola", id: 1776}
    ];

    const list = document.getElementById('popularDirectors').querySelector('ul');
    directors.forEach(director => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = director.name;
        a.href = '#';
        a.id = 'director-link';
        a.onclick = () => {
            localStorage.setItem('selectedDirectorId', director.id.toString());
            window.location.href = 'director-details.html';
        };
        li.appendChild(a);
        list.appendChild(li);
    });

}