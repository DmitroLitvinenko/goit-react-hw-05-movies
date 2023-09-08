import apiService from 'api/api';
import { Status } from 'api/status';
import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { Button, Container, DetailsBtn } from './MoviesDetailsPage.styled';

const MovieDetailsPage = () => {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const location = useLocation();

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

  const backLinkHref = location?.state?.from ?? '/movies';

  return (
    <>
      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent />}

      {status === Status.RESOLVED && (
        <>
          <Button to={backLinkHref}> Go Back</Button>
          <Container>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : '../../noPhoto.png'
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

            <DetailsBtn>
              <NavLink to={`cast`} state={location.state}>
                Cast
              </NavLink>

              <NavLink to={`reviews`} state={location.state}>
                Reviews
              </NavLink>
            </DetailsBtn>
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
