import React from 'react';
import ReactDOM from 'react-dom';
import MovieList from './MovieList';
import MovieDetails from './MovieDetails';
import MovieSearch from './MovieSearch';
import UserReviews from './UserReviews';
import MovieRecommendations from './MovieRecommendations';
import GenreMovies from './GenreMovies';

class App extends React.Component {
    render() {
        return (
            <div>
                <MovieList />
                <MovieDetails movieId="123" />
                <MovieSearch />
                <UserReviews movieId="123" />
                <MovieRecommendations />
                <GenreMovies genre="Action" />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
