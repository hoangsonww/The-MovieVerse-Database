import { registerApplication, start } from 'single-spa';

function pathPrefix(prefix) {
  return function(location) {
    return location.pathname.startsWith(prefix);
  }
}

// Load React Microfrontend for the homepage
registerApplication(
  'home',
  () => System.import('http://localhost:8080/home.js'),
  pathPrefix('/home')
);

// Load Vue Microfrontend for the movie listing
registerApplication(
  'movies',
  () => System.import('http://localhost:8081/movies.js'),
  pathPrefix('/movies')
);

start();
