import { Link, NavLink } from 'react-router-dom';
import { HeaderContainer, HeaderButton } from './Header.styled';
import useToggle from '../../hooks/useToggle/useToggle';

const Header = () => {
  const [isOpen, toggleMenu] = useToggle(false);

  return (
    <HeaderContainer isOpen={isOpen}>
      <div className="header__hero">
        <h1 className="logo">
          <Link to={'./'}>joaquin-godoy</Link>
        </h1>
        <HeaderButton
          className={isOpen ? 'open' : ''}
          type="button"
          onClick={() => toggleMenu()}
        >
          <span className="hamburger-btn__line" />
          <span className="hamburger-btn__line" />
          <span className="hamburger-btn__line" />
        </HeaderButton>
      </div>
      <nav>
        <ul className="navbar">
          <li className="navbar__item">
            <NavLink
              to={'./'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-testid="home-link"
            >
              _home
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to={'./about'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-testid="about-link"
            >
              _about-me
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to={'./skills'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-testid="skills-link"
            >
              _skills
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to={'./projects'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-testid="projects-link"
            >
              _projects
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to={'./contact'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              data-testid="contact-link"
            >
              _contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </HeaderContainer>
  );
};

export default Header;
