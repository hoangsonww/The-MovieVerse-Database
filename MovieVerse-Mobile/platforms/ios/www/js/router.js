import Vue from 'vue';
import Router from 'vue-router';

import HomePage from './components/HomePage.vue';
import MovieDetails from './components/MovieDetails.vue';
import AboutPage from './components/AboutPage.vue';
import MovieMatch from './components/MovieMatch.vue';
import MovieTimeline from './components/MovieTimeline.vue';
import MovieOfTheDay from './components/MovieOfTheDay.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/movie/:id',
            name: 'MovieDetails',
            component: MovieDetails
        },
        {
            path: '/about',
            name: 'About',
            component: AboutPage
        },
        {
            path: '/movie-match',
            name: 'MovieMatch',
            component: MovieMatch
        },
        {
            path: '/movie-timeline',
            name: 'MovieTimeline',
            component: MovieTimeline
        },
        {
            path: '/movie-of-the-day',
            name: 'MovieOfTheDay',
            component: MovieOfTheDay
        },
        {
            path: '*',  // This wildcard route is for 404 Not Found pages
            redirect: '/'
        }
    ]
});
