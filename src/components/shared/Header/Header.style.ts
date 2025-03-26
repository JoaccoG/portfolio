import styled from 'styled-components';
import { NavLink } from 'react-router';

export const HeaderOverlay = styled.div<{ $isNavOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: var(--z-index-400);
  pointer-events: ${({ $isNavOpen }): string => ($isNavOpen ? 'auto' : 'none')};
  background: rgba(0, 0, 0, 0.8);
  transition:
    background var(--transition-fast) ease-in-out,
    backdrop-filter var(--transition-fast) ease-in-out;

  @supports ((backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))) {
    background: transparent;
    backdrop-filter: ${({ $isNavOpen }): string => ($isNavOpen ? 'blur(4px)' : 'none')};
    -webkit-backdrop-filter: ${({ $isNavOpen }): string => ($isNavOpen ? 'blur(4px)' : 'none')};
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const HeaderContainer = styled.header<{ $isNavOpen: boolean; $isHeaderVisible: boolean; $hasScrolled: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 64px;
  width: 100%;
  padding: var(--padding-s) var(--padding-l);
  background: rgba(0, 0, 0, 0.5);
  transform: ${({ $isHeaderVisible }): string => ($isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)')};
  transition: transform var(--transition-medium) ease-in-out;
  z-index: var(--z-index-500);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100%;
    height: 1px;
    background: var(--color-neutral-dark-gray);
    transform-origin: center;
    transition:
      opacity var(--transition-fastest) ease-in-out,
      transform var(--transition-medium) ease-in-out;
    opacity: ${({ $isNavOpen }): number => ($isNavOpen ? 0 : 1)};
    transform: translateX(-50%) scaleX(${({ $hasScrolled }): number => ($hasScrolled ? 1 : 0)});
  }

  .header-container {
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  @supports ((backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))) {
    background: transparent;
    backdrop-filter: ${({ $hasScrolled }): string => ($hasScrolled ? 'blur(4px)' : 'none')};
    -webkit-backdrop-filter: ${({ $hasScrolled }): string => ($hasScrolled ? 'blur(4px)' : 'none')};
  }

  @media (min-width: 768px) {
    height: 80px;
  }
`;

export const Logo = styled.div`
  cursor: pointer;
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-fira-code);

  a {
    background: linear-gradient(to right, #ff8a65, #c62828 33.33334%, #c62828 66.66667%, #ff8a65);
    background-size: 300% 100%;
    background-position: top left;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all var(--transition-medium) ease-in-out;

    &:hover {
      background-position: top left 100%;
    }
  }

  @media (min-width: 480px) {
    font-size: var(--font-size-xl);
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

export const NavMenu = styled.div<{ $isNavOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 50%;
  min-width: 240px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: -1rem -2rem;
  padding: var(--padding-l) var(--padding-xxxl);
  background: var(--color-background);
  border-left: var(--color-neutral-dark-gray) 1px solid;
  transform: ${({ $isNavOpen }): string => ($isNavOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition:
    transform var(--transition-fast) ease-in-out,
    box-shadow var(--transition-faster) ease-in-out;

  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 0;

    li {
      margin: var(--margin-s) 0;
    }
  }

  @media (min-width: 768px) {
    position: sticky;
    height: auto;
    width: auto;
    flex-direction: row;
    align-items: center;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    transform: translateX(0);

    ul {
      flex-direction: row;
      align-items: center;
      gap: var(--margin-l);

      li {
        margin: 0;
      }
    }
  }
`;

export const NavItem = styled(NavLink)`
  position: relative;
  display: inline-block;
  color: var(--color-neutral-light-gray);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-medium);
  padding: 4px 4px 4px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-neutral-dark-gray);
    transition: width var(--transition-faster) ease-in-out;
  }

  &:hover::after {
    width: 100%;
  }

  &.active {
    color: var(--color-neutral-white);

    &::after {
      width: 100%;
      background-color: var(--color-neutral-light-gray);
    }

    span {
      color: var(--color-accent-red);
    }
  }

  span {
    color: var(--color-accent-red);
    font-size: var(--font-size-xs);
    font-family: var(--font-family-fira-code);
  }
`;

export const HamburgerButton = styled.button<{ $isNavOpen: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 32px;
  cursor: pointer;
  border: none;
  background: none;
  z-index: var(--z-index-500);

  span {
    display: block;
    height: 3px;
    width: 100%;
    background: var(--color-neutral-white);
    border-radius: var(--border-radius-xs);
    transition:
      transform var(--transition-medium) ease,
      opacity var(--transition-fast) ease-in-out;

    &:nth-child(1) {
      transform: ${({ $isNavOpen }): string => ($isNavOpen ? 'rotate(45deg) translate(10px, 5px)' : 'rotate(0)')};
    }

    &:nth-child(2) {
      opacity: ${({ $isNavOpen }): string => ($isNavOpen ? '0' : '1')};
      transform: ${({ $isNavOpen }): string => ($isNavOpen ? 'translateX(48px)' : 'translateX(0)')};
    }

    &:nth-child(3) {
      transform: ${({ $isNavOpen }): string => ($isNavOpen ? 'rotate(-45deg) translate(10px, -5px)' : 'rotate(0)')};
    }
  }

  @media (min-width: 768px) {
    display: none;
  }
`;
