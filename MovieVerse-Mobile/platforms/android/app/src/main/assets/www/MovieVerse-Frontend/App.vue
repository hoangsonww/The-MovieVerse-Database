<template>
  <div id="app">
    <header>
      <h1>Welcome to The MovieVerse</h1>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <aside>
      <h2>Upcoming Movies</h2>
    </aside>

    <footer>
      <p>&copy; 2023 The MovieVerse. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'The MovieVerse - Explore Movies, TV Series, and More',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'description', content: 'Explore The MovieVerse to discover and learn about your favorite movies, directors, actors, and more.' },
      { property: 'og:title', content: 'The MovieVerse - Your Ultimate Movie Guide' },
      { property: 'og:description', content: 'Explore The MovieVerse to discover and learn about your favorite movies, directors, actors, and more.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://movie-verse.com/' },
      { property: 'og:image', content: 'https://movie-verse.com/images/image.png' },
      { property: 'og:site_name', content: 'The MovieVerse' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'author', content: 'Son Nguyen Hoang' },
      { name: 'keywords', content: 'movies, film guide, directors, actors, movie genres, cinema, film reviews, tv shows, movie verse, movieverse, film' },
      { name: 'robots', content: 'index, follow' },
      { name: 'revisit-after', content: '1 day' },
      { name: 'language', content: 'English' },
      { name: 'theme-color', content: '#7378c5' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@movieverse' },
      { name: 'twitter:title', content: 'The MovieVerse - Your Ultimate Movie Guide' },
      { name: 'twitter:description', content: 'Explore The MovieVerse to discover and learn about your favorite movies, directors, actors, and more.' },
      { name: 'twitter:image', content: 'https://movie-verse.com/images/image.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://movie-verse.com/images/favicon.ico' },
      { rel: 'canonical', href: 'https://movie-verse.com/' },
      { rel: 'stylesheet', href: 'https://movie-verse.com/MovieVerse-Frontend/css/style.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;400;600&display=swap' }
    ]
  }
};
</script>

<style>
#app {
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header, footer {
  background-color: #20232a;
  color: #61dafb;
  padding: 20px;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

aside {
  background-color: #282c34;
  color: white;
  padding: 15px;
  margin-top: 20px;
}

footer {
  background-color: #20232a;
  color: #61dafb;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
