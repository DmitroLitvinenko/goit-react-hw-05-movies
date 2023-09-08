import { Link } from 'react-router-dom';

const { styled } = require('styled-components');

export const Container = styled.div`
  display: flex;
  gap: 30px;
`;

export const Button = styled(Link)`
  display: flex;
  text-decoration: none;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 25px;
  margin-top: 15px;
  margin-bottom: 30px;
`;

export const DetailsBtn = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  a {
    text-decoration: none;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 25px;
  }
`;
