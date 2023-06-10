import apiService from 'api/api';
import { Status } from 'api/status';
import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);

  const page = new URLSearchParams(location.search).get('page') ?? 1;

  useEffect(() => {
    setStatus(Status.PENDING);
    apiService
      .getPopularMovies(page)
      .then(({ results }) => {
        setMovies(results);
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        console.log(error);
        setError('Something went wrong. Please try again.');
        setStatus(Status.REJECTED);
      });
  }, [page]);

  return (
    <main>
      <h1>Trending today</h1>

      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent message={error.message} />}

      {status === Status.RESOLVED && (
        <>
          <ul>
            {movies.map(movie => (
              <li key={movie.id}>
                <Link
                  to={{
                    pathname: `movies/${movie.id}`,
                    state: { from: location },
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : 'noPhoto'
                    }
                    alt={movie.title}
                    width="120"
                  />
                </Link>
                <span>{movie.title}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default HomePage;
