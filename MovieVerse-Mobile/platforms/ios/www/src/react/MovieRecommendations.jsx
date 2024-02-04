import React, { Component } from 'react';

class MovieRecommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendations: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        fetch('https://movie-verse.com/#main')
            .then(response => response.json())
            .then(data => this.setState({ recommendations: data, loading: false }))
            .catch(error => this.setState({ error, loading: false }));
    }

    renderRecommendations() {
        const { recommendations } = this.state;
        return recommendations.map(movie => (
            <div key={movie.id} className="recommendation">
                <h4>{movie.title}</h4>
                <p>{movie.description}</p>
                <p>Rating: {movie.rating} / 5</p>
                <p>Runtime: {movie.runtime} minutes</p>
                <p>Box Office: ${movie.boxOffice}</p>
                <p>Similar Movies: {movie.similarMovies.join(', ')}</p>
                <p>Sequels: {movie.sequels.join(', ')}</p>
                <p>Prequels: {movie.prequels.join(', ')}</p>
            </div>
        ));
    }

    render() {
        const { loading, error } = this.state;

        if (loading) return <p>Loading recommendations...</p>;
        if (error) return <p>Error loading recommendations.</p>;

        return (
            <div>
                <h3>Movie Recommendations</h3>
                {this.renderRecommendations()}
            </div>
        );
    }
}

export default MovieRecommendations;
