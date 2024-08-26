const mongoose = require('mongoose');
const axios = require('axios');
const config = require('./config');
const { mongo } = require('mongoose');
const redis = require('redis');

// Movie Metadata Connection
const movieMetadataConnection = mongoose.createConnection(config.MONGO_URI2, {});

// Movie Metadata Schema
const movieMetadataSchema = new mongoose.Schema({
  movieId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: String,
  releaseDate: Date,
  runtime: Number,
  genres: [{ id: Number, name: String }],
  productionCountries: [{ iso_3166_1: String, name: String }],
  spokenLanguages: [{ iso_639_1: String, name: String }],
  posterPath: String,
  backdropPath: String,
  voteAverage: Number,
  voteCount: Number,
});

const MovieMetadata = movieMetadataConnection.model('MovieMetadata', movieMetadataSchema);

// Function to fetch and seed movie metadata
async function fetchAndSeedMovieMetadata() {
  const TMDB_API_KEY = config.TMDB_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';
  const pagesToFetch = 10;

  for (let page = 1; page <= pagesToFetch; page++) {
    try {
      const response = await axios.get(`${baseUrl}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: page,
        },
      });

      const movies = response.data.results;

      const metadataToInsert = movies.map(movie => ({
        movieId: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        runtime: movie.runtime,
        genres: movie.genres,
        productionCountries: movie.production_countries,
        spokenLanguages: movie.spoken_languages,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
      }));

      const result = await MovieMetadata.insertMany(metadataToInsert, { ordered: false }); // Ignore duplicate key errors
      console.log(`Inserted ${result.length} movie metadata entries for page ${page}`);
      await cacheTrendingMovies(metadataToInsert);
    } catch (error) {
      console.error(`Error fetching or inserting data for page ${page}:`, error);
    }
  }
}

// Person Data Connection
const peopleConnection = mongoose.createConnection(config.MONGO_URI5, {});

// Person Metadata Schema
const personSchema = new mongoose.Schema({
  personId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  biography: String,
  birthday: Date,
  deathday: Date,
  profilePath: String,
  knownForDepartment: String,
});

const Person = peopleConnection.model('PersonMetadata', personSchema);

// Function to fetch and seed people data
async function fetchAndSeedPeopleData() {
  const TMDB_API_KEY = config.TMDB_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';
  const pagesToFetch = 10; // Increase this if you want to fetch more people

  for (let page = 1; page <= pagesToFetch; page++) {
    try {
      const response = await axios.get(`${baseUrl}/person/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: page,
        },
      });

      const people = response.data.results;

      const peopleToInsert = people.map(person => ({
        personId: person.id,
        name: person.name,
        biography: person.biography,
        birthday: person.birthday,
        deathday: person.deathday,
        profilePath: person.profile_path,
        knownForDepartment: person.known_for_department,
      }));

      const result = await Person.insertMany(peopleToInsert, { ordered: false });
      console.log(`Inserted ${result.length} people entries for page ${page}`);
    } catch (error) {
      console.error(`Error fetching or inserting data for page ${page}:`, error);
    }
  }
}

// Genre Data Connection
genreConnection = mongoose.createConnection(config.MONGO_URI6, {});

const genreSchema = new mongoose.Schema({
  genreId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

const Genre = genreConnection.model('Genre', genreSchema);

// Function to seed genre data
async function seedGenreData() {
  const TMDB_API_KEY = config.TMDB_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';
  const genresUrl = `${baseUrl}/genre/movie/list`;

  try {
    const response = await axios.get(genresUrl, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    const genres = response.data.genres;

    const genresToInsert = genres.map(genre => ({
      genreId: genre.id,
      name: genre.name,
    }));

    const result = await Genre.insertMany(genresToInsert, { ordered: false });
    console.log(`Inserted ${result.length} genre entries`);
  } catch (error) {
    console.error('Error fetching or inserting genre data:', error);
  }
}

const generalAppDataConnection = mongoose.createConnection(config.MONGO_URI1, {});

generalAppDataConnection.once('open', () => {
  console.log('Connected to MongoDB (MovieVerse)');
});

async function seedGeneralAppData() {
  const appData = {
    name: 'MovieVerse',
    description:
      'An interactive movie database app that allows users to search for movies, view movie details, and save movies to their favorites list',
    version: '1.0.0',
  };

  const AppData = generalAppDataConnection.model('AppData', new mongoose.Schema({}));
  await AppData.deleteMany({});
  await AppData.create(appData);
  console.log('Inserted general app data');
}

const redisClient = redis.createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`,
});

redisClient.on('error', err => console.error('Redis Client Error', err));

async function connectToRedis() {
  await redisClient.connect();
  console.log('Connected to Redis (MovieVerse_cache)');
}

// Function to cache trending movies
async function cacheTrendingMovies(movies) {
  const trendingMoviesKey = 'trending_movies';
  await redisClient.del(trendingMoviesKey); // Clear previous data
  for (const movie of movies) {
    await redisClient.zAdd(trendingMoviesKey, { score: movie.voteAverage, value: JSON.stringify(movie) });
    await redisClient.expire(trendingMoviesKey, 3600); // Expire in 1 hour to conserve memory
  }
  console.log(`${movies.length} trending movies cached for this page!`);
}

// --- Main Execution ---

// Connect to Redis before seeding
connectToRedis().then(() => {
  // Now we can start seeding our databases since Redis is connected.
  Promise.all([
    movieMetadataConnection.once('open', () => console.log('Connected to MongoDB (MovieVerse_movies)')),
    peopleConnection.once('open', () => console.log('Connected to MongoDB (MovieVerse_people)')),
    genreConnection.once('open', () => console.log('Connected to MongoDB (MovieVerse_genres)')),
    generalAppDataConnection.once('open', () => console.log('Connected to MongoDB (MovieVerse)')),
  ]).then(() => {
    fetchAndSeedMovieMetadata();
    fetchAndSeedPeopleData();
    seedGenreData();
    seedGeneralAppData();
  });
});
