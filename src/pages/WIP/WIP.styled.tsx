import styled from 'styled-components';

export const WIPContainer = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin: var(--margin-s) 0;
  }
  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;
