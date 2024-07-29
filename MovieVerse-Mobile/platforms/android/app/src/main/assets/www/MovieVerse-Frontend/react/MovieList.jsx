class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { movies: [] };
  }

  componentDidMount() {
    fetch('https://movie-verse.com')
      .then(response => response.json())
      .then(data => this.setState({ movies: data }))
      .catch(error => console.error('Error fetching movies:', error));
  }

  render() {
    return (
      <div>
        <h2>Movie List</h2>
        <ul>
          {this.state.movies.map(movie => (
            <li key={movie.id}>
              <strong>{movie.title}</strong> - Directed by {movie.director}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<MovieList />, document.getElementById('react-root'));
