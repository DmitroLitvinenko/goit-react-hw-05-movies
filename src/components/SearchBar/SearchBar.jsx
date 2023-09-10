import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Form } from './SearchBar.styled';

export const SearchBar = ({ onHandleSubmit }) => {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const movieTitle = searchParams.get('name') || '';

  useEffect(() => {
    setQuery(movieTitle);
  }, [movieTitle]);

  const updateQueryString = name => {
    setSearchParams({ name });
    navigate(`${location.pathname}?name=${name}`);
  };

  const handleSubmit = event => {
    event.preventDefault();

    onHandleSubmit(query);
    updateQueryString(query);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        placeholder="Enter movie name..."
        onChange={e => setQuery(e.target.value.toLowerCase())}
      />
      <button type="submit">Search</button>
    </Form>
  );
};

SearchBar.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
};
