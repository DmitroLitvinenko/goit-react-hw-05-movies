import { Container } from 'components/Header/Header.styled';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <Container>
      <NavLink to="/">Home</NavLink>

      <NavLink to="/movies">Movies</NavLink>
    </Container>
  );
}
