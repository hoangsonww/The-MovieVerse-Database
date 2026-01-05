CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    tmdb_id INT UNIQUE,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    genres VARCHAR(255),
    release_date DATE,
    rating FLOAT,
    popularity FLOAT
);
