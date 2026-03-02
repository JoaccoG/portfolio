import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { NAV_ITEMS } from '@constants/content';
import { BlogUnderline } from '@components/icons/BlogUnderline';

interface HeaderProps {
  scrollTo: (target: string) => void;
}

export const Header = ({ scrollTo }: HeaderProps) => {
  const { breakpoint, resolve } = useBreakpoint();
  const headerRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const blogLinkRef = useRef<HTMLAnchorElement>(null);
  const underlineRef = useRef<SVGSVGElement>(null);

  const hasScrollShrink = ['sm', 'md', 'lg', 'xl'].includes(breakpoint);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      const allLinks = headerRef.current.querySelectorAll('[data-header-link]');
      const underlinePath = underlineRef.current?.querySelector('path');

      const tl = gsap.timeline();

      if (allLinks.length > 0) {
        tl.fromTo(
          allLinks,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, delay: 0.3, ease: 'power3.out' }
        );
      }

      if (underlinePath && underlineRef.current) {
        const length = underlinePath.getTotalLength() + 4;
        gsap.set(underlinePath, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(underlineRef.current, { opacity: 1 });
        tl.to(underlinePath, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.4');
      }

      if (hasScrollShrink) {
        gsap
          .timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=200', scrub: true } })
          .to(
            headerRef.current,
            { padding: resolve(HEADER_SIZING.padding.compact, HEADER_SIZING.padding.compact.base), ease: 'none' },
            0
          )
          .to(
            navLinksRef.current,
            { gap: resolve(HEADER_SIZING.gap.compact, HEADER_SIZING.gap.compact.base), ease: 'none' },
            0
          )
          .to(
            allLinks,
            { fontSize: resolve(HEADER_SIZING.fontSize.compact, HEADER_SIZING.fontSize.compact.base), ease: 'none' },
            0
          );
      }
    },
    { scope: headerRef, dependencies: [breakpoint, hasScrollShrink] }
  );

  return (
    <header ref={headerRef} style={{ ...resolve(headerStyle), position: hasScrollShrink ? 'fixed' : 'relative' }}>
      <nav style={{ ...resolve(navStyle) }}>
        <div
          ref={navLinksRef}
          style={{ ...resolve(navLinksContainerStyle), display: hasScrollShrink ? 'flex' : 'none' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.target} href={`#${item.target}`} label={item.label} scrollTo={scrollTo} />
          ))}
        </div>
        <NavLink ref={blogLinkRef} href="/blog" label="BLOG" underlineRef={underlineRef} />
      </nav>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  scrollTo?: (target: string) => void;
  underlineRef?: React.RefObject<SVGSVGElement | null>;
}

const NavLink = ({
  ref,
  href,
  label,
  scrollTo,
  underlineRef
}: NavLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { resolve } = useBreakpoint();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#') && scrollTo) {
      e.preventDefault();
      scrollTo(href.slice(1));
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      data-header-link
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...resolve(navLinksStyle),
        color: isHovered ? 'var(--color-primary)' : 'var(--color-white)',
        position: underlineRef ? 'relative' : undefined
      }}>
      {label}
      {underlineRef && <BlogUnderline ref={underlineRef} style={{ ...resolve(underlineSvgStyle) }} />}
    </a>
  );
};

const HEADER_SIZING = {
  padding: {
    expanded: { base: '1.5rem 2rem 0', sm: '2.5rem 3.5rem 0' },
    compact: { base: '1.5rem 2rem 0', sm: '2rem 3rem 0' }
  },
  gap: {
    expanded: { base: '1.5rem', sm: '2.5rem', lg: '3rem' },
    compact: { base: '1.5rem', sm: '2rem', lg: '2.5rem' }
  },
  fontSize: {
    expanded: { base: '1.5rem', sm: '1.375rem', md: '1.5rem', lg: '1.625rem', xl: '1.75rem' },
    compact: { base: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem', xl: '1.5rem' }
  }
} as const;

const headerStyle: ResponsiveStyles = {
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
  mixBlendMode: 'difference',
  padding: HEADER_SIZING.padding.expanded
};

const navStyle: ResponsiveStyles = {
  display: 'flex',
  justifyContent: { base: 'flex-end', sm: 'space-between' },
  alignItems: 'center'
};

const navLinksContainerStyle: ResponsiveStyles = {
  gap: HEADER_SIZING.gap.expanded
};

const navLinksStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  transition: 'color 0.3s ease',
  opacity: 0,
  cursor: 'pointer',
  textDecoration: 'none',
  fontSize: HEADER_SIZING.fontSize.expanded
};

const underlineSvgStyle: ResponsiveStyles = {
  width: '150%',
  position: 'absolute',
  bottom: '-6px',
  left: '-24px',
  color: 'var(--color-primary)',
  transition: 'color 0.3s ease',
  pointerEvents: 'none',
  overflow: 'visible',
  opacity: 0
};
