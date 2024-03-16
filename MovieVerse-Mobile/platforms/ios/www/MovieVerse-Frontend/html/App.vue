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
};
</script>

<style>
  #app {
    text-align: center;
  }
</style>