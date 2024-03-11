-- Drop existing tables if they exist to prevent errors
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Actors;
DROP TABLE IF EXISTS Directors;
DROP TABLE IF EXISTS MovieGenres;
DROP TABLE IF EXISTS MovieActors;
DROP TABLE IF EXISTS MovieDirectors;

-- Table for storing movie genres
CREATE TABLE Genres (
    GenreID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL
);

-- Table for storing actors
CREATE TABLE Actors (
    ActorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Birthdate DATE,
    Country VARCHAR(100)
);

-- Table for storing directors
CREATE TABLE Directors (
    DirectorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Birthdate DATE,
    Country VARCHAR(100)
);

-- Table for storing movies
CREATE TABLE Movies (
    MovieID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    ReleaseDate DATE,
    Language VARCHAR(50),
    Runtime INT,
    Budget DECIMAL(15, 2),
    Revenue DECIMAL(15, 2),
    Plot TEXT
);

-- Many-to-many relationship table between Movies and Genres
CREATE TABLE MovieGenres (
    MovieID INT,
    GenreID INT,
    PRIMARY KEY (MovieID, GenreID),
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES Genres(GenreID) ON DELETE CASCADE
);

-- Many-to-many relationship table between Movies and Actors
CREATE TABLE MovieActors (
    MovieID INT,
    ActorID INT,
    PRIMARY KEY (MovieID, ActorID),
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (ActorID) REFERENCES Actors(ActorID) ON DELETE CASCADE
);

-- Many-to-many relationship table between Movies and Directors
CREATE TABLE MovieDirectors (
    MovieID INT,
    DirectorID INT,
    PRIMARY KEY (MovieID, DirectorID),
    FOREIGN KEY (MovieID) REFERENCES Movies(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (DirectorID) REFERENCES Directors(DirectorID) ON DELETE CASCADE
);
