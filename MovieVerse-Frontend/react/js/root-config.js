import { registerApplication, start } from 'single-spa';

// Defines a function that takes a location and returns true if the location should be active
function pathPrefix(prefix) {
  return function (location) {
    return location.pathname.startsWith(prefix);
  };
}

// Load React Microfrontend for the homepage
registerApplication('home', () => System.import('http://localhost:8080/home.js'), pathPrefix('/home'));

// Load React Microfrontend for the about page
registerApplication('about', () => System.import('http://localhost:8083/about.js'), pathPrefix('/about'));

// Load React Microfrontend for the trivia page
registerApplication('quiz', () => System.import('http://localhost:8084/quiz.js'), pathPrefix('/contact'));

// Load React Microfrontend for the favorites / watchlist page
registerApplication('favorites', () => System.import('http://localhost:8085/favorites.js'), pathPrefix('/favorites'));

// Load React Microfrontend for the movie match page
registerApplication('movie-match', () => System.import('http://localhost:8086/movie-match.js'), pathPrefix('/movie-match'));

// Load React Microfrontend for the movie timeline page
registerApplication('movie-timeline', () => System.import('http://localhost:8087/movie-timeline.js'), pathPrefix('/movie-details'));

// Load Vue Microfrontend for the movie listing
registerApplication('movies', () => System.import('http://localhost:8081/movies.js'), pathPrefix('/movies'));

// Load Vue Microfrontend for the navbar
registerApplication('navbar', () => System.import('http://localhost:8082/navbar.js'), pathPrefix('/navbar'));

start();
