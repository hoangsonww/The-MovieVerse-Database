import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [mostPopular, setMostPopular] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [awardWinning, setAwardWinning] = useState([]);
  const [directorSpotlight, setDirectorSpotlight] = useState([]);

  useEffect(() => {
    const fetchMovies = async (category, setter) => {
      const api_key = process.env.REACT_APP_API_KEY;
      const url = `https://api.themoviedb.org/3/${category}?api_key=${api_key}&language=en-US&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      setter(data.results);
    };

    fetchMovies('movie/popular', setMostPopular);
    fetchMovies('movie/top_rated', setRecommended);
    fetchMovies('movie/now_playing', setAwardWinning);
    fetchMovies('discover/movie', setDirectorSpotlight);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <main>
      {/* Most Popular */}
      <section id="most-popular">
        <h2>Most Popular</h2>
        <div className="movie-list">
          {mostPopular.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section id="recommended">
        <h2>Recommended</h2>
        <div className="movie-list">
          {recommended.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Award Winning */}
      <section id="award-winning">
        <h2>Award Winning</h2>
        <div className="movie-list">
          {awardWinning.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Director Spotlight */}
      <section id="director-spotlight">
        <h2>Director Spotlight</h2>
        <div className="movie-list">
          {directorSpotlight.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <section id="pagination">
        <div className="pagination-buttons">
          <button onClick={handlePreviousPage}>Previous</button>
          <button onClick={handleNextPage}>Next</button>
        </div>
        <div className="page-number">
          <p>Page {currentPage}</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 MovieVerse App</p>
      </footer>
    </main>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
