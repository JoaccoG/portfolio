import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { HeaderOverlay, HeaderContainer, Logo, Nav, NavMenu, NavItem, HamburgerButton } from './Header.style';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const handleNavMenu = (newState: boolean): void => {
    setIsNavOpen(newState);
    if (!newState) document.body.style.overflow = '';
    else document.body.style.overflow = 'hidden';
  };

  useEffect((): void => {
    setLastScrollY(window.scrollY);
    setHasScrolled(window.scrollY >= 16);
  }, []);

  useEffect((): VoidFunction => {
    const handleScroll = (): void => {
      const currentScrollY: number = window.scrollY;
      setLastScrollY(currentScrollY);
      setHasScrolled(currentScrollY >= 16);
      if (currentScrollY > lastScrollY && currentScrollY > 80) setIsHeaderVisible(false);
      else setIsHeaderVisible(true);
    };

    window.addEventListener('scroll', handleScroll);

    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {isNavOpen && (
        <HeaderOverlay data-testid="header-overlay" $isNavOpen={isNavOpen} onClick={(): void => handleNavMenu(false)} />
      )}
      <HeaderContainer $isNavOpen={isNavOpen} $isHeaderVisible={isHeaderVisible} $hasScrolled={hasScrolled}>
        <div className="header-container">
          <Logo aria-label="Logo">
            <NavLink to="/" rel="noopener noreferrer" data-testid="Logo" onClick={(): void => handleNavMenu(false)}>
              Joaquín Godoy
            </NavLink>
          </Logo>
          <Nav aria-label="Navigation menu">
            <HamburgerButton
              aria-label="Toggle navigation menu"
              $isNavOpen={isNavOpen}
              onClick={(): void => handleNavMenu(!isNavOpen)}>
              <span />
              <span />
              <span />
            </HamburgerButton>
            <NavMenu $isNavOpen={isNavOpen}>
              <ul>
                <li>
                  <NavItem
                    to="/"
                    rel="noopener noreferrer"
                    aria-label="Home"
                    data-testid="Home"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={(): void => handleNavMenu(false)}>
                    <span>01.</span> Home
                  </NavItem>
                </li>
                <li>
                  <NavItem
                    to="/about"
                    rel="noopener noreferrer"
                    aria-label="About"
                    data-testid="About"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={(): void => handleNavMenu(false)}>
                    <span>02.</span> About
                  </NavItem>
                </li>
                <li>
                  <NavItem
                    to="/work"
                    rel="noopener noreferrer"
                    aria-label="Work"
                    data-testid="Work"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={(): void => handleNavMenu(false)}>
                    <span>03.</span> Work
                  </NavItem>
                </li>
                <li>
                  <NavItem
                    to="/blog"
                    rel="noopener noreferrer"
                    aria-label="Blog"
                    data-testid="Blog"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={(): void => handleNavMenu(false)}>
                    <span>04.</span> Blog
                  </NavItem>
                </li>
              </ul>
            </NavMenu>
          </Nav>
        </div>
      </HeaderContainer>
    </>
  );
};

export default Header;
