-- Create 'movies' table
CREATE TABLE movies (
    movie_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    vote_average DECIMAL(2, 1),
    release_date DATE,
    poster_path VARCHAR(255)
);

-- Create 'genres' table
CREATE TABLE genres (
    genre_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create a junction table for many-to-many relationship between movies and genres
CREATE TABLE movie_genres (
  movie_id INT,
  genre_id INT,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
  FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

-- Create 'favorite_movies' table to store user's favorite movies
CREATE TABLE favorite_movies (
 user_id INT,
 movie_id INT,
 PRIMARY KEY (user_id, movie_id),
 FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Indexes can be added for optimizing searches
CREATE INDEX idx_movie_title ON movies (title);
CREATE INDEX idx_genre_name ON genres (name);
