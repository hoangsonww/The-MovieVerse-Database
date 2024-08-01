let System = (window.System = window.System || {});
System.import('@system-env').then(env => {
  env.production = true;
  if (!env.production) {
    let System = window.System;
    System.importMap({
      imports: {
        'single-spa': 'https://unpkg.com/single-spa/lib/system/single-spa.dev.js',
        'movieverse-navbar': 'http://localhost:8500/movieverse-navbar.js',
        'movieverse-main-content': 'http://localhost:8501/movieverse-main-content.js',
        'movieverse-footer': 'http://localhost:8502/movieverse-footer.js',
      },
    });
  } else {
    let System = window.System;
    System.importMap({
      imports: {
        'single-spa': 'https://unpkg.com/single-spa/lib/system/single-spa.min.js',
        'movieverse-navbar': 'https://your-production-url/movieverse-navbar.js',
        'movieverse-main-content': 'https://your-production-url/movieverse-main-content.js',
        'movieverse-footer': 'https://your-production-url/movieverse-footer.js',
      },
    });
  }
});
