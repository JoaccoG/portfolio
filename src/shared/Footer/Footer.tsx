import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FooterContainer } from './Footer.styled';

const Footer = () => {
  return (
    <FooterContainer>
      <h1 className="footer__title">find-me-in:</h1>
      <ul className="footer__list">
        <li className="footer-list__item">
          <a
            className="footer-list__item--link"
            href="https://github.com/JoaccoG"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={brands('github')} />
          </a>
        </li>
        <li className="footer-list__item">
          <a
            className="footer-list__item--link"
            href="https://www.linkedin.com/in/joaquin--godoy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={brands('linkedin-in')} />
          </a>
        </li>
        <li className="footer-list__item">
          <a
            className="footer-list__item--link"
            href="https://www.instagram.com/joaccog99/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={brands('instagram')} />
          </a>
        </li>
      </ul>
    </FooterContainer>
  );
};

export default Footer;
