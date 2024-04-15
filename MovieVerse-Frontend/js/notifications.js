const movieCode = {
    part1: 'YzVhMjBjODY=',
    part2: 'MWFjZjdiYjg=',
    part3: 'ZDllOTg3ZGNjN2YxYjU1OA=='
};

function getMovieCode() {
    return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    fetchReleasesByCategory('releasesSinceLastVisit', new Date(localStorage.getItem('lastVisit')), today, true);
    fetchReleasesByCategory('releasesThisMonth', new Date(today.getFullYear(), today.getMonth(), 1), today, false);
    fetchReleasesByCategory('releasesThisYear', new Date(today.getFullYear(), 0, 1), today, false);
    fetchRecommendedReleases();
});

async function fetchReleasesByCategory(elementId, startDate, endDate, isLastVisit) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';

    let movies = await fetchMovies(startDate, endDate);

    movies = movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    populateList(elementId, movies.slice(0, 5));
}

async function fetchMovies(startDate, endDate) {
    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

    const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&release_date.gte=${formattedStartDate}&release_date.lte=${formattedEndDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error('Failed to fetch movies for', elementId + ':', error);
        return [];
    }
}

function generateMovieNames(input) {
    return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

async function fetchRecommendedReleases() {
    let url;

    try {
        const favoriteGenres = localStorage.getItem('favoriteGenre');

        if (!favoriteGenres) {
            throw new Error('No favorite genres found in localStorage.');
        }
        const genresArray = JSON.parse(favoriteGenres);
        const genreId = genresArray[0];

        if (!genreId) {
            throw new Error('Genre ID is not valid.');
        }
        url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;
    }
    catch (error) {
        console.error('Fetching recommended movies failed or data issues:', error);
        url = `https://${getMovieVerseData()}/3/movie/popular?${generateMovieNames()}${getMovieCode()}&language=en-US&page=1`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        populateList('recommendedReleases', data.results.slice(0, 5));
    }
    catch (error) {
        console.error('Failed to fetch movies:', error);
    }
}

function populateList(elementId, movies) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            localStorage.setItem('selectedMovieId', movie.id.toString());
            window.location.href = 'movie-details.html';
        });

        const title = document.createElement('span');
        title.textContent = movie.title;
        title.style.color = 'black';
        li.appendChild(title);

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
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            localStorage.setItem('selectedActorId', actor.id.toString());
            window.location.href = 'actor-details.html';
        });

        const name = document.createElement('span');
        name.textContent = actor.name;
        li.appendChild(name);
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
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            localStorage.setItem('selectedDirectorId', director.id.toString());
            window.location.href = 'director-details.html';
        });

        const name = document.createElement('span');
        name.textContent = director.name;
        li.appendChild(name);

        list.appendChild(li);
    });
}
