// config.js - Configurations for the MovieVerse backend
// Replace with your own configuration -- mine might be different
module.exports = {
    MONGO_URI1: 'mongodb://localhost:27017/MovieVerse', // Store general application data
    MONGO_URI2: 'mongodb://localhost:27017/MovieVerse_movies',
    // MONGO_URI3: 'mongodb://localhost:27017/MovieVerse_users', -- TO BE HANDLED BY POSTGRESQL
    // MONGO_URI4: 'mongodb://localhost:27017/MovieVerse_reviews', -- TO BE HANDLED BY MYSQL
    MONGO_URI5: 'mongodb://localhost:27017/MovieVerse_people',
    MONGO_URI6: 'mongodb://localhost:27017/MovieVerse_genres',
    redisHost: '127.0.0.1',
    redisPort: 6379,
    rabbitMQHost: 'localhost',
    port: 9090,
    MYSQL_HOST: 'localhost:3306',
    MYSQL_USER: 'root',
    MYSQL_PASSWORD: '09112004',
    MYSQL_DB: 'MovieVerse',
    POSTGRES_USER: 'root',
    POSTGRES_PASSWORD: '09112004',
    POSTGRES_DB: 'MovieVerse',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: 5432,
    TMDB_API_KEY: '6efe9a82cdbb2123814a866aee20c38f' // Replace with your own TMDB API key to get started
}
