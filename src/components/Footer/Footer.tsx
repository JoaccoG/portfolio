import { useState } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { FOOTER } from '@constants/content';
import { SvgIcon } from '@components/icons';

export const Footer = () => {
  const { resolve } = useBreakpoint();

  return (
    <footer style={resolve(footerStyle)}>
      <div style={resolve(socialLinksStyle)}>
        {FOOTER.socialLinks.map((link) => (
          <SocialLink key={link.icon} icon={link.icon} url={link.url} />
        ))}
      </div>
      <p style={resolve(copyrightStyle)}>{FOOTER.copyright}</p>
    </footer>
  );
};

interface SocialLinkProps {
  icon: string;
  url: string;
}

const SocialLink = ({ icon, url }: SocialLinkProps) => {
  const { resolve } = useBreakpoint();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...resolve(socialLinkStyle),
        color: isHovered ? 'var(--color-primary)' : '#3d3d3d'
      }}>
      <SvgIcon icon={icon} />
    </a>
  );
};

const footerStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '2rem',
  color: 'var(--color-white)'
};

const copyrightStyle: ResponsiveStyles = {
  color: 'var(--color-light-gray)',
  fontSize: '0.875rem',
  fontWeight: 400,
  textAlign: 'center'
};

const socialLinksStyle: ResponsiveStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem'
};

const socialLinkStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.3s ease'
};
