import styled from 'styled-components';

export const MainContainer = styled.main`
  width: 100%;
  padding: var(--padding-s);
  margin: var(--margin-xxxl) 0 var(--margin-xxl) 0;

  @media (min-width: 1024px) {
    padding: var(--padding-l);
    margin: 0 0 var(--margin-xxl) 0;
  }
`;
