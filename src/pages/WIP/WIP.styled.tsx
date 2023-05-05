import styled from 'styled-components';

export const MainContainer = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: var(--padding-s);
  background: url('/assets/img/bg-blurs.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
  background-attachment: fixed;

  @media screen and (min-width: 768px) {
    padding: var(--padding-l);
  }
`;

export const WIPContainer = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .wip__title {
    padding: var(--padding-xxxl) 0 0;
    span {
      color: var(--color-accent-pink);
      font-size: var(--font-size-xs);
    }
    h1 {
      color: var(--color-secondary-white);
      font-size: var(--font-size-xl);
      font-weight: 400;
      padding: var(--padding-xs) 0;
    }
    h2 {
      color: var(--color-accent-teal);
      font-size: var(--font-size-m);
      font-weight: 400;
    }
  }
  .wip__link {
    padding: var(--padding-xxl) 0;
    p {
      color: var(--color-secondary-white);
      font-size: var(--font-size-xs);
      .snippet__declaration {
        color: var(--color-secondary-blue);
      }
      .snippet__name {
        color: var(--color-secondary-cyan);
      }
      .snippet__code {
        color: var(--color-accent-orange);
        .snippet__code--link {
          color: var(--color-accent-pink);
          text-decoration: underline;
        }
      }
    }
  }
  .wip__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: var(--padding-s);
    .wip-content__text {
      width: 100%;
    }
    .wip-content__img {
      width: 100%;
      display: flex;
      justify-content: center;
      img {
        width: 100%;
        min-width: 250px;
        max-width: 500px;
      }
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 var(--padding-s);
    .wip__title {
      span {
        font-size: var(--font-size-s);
      }
      h1 {
        font-size: var(--font-size-xxl);
      }
      h2 {
        font-size: var(--font-size-l);
      }
    }
  }

  @media screen and (min-width: 768px) {
    padding: 0 var(--padding-xxxl);
    .wip__title {
      span {
        font-size: var(--font-size-m);
      }
      h1 {
        font-size: var(--font-size-xxxl);
      }
      h2 {
        font-size: var(--font-size-xl);
      }
    }
  }

  @media screen and (min-width: 1024px) {
    .wip__content {
      flex-direction: row;
    }
  }
`;
