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
    '/navbar.js',
    () => true
);

loadApp(
    'home',
    '/home.js',
    (location) => location.pathname === '' || location.pathname === '/'
);

loadApp(
    'movie-details',
    '/movie-details.js',
    (location) => location.pathname.startsWith('/movie')
);

loadApp(
    'about',
    '/about.js',
    (location) => location.pathname.startsWith('/about')
);

singleSpa.start();
