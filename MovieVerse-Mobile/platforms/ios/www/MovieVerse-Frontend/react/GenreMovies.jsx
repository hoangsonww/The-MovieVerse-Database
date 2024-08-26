import React, { Component } from 'react';

class GenreMovies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genre: props.genre,
      movies: [],
      error: null,
    };
  }

  componentDidMount() {
    fetch(`https://movie-verse.com/`)
      .then(response => response.json())
      .then(data => this.setState({ movies: data }))
      .catch(error => this.setState({ error }));
  }

  renderMovies() {
    const { movies } = this.state;
    return movies.map(movie => (
      <div key={movie.id} className="movie">
        <h4>{movie.title}</h4>
        <p>{movie.description}</p>
        <p>Directed by {movie.director}</p>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h3>{this.state.genre} Movies</h3>
        {this.renderMovies()}
      </div>
    );
  }
}

export default GenreMovies;
