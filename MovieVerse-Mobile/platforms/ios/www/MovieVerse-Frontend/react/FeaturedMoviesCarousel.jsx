import React, { Component } from 'react';

class FeaturedMoviesCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredMovies: [],
      loading: true,
      error: null,
      currentIndex: 0,
    };
  }

  componentDidMount() {
    fetch('https://movie-verse.com/featured-movies')
      .then(response => response.json())
      .then(data => this.setState({ featuredMovies: data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  goToPrevious = () => {
    this.setState(prevState => ({
      currentIndex: (prevState.currentIndex - 1 + prevState.featuredMovies.length) % prevState.featuredMovies.length,
    }));
  };

  goToNext = () => {
    this.setState(prevState => ({
      currentIndex: (prevState.currentIndex + 1) % prevState.featuredMovies.length,
    }));
  };

  renderCarousel() {
    const { featuredMovies, currentIndex } = this.state;
    const currentMovie = featuredMovies[currentIndex];

    return (
      <div className="carousel">
        <button onClick={this.goToPrevious}>Previous</button>
        <div className="carousel-content">
          <h3>{currentMovie.title}</h3>
          <p>{currentMovie.description}</p>
          <p>{currentMovie.rating} / 5</p>
          <p>{currentMovie.runtime} minutes</p>
        </div>
        <button onClick={this.goToNext}>Next</button>
      </div>
    );
  }

  render() {
    const { loading, error } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading featured movies.</p>;

    return <div>{this.renderCarousel()}</div>;
  }
}

export default FeaturedMoviesCarousel;
