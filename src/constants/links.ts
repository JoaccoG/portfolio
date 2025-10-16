import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaSpotify } from 'react-icons/fa';

export interface SocialLink {
  label: string;
  icon: IconType;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', icon: FaGithub, href: 'https://github.com/JoaccoG' },
  { label: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/joaquin--godoy/' },
  {
    label: 'Spotify',
    icon: FaSpotify,
    href: 'https://open.spotify.com/user/31ar645vn4nkna54jly27vcviviy?si=fb87792c1bc746e1'
  },
  { label: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/joacogodoy99' },
  { label: 'Email', icon: FaEnvelope, href: 'mailto:joaquingodoy2407@gmail.com' }
];
