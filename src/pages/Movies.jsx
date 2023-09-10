import apiService from 'api/api';

import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { SearchBar } from 'components/SearchBar/SearchBar';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { MovieList, MovieListItem } from './Movies.styled';
import { useState, useEffect } from 'react';
import noPhoto from '../img/noPhoto.png';

const Movies = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('name') || '';
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!query) return;
    setStatus('pending');
    apiService
      .getMoviesByKeyWord(query)
      .then(({ results }) => {
        if (results.length === 0) {
          setError(`No results to show for "${query}!"`);
          setStatus('rejected');
          return;
        }

        setMovies(results);
        setStatus('resolved');
      })
      .catch(error => {
        console.log(error);
        setError(error.message);
        setStatus('rejected');
      });
  }, [query]);

  const searchImages = newSearch => {
    if (query === newSearch) return;
    setMovies(null);
    setError(null);
    setStatus('idle');
    setSearchParams({ name: newSearch });
  };

  return (
    <>
      <SearchBar onHandleSubmit={searchImages} />

      {status === 'pending' && <LoaderComponent />}

      {status === 'rejected' && <ErrorComponent message={error} />}

      {status === 'resolved' && (
        <>
          <MovieList>
            {movies.map(movie => (
              <MovieListItem key={movie.id}>
                <NavLink to={`/movies/${movie.id}`} state={{ from: location }}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : noPhoto
                    }
                    alt={movie.title}
                    width="240"
                  />
                  {movie.title}
                </NavLink>
              </MovieListItem>
            ))}
          </MovieList>
        </>
      )}
    </>
  );
};

export default Movies;
