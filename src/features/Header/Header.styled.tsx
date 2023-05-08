import styled from 'styled-components';

export const HeaderButton = styled.button`
  position: fixed;
  z-index: 999;
  top: var(--margin-xxs);
  right: var(--margin-s);
  border: 0;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
  .hamburger-btn__line {
    width: 55px;
    height: 6px;
    display: block;
    margin: var(--margin-xs) 0;
    background-color: var(--color-primary);
    border-radius: var(--border-xs);
    transition: var(--transition-long);
    -o-transition: var(--transition-long);
    -webkit-transition: var(--transition-long);
  }
  &.open .hamburger-btn__line:nth-child(1) {
    transform: translateY(18px) rotate(45deg);
    -o-transform: translateY(18px) rotate(45deg);
    -ms-transform: translateY(18px) rotate(45deg);
    -webkit-transform: translateY(18px) rotate(45deg);
  }
  &.open .hamburger-btn__line:nth-child(2) {
    opacity: 0;
  }
  &.open .hamburger-btn__line:nth-child(3) {
    transform: translateY(-18px) rotate(-45deg);
    -o-transform: translateY(-18px) rotate(-45deg);
    -ms-transform: translateY(-18px) rotate(-45deg);
    -webkit-transform: translateY(-18px) rotate(-45deg);
  }

  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

export const HeaderContainer = styled.header`
  border: 1px solid red;
  width: 100%;
  padding: var(--padding-s);
  .logo {
    font-size: var(--font-size-l);
  }
  .navbar {
    display: none;
  }
`;
