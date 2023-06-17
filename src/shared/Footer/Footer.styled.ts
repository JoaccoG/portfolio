import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  height: 35px;
  z-index: 91;
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary-regular);
  border-top: 1px solid var(--color-primary-light);
  .footer__title {
    margin-left: var(--margin-s);
    font-size: var(--font-size-s);
  }
  .footer__list {
    display: flex;
    justify-content: center;
    align-items: center;
    .footer-list__item {
      .footer-list__item--link {
        padding: calc(var(--padding-xs) - var(--padding-xxs)) var(--padding-m);
        border-left: 1px solid var(--color-primary-light);
        font-size: var(--font-size-m);
        color: var(--color-secondary-gray);
        transition: var(--transition-s);
        &:hover {
          color: var(--color-secondary-white);
        }
      }
    }
  }

  @media screen and (max-width: 375px) {
    .footer__list {
      .footer-list__item {
        .footer-list__item--link {
          padding: calc(var(--padding-xs) - var(--padding-xxs)) var(--padding-s);
        }
      }
    }
  }
`;
