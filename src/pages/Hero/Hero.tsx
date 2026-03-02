import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { HERO } from '@constants/content';
import { Section } from '@components/Section/Section';
import { Title } from '@components/Title/Title';
import { StatusBadge } from './components/StatusBadge';
import { HeroScene } from './components/HeroScene';

export const Hero = () => {
  const { breakpoint, resolve } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);

  const isDesktop = ['sm', 'md', 'lg', 'xl'].includes(breakpoint);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1 }, 0);
      tl.fromTo(
        sceneRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
        0.2
      );
      tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4);
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.8);
      if (traitsRef.current)
        tl.fromTo(
          traitsRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.4)' },
          1
        );
    },
    { scope: sectionRef, dependencies: [breakpoint] }
  );

  return (
    <Section
      id="hero"
      ref={sectionRef}
      style={{ padding: { base: '2rem 0', sm: '7rem 0 2rem', md: '7rem 0 2rem', lg: '5rem 0 3rem' } }}>
      <StatusBadge ref={badgeRef} />

      <div style={resolve(centerStyle)}>
        <div style={resolve(sceneLayerStyle)}>
          <HeroScene ref={sceneRef} />
        </div>

        <div style={resolve(textOverlayStyle)}>
          <Title ref={titleRef} as="h1" style={{ padding: '0 1rem', lineHeight: 0.9 }}>
            {HERO.title}
          </Title>
          <p ref={subtitleRef} style={{ ...resolve(subtitleStyle), opacity: 0 }}>
            {HERO.subtitle}
          </p>
        </div>
      </div>

      {isDesktop && (
        <div ref={traitsRef} style={resolve(traitsRowStyle)}>
          {HERO.traits.map((trait) => (
            <span key={trait} style={{ ...resolve(traitStyle) }}>
              {trait}
            </span>
          ))}
        </div>
      )}
    </Section>
  );
};

const centerStyle: ResponsiveStyles = {
  display: 'grid',
  width: '100%',
  minHeight: 0,
  placeItems: 'center',
  flex: 1
};

const sceneLayerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  gridRow: 1,
  gridColumn: 1
};

const textOverlayStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '1rem',
  zIndex: 1,
  gridRow: 1,
  gridColumn: 1,
  textAlign: 'center',
  textShadow: '2px 2px 16px rgba(0, 0, 0, 0.5)'
};

const subtitleStyle: ResponsiveStyles = {
  color: 'var(--color-white)',
  fontWeight: 500,
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', xs: '0.8rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' },
  letterSpacing: '0.08em',
  lineHeight: 1.6,
  padding: '0 2rem',
  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
};

const traitsRowStyle: ResponsiveStyles = {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-around',
  padding: { base: '0 2rem', md: '0 3rem' }
};

const traitStyle: ResponsiveStyles = {
  color: 'var(--color-light-gray)',
  fontWeight: 500,
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', md: '0.875rem' },
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap'
};
