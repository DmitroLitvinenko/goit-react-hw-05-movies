import apiService from 'api/api';
import { Status } from 'api/status';
import { ErrorComponent } from 'components/Error/Error';
import LoaderComponent from 'components/Loader/Loader';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Cast = () => {
  const { movieId } = useParams();
  const [actors, setActors] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);

  useEffect(() => {
    apiService
      .getCastInfo(movieId)
      .then(cast => {
        if (cast.length === 0) {
          setStatus(Status.IDLE);
          return;
        }
        setActors(cast);
        setStatus(Status.RESOLVED);
      })

      .catch(ErrorComponent => {
        console.log(ErrorComponent);
        setError(ErrorComponent);
        setStatus(Status.REJECTED);
      });
  }, [movieId, error]);

  return (
    <>
      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent />}

      {status === Status.RESOLVED && (
        <ul>
          {actors.map(actor => (
            <li key={actor.id}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                    : 'noPhoto'
                }
                alt={actor.original_name}
              />
              <h4>{actor.original_name}</h4>
              <p>{actor.character}</p>
            </li>
          ))}
        </ul>
      )}
      {status === Status.IDLE && (
        <p>
          <i> We don't have any cast for this movie.</i>
        </p>
      )}
    </>
  );
};

export default Cast;
