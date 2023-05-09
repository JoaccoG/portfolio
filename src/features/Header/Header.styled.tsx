import styled from 'styled-components';

export const HeaderButton = styled.button`
  border: 0;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
  .hamburger-btn__line {
    width: 35px;
    height: 3px;
    display: block;
    margin: var(--margin-xxs) 0;
    background-color: var(--color-secondary-white);
    border-radius: var(--border-xs);
    transition: var(--transition-l);
    -o-transition: var(--transition-l);
    -webkit-transition: var(--transition-l);
  }
  &.open .hamburger-btn__line:nth-child(1) {
    transform: translateY(11px) rotate(45deg);
    -o-transform: translateY(11px) rotate(45deg);
    -ms-transform: translateY(11px) rotate(45deg);
    -webkit-transform: translateY(11px) rotate(45deg);
  }
  &.open .hamburger-btn__line:nth-child(2) {
    opacity: 0;
  }
  &.open .hamburger-btn__line:nth-child(3) {
    transform: translateY(-11px) rotate(-45deg);
    -o-transform: translateY(-11px) rotate(-45deg);
    -ms-transform: translateY(-11px) rotate(-45deg);
    -webkit-transform: translateY(-11px) rotate(-45deg);
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

interface HeaderContainerProps {
  isOpen: boolean;
}

export const HeaderContainer = styled.header<HeaderContainerProps>`
  width: 100%;
  .header__hero {
    width: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--padding-xxs) var(--padding-s);
    background-color: var(--color-primary-regular);
    border-bottom: 1px solid var(--color-primary-light);
    .logo {
      font-size: var(--font-size-m);
    }
  }
  nav {
    width: 100%;
    .navbar {
      width: 100%;
      position: fixed;
      z-index: 95;
      ${({ isOpen }: HeaderContainerProps) =>
        isOpen ? `top: 0;` : `top: -100%;`}
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 58px;
      transition: var(--transition-xl);
      background-color: rgba(0, 0, 0, 0.8);
      @supports ((backdrop-filter: none) or (-webkit-backdrop-filter: none;)) {
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      border-bottom: 1px solid var(--color-primary-light);
      .navbar__item {
        a {
          width: 100%;
          display: block;
          padding: var(--padding-s);
        }
      }
    }
  }
`;
