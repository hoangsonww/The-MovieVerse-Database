import * as singleSpa from 'single-spa';

// Function to load microfrontends (apps)
function loadApp(name, path, activeWhen, customProps = {}) {
    singleSpa.registerApplication(
        name,
        () => System.import(path),
        activeWhen,
        customProps
    );
}

loadApp(
    'navbar',
    '/path-to-navbar-microfrontend/navbar.js',
    () => true // always active
);

loadApp(
    'home',
    '/path-to-home-microfrontend/home.js',
    (location) => location.pathname === '' || location.pathname === '/'
);

loadApp(
    'movie-details',
    '/path-to-movie-details-microfrontend/movie-details.js',
    (location) => location.pathname.startsWith('/movie')
);

loadApp(
    'about',
    '/path-to-about-microfrontend/about.js',
    (location) => location.pathname.startsWith('/about')
);

singleSpa.start();
