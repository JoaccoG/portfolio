import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { PROJECTS_CATEGORIES } from '@constants/content';
import { Section } from '@components/Section/Section';
import { Title } from '@components/Title/Title';
import { Tape } from '@components/Tape/Tape';
import { SpotlightText } from '@components/SpotlightText/SpotlightText';

export const Projects = () => {
  const { resolve } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } }
      );

      gsap.fromTo(
        spotlightRef.current,
        { opacity: 0 },
        { opacity: 1, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 50%', scrub: true } }
      );
    },
    { scope: sectionRef }
  );

  return (
    <Section ref={sectionRef} id="projects" style={projectsSectionStyle}>
      <Title ref={titleRef} as="h2">
        PROJECTS
      </Title>

      <div style={resolve(gridStyle)}>
        <div ref={spotlightRef} style={spotlightCellStyle}>
          <SpotlightText lines={PROJECTS_CATEGORIES} />
        </div>

        <div style={resolve(tapeCellStyle)}>
          <Tape direction="right" angle={-5} speed={0} />
        </div>
      </div>
    </Section>
  );
};

const projectsSectionStyle: ResponsiveStyles = {
  height: 'auto',
  minHeight: { base: 'auto', md: '100dvh' },
  justifyContent: 'center',
  padding: { base: '4rem 0', xs: '4rem 0', md: '0' },
  gap: '3rem',
  overflow: 'visible'
};

const gridStyle: ResponsiveStyles = {
  width: '100%',
  maxHeight: '700px',
  display: 'grid',
  flex: { base: 'none', md: '1' },
  alignItems: 'center'
};

const spotlightCellStyle: React.CSSProperties = {
  gridRow: 1,
  gridColumn: 1
};

const tapeCellStyle: ResponsiveStyles = {
  width: '100vw',
  height: '100%',
  overflow: 'hidden',
  marginLeft: 'calc(-50vw + 50%)',
  gridRow: 1,
  gridColumn: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 5
};
