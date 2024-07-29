import React, { Component } from 'react';

class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      loading: false,
      message: '',
    };
  }

  handleOnInputChange = event => {
    const query = event.target.value;
    this.setState({ query, loading: true, message: '' }, () => {
      this.fetchSearchResults(query);
    });
  };

  fetchSearchResults = query => {
    if (!query) {
      this.setState({ results: [], loading: false });
      return;
    }

    fetch(`https://movie-verse.com/search?query=${query}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ results: data.movies, loading: false });
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        this.setState({
          loading: false,
          message: 'Unable to fetch results. Please try again.',
        });
      });
  };

  renderSearchResults = () => {
    const { results } = this.state;
    if (results.length) {
      return (
        <div className="results-container">
          {results.map(movie => (
            <div key={movie.id} className="result-item">
              <h6 className="movie-title">{movie.title}</h6>
              <p className="movie-description">{movie.description}</p>
              {/* You can add more content like images, links, etc. */}
            </div>
          ))}
        </div>
      );
    }
  };

  render() {
    const { query } = this.state;
    return (
      <div className="container">
        {/* Heading */}
        <h2 className="heading">Movie Search</h2>

        {/* Search Input */}
        <label className="search-label" htmlFor="search-input">
          <input type="text" value={query} id="search-input" placeholder="Search for movies..." onChange={this.handleOnInputChange} />
          <i className="fa fa-search search-icon" aria-hidden="true" />
        </label>

        {/* Result */}
        {this.renderSearchResults()}
      </div>
    );
  }
}

export default MovieSearch;
