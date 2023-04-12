import styled from 'styled-components';

export const MainContainer = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: var(--padding-xxxl) var(--padding-s);
  background: url('/assets/img/bg-blurs.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;

  @media screen and (min-width: 524px) {
    padding: var(--padding-xxxl) var(--padding-xl);
  }

  @media screen and (min-width: 768px) {
    padding: var(--padding-l);
  }
`;

export const WIPContainer = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .wip__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .wip-content__title {
      display: flex;
      flex-direction: column;
      gap: var(--padding-xxs) 0;
      justify-content: flex-start;
      padding: var(--padding-xxxl) 0;
      span {
        color: var(--color-accent-pink);
        font-size: var(--font-size-s);
        font-weight: 300;
      }
      h1 {
        font-size: var(--font-size-xxl);
        font-weight: 400;
      }
      h2 {
        color: var(--color-accent-teal);
        font-size: var(--font-size-l);
        font-weight: 400;
      }
    }
    .wip-content__text {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: var(--padding-s) 0;
      p {
        color: var(--color-secondary-gray);
        font-size: var(--font-size-xs);
        font-weight: 300;
      }
      .wip-content__text--github {
        color: var(--color-secondary-white);
        margin: var(--margin-xl) 0 var(--margin-xxxl);
        text-align: center;
      }
    }
  }
  .wip__img {
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      max-width: 564px;
    }
  }

  @media screen and (min-width: 524px) {
    .wip__content {
      .wip-content__title {
        padding: var(--padding-xxxl) 0;
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
      .wip-content__text {
        p {
          font-size: var(--font-size-m);
        }
      }
    }
  }

  @media screen and (max-width: 374px) {
    .wip__content {
      .wip-content__title {
        span {
          font-size: var(--font-size-xxs);
        }
        h1 {
          font-size: var(--font-size-xl);
        }
        h2 {
          font-size: var(--font-size-m);
        }
      }
      .wip-content__text {
        p {
          font-size: var(--font-size-xxs);
        }
      }
    }
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    .wip__content {
      .wip-content__text {
        .wip-content__text--github {
          margin: 0;
          text-align: start;
        }
      }
    }
    .wip__img {
      width: 60%;
    }
  }
`;
