const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(express.json());

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
};

app.use(logger);

// Authentication Middleware - Verifying the JWT token
// Note: your_secret_key should be replaced with a secure secret key (mine is not published here)
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin',
    },
    {
        username: 'anna',
        password: 'password123member',
        role: 'member',
    },
];

const movieFetcher = (req, res, next) => {
    const movieId = req.params.id;
    const movie = {
        id: movieId,
        title: 'Some Movie',
        releaseDate: '2021-01-01',
        overview: 'This is a movie',
    };
    req.movie = movie;
    next();
}

// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
};

// Movie Data Validation Middleware
const validateMovieData = (req, res, next) => {
    const { title, overview, releaseDate } = req.body;
    if (!title || !overview || !releaseDate) {
        return res.status(400).send({ error: 'Missing required movie data fields' });
    }
    next();
};

// Applying the authentication MovieVerse-Middleware to a specific route
app.post('/api/movies', authenticate, validateMovieData, (req, res) => {
    const { title, overview, releaseDate } = req.body;
    const movie = {
        id: 1,
        title,
        overview,
        releaseDate,
    };
    const movieId = movie.id;
    res.status(201).send({ message: `Movie ${movieId} added successfully` });
    res.status(201).send({ message: 'Movie added successfully' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});