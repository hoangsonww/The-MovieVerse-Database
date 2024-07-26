// 1. Interfaces for Common Data Types

interface IMovie {
    id: number;
    title: string;
    director: string;
    releaseYear: number;
    genres: string[];
    rating?: number; // optional
}

interface IUser {
    id: number;
    name: string;
    email: string;
    favoriteMovies?: IMovie[]; // optional
}

// 2. Utility Functions

function formatMovieTitle(title: string): string {
    return title.trim().toUpperCase();
}

function filterMoviesByGenre(movies: IMovie[], genre: string): IMovie[] {
    return movies.filter(movie => movie.genres.includes(genre));
}

// 3. Class-Based Module for API Requests

class MovieAPI {
    private static baseUrl: string = 'https://api.themovieverse.com/';

    static async fetchMovieById(movieId: number): Promise<IMovie | null> {
        try {
            const response = await fetch(`${this.baseUrl}movies/${movieId}`);
            if (!response.ok) throw new Error('Movie not found');
            const movie: IMovie = await response.json();
            return movie;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async fetchMoviesByDirector(directorName: string): Promise<IMovie[]> {
        try {
            const response = await fetch(`${this.baseUrl}movies?director=${encodeURIComponent(directorName)}`);
            if (!response.ok) throw new Error('Error fetching movies');
            const movies: IMovie[] = await response.json();
            return movies;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

// Example Usage:
// MovieAPI.fetchMovieById(123).then(movie => console.log(movie));
// MovieAPI.fetchMoviesByDirector('Christopher Nolan').then(movies => console.log(movies));
