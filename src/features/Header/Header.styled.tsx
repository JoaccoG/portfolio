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
    width: 45px;
    height: 5px;
    display: block;
    margin: var(--margin-xxs) 0;
    background-color: var(--color-secondary-white);
    border-radius: var(--border-xs);
    transition: var(--transition-l);
    -o-transition: var(--transition-l);
    -webkit-transition: var(--transition-l);
  }
  &.open .hamburger-btn__line:nth-child(1) {
    transform: translateY(13px) rotate(45deg);
    -o-transform: translateY(13px) rotate(45deg);
    -ms-transform: translateY(13px) rotate(45deg);
    -webkit-transform: translateY(13px) rotate(45deg);
  }
  &.open .hamburger-btn__line:nth-child(2) {
    opacity: 0;
  }
  &.open .hamburger-btn__line:nth-child(3) {
    transform: translateY(-13px) rotate(-45deg);
    -o-transform: translateY(-13px) rotate(-45deg);
    -ms-transform: translateY(-13px) rotate(-45deg);
    -webkit-transform: translateY(-13px) rotate(-45deg);
  }

  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

interface HeaderContainerProps {
  isOpen: boolean;
}

export const HeaderContainer = styled.header<HeaderContainerProps>`
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
