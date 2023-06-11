import apiService from 'api/api';
import { Status } from 'api/status';

import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { SearchBar } from 'components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MovieListItem } from './Movies.styled';

const Movies = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);

  useEffect(() => {
    if (!query) return;
    setStatus(Status.PENDING);
    apiService
      .getMoviesByKeyWord(query)
      .then(({ results }) => {
        if (results.length === 0) {
          setError(`No results to show for "${query}!"`);
          setStatus(Status.REJECTED);
          return;
        }

        setMovies(results);
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        console.log(error);
        setError(error.message);
        setStatus(Status.REJECTED);
      });
  }, [query]);

  const searchImages = newSearch => {
    if (query === newSearch) return;
    setQuery(newSearch);
    setMovies(null);
    setError(null);
    setStatus(Status.IDLE);
  };

  return (
    <>
      <SearchBar onHandleSubmit={searchImages} />

      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent message={error} />}

      {status === Status.RESOLVED && (
        <>
          <ul>
            {movies.map(movie => (
              <MovieListItem key={movie.id}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : 'noPhoto'
                  }
                  alt={movie.title}
                  width="320"
                />
                <NavLink
                  to={{
                    pathname: `${movie.id}`,
                    state: { from: { location } },
                  }}
                >
                  <p>{movie.title}</p>
                </NavLink>
              </MovieListItem>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Movies;
