import styled from 'styled-components';

export const MainContainer = styled.main`
  width: 100%;
  padding: var(--padding-s);
  margin-top: var(--margin-xxxl);

  @media (min-width: 1024px) {
    padding: var(--padding-l);
    margin-top: 0;
  }
`;
