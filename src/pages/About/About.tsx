import { useRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { ABOUT_CHAPTERS } from '@constants/content';
import { Section } from '@components/Section/Section';
import { Title } from '@components/Title/Title';
import { useAboutAnimation } from './hooks/useAboutAnimation';
import { AboutChapter } from './components/AboutChapter';

export const About = () => {
  const { resolve } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastChapterRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useAboutAnimation({ sectionRef, titleRef, windowRef, innerRef, lastChapterRef, chapterRefs });

  const lastIdx = ABOUT_CHAPTERS.length - 1;

  return (
    <Section ref={sectionRef} id="about" style={aboutSectionStyle}>
      <Title ref={titleRef} as="h2" style={titleStyle}>
        ABOUT ME
      </Title>
      <div ref={windowRef} style={resolve(windowStyle)}>
        <div ref={innerRef} style={resolve(innerStyle)}>
          {ABOUT_CHAPTERS.map((chapter, idx) => (
            <AboutChapter
              key={chapter.number}
              ref={(el) => {
                chapterRefs.current[idx] = el;
                if (idx === lastIdx) lastChapterRef.current = el;
              }}
              number={chapter.number}
              title={chapter.title}
              paragraphs={chapter.paragraphs}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

const aboutSectionStyle: ResponsiveStyles = {
  position: 'relative',
  height: { base: 'auto', md: '100vh' },
  minHeight: { base: 'auto', md: '100vh' },
  overflow: 'visible',
  justifyContent: 'flex-start',
  padding: { base: '4rem 1.5rem', xs: '4rem 2rem', md: '0' },
  gap: { base: '3rem', md: '0' }
};

const titleStyle: ResponsiveStyles = {
  width: 'max-content',
  position: { base: 'relative', md: 'absolute' },
  left: { base: 'auto', md: '50%' },
  top: { base: 'auto', md: '50%' },
  lineHeight: 1,
  zIndex: 10
};

const windowStyle: ResponsiveStyles = {
  position: { base: 'relative', md: 'absolute' },
  right: { base: 'auto', md: '3rem' },
  top: { base: 'auto', md: '0' },
  width: { base: '100%', md: '50%', lg: '40%' },
  height: { base: 'auto', md: '100%' },
  zIndex: 2
};

const innerStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: { base: '3rem', md: '4rem' },
  paddingRight: { base: '0', md: '2.5rem' }
};
