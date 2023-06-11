import apiService from 'api/api';
import { Status } from 'api/status';
import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { Button, Container } from './MoviesDetailsPage.styled';

const MovieDetailsPage = () => {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const location = useLocation();

  const backLinkHref = location.state?.from ?? '/';

  useEffect(() => {
    setStatus(Status.PENDING);
    apiService
      .getMovieById(movieId)
      .then(data => {
        setMovie(data);
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        console.log(error);
        setError('Something went wrong. Please try again.');
        setStatus(Status.REJECTED);
      });
  }, [movieId, error]);

  return (
    <>
      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent />}

      {status === Status.RESOLVED && (
        <>
          <Button to={backLinkHref}>Back to Home Page</Button>
          <Container>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : 'noPhoto'
              }
              alt={movie.title}
              width="250"
            />
            <div>
              <h1>{movie.title} </h1>
              <p>User Score: {movie.vote_average * 10}%</p>
              <h3>
                Overview
                <span>{movie.overview}</span>
              </h3>
              {movie.genres && (
                <>
                  <h3>Genres</h3>
                  <ul>
                    {movie.genres.map(genre => (
                      <li key={genre.id}>{genre.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Container>

          <nav>
            <p>Additional information</p>

            <NavLink
              to={{
                pathname: `cast`,
                state: { from: { location } },
              }}
            >
              Cast
            </NavLink>

            <NavLink
              to={{
                pathname: `reviews`,
                state: { from: { location } },
              }}
            >
              Reviews
            </NavLink>
          </nav>

          <Suspense fallback={<LoaderComponent />}>
            <Outlet />
          </Suspense>
        </>
      )}
    </>
  );
};

export default MovieDetailsPage;
