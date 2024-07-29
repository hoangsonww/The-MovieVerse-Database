import React, { Component } from 'react';

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: props.movieId,
      details: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch(`https://movie-verse.com/src/html/movie-details.html`)
      .then(response => response.json())
      .then(data => this.setState({ details: data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  render() {
    const { details, loading, error } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading movie details!</p>;

    return (
      <div>
        <h2>{details.title}</h2>
        <p>
          <strong>Director:</strong> {details.director}
        </p>
        <p>
          <strong>Release Year:</strong> {details.year}
        </p>
        <p>
          <strong>Genre:</strong> {details.genre.join(', ')}
        </p>
        <p>
          <strong>Description:</strong> {details.description}
        </p>
        <p>
          <strong>Cast:</strong> {details.cast.join(', ')}
        </p>
        <p>
          <strong>Reviews:</strong>{' '}
          {details.reviews.map(review => (
            <div key={review.id}>
              <p>
                <strong>{review.name}</strong> - {review.content}
              </p>
            </div>
          ))}
        </p>
        <p>
          <strong>Rating:</strong> {details.rating}
        </p>
        <p>
          <strong>Runtime:</strong> {details.runtime} minutes
        </p>
        <p>
          <strong>Box Office:</strong> ${details.boxOffice}
        </p>
        <p>
          <strong>Trivia:</strong> {details.trivia}
        </p>
        <p>
          <strong>Similar Movies:</strong> {details.similarMovies.join(', ')}
        </p>
        <p>
          <strong>Sequels:</strong> {details.sequels.join(', ')}
        </p>
        <p>
          <strong>Prequels:</strong> {details.prequels.join(', ')}
        </p>
      </div>
    );
  }
}

export default MovieDetails;
