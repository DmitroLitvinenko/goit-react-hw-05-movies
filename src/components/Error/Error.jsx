import PropTypes from 'prop-types';

export const ErrorComponent = ({ message }) => {
  return (
    <div role="alert" className="wrapper">
      <p text={message} className="text">
        {message}
      </p>
    </div>
  );
};

ErrorComponent.propTypes = {
  textError: PropTypes.string.isRequired,
};
