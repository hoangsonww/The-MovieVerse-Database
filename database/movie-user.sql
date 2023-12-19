-- Create a database (Uncomment if needed)
CREATE DATABASE MovieVerseDB;

-- Switch to the MovieVerseDB database (Uncomment if needed)
\c MovieVerseDB

-- Create table for storing movie details
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    genre VARCHAR(100),
    director VARCHAR(255),
    description TEXT,
    duration INT,
    language VARCHAR(50),
    country VARCHAR(100),
    poster_url VARCHAR(255)
);

-- Create table for storing movie cast
CREATE TABLE cast (
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    actor VARCHAR(255),
    role VARCHAR(255),
    PRIMARY KEY (movie_id, actor)
);

-- Create table for storing movie crew
CREATE TABLE crew (
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    crew_member VARCHAR(255),
    role VARCHAR(255),
    PRIMARY KEY (movie_id, crew_member)
);

-- Create table for storing movie trailers
CREATE TABLE trailers (
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    trailer_url VARCHAR(255),
    PRIMARY KEY (movie_id, trailer_url)
);

-- Create table for storing user information
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create table for storing reviews
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 10)
);

-- Create table for storing ratings
CREATE TABLE ratings (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id)
);

-- Create table for storing movie favorites
CREATE TABLE favorites (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    favorited_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id)
);

-- Create table for storing movie watchlist
CREATE TABLE watchlist (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id)
);

-- Create table for storing movie watch history
CREATE TABLE watch_history (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    watched_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id)
);

-- Indexes for performance optimization
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_movie_id ON ratings(movie_id);
