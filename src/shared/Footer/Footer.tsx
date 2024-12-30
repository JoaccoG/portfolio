import Image from 'next/image';
import { getDate } from '@/utils';

const Footer = () => {
  return (
    <footer>
      <nav aria-label="Social links">
        <ul>
          <li>
            <a href="https://www.linkedin.com/in/joaquin--godoy/" target="_blank" rel="noopener noreferrer">
              <Image src="/images/footer/icon-linkedin.svg" alt="LinkedIn icon" width={16} height={16} />
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/JoaccoG" target="_blank" rel="noopener noreferrer">
              <Image src="/images/footer/icon-github.svg" alt="GitHub icon" width={16} height={16} />
              GitHub
            </a>
          </li>
        </ul>
      </nav>
      <address>
        <small>Made by Joaquín Godoy &copy; {getDate().year} - All rights reserved.</small>
      </address>
    </footer>
  );
};

export default Footer;
