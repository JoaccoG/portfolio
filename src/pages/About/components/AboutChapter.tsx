import { forwardRef, type ReactNode } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';

interface AboutChapterProps {
  number: string;
  title: string;
  paragraphs: ReactNode[];
}

export const AboutChapter = forwardRef<HTMLDivElement, AboutChapterProps>(({ number, title, paragraphs }, ref) => {
  const { resolve } = useBreakpoint();

  return (
    <div ref={ref} style={resolve(chapterStyle)}>
      <span data-animate style={resolve(labelStyle)}>
        CHAPTER.{number}
      </span>
      <h3 data-animate style={resolve(titleStyle)}>
        {title}
      </h3>
      <div style={resolve(paragraphsStyle)}>
        {paragraphs.map((paragraph, i) => (
          <p key={i} data-animate style={resolve(paragraphStyle)}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
});

const chapterStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const labelStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.875rem',
  letterSpacing: '0.15em',
  color: 'var(--color-primary)',
  textTransform: 'uppercase',
  margin: 0
};

const titleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-display)',
  fontSize: { base: '1.75rem', xs: '2.25rem', md: '2.5rem', lg: '3.5rem' },
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  lineHeight: 1,
  margin: 0,
  zIndex: 5
};

const paragraphsStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  zIndex: 5
};

const paragraphStyle: ResponsiveStyles = {
  fontSize: { base: '1rem', md: '1.1rem', lg: '1.2rem' },
  lineHeight: 1.8,
  color: 'var(--color-light-gray)',
  margin: 0,
  zIndex: 5
};
