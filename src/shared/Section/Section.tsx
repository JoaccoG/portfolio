import { forwardRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';

interface SectionProps {
  children: React.ReactNode;
  style?: ResponsiveStyles;
  id?: string;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(({ children, id, style }, ref) => {
  const { resolve } = useBreakpoint();

  return (
    <section id={id} ref={ref} style={resolve({ ...sectionStyle, ...style })}>
      {children}
    </section>
  );
});

const sectionStyle: ResponsiveStyles = {
  width: '100%',
  maxWidth: '1400px',
  height: '100dvh',
  minHeight: '100dvh',
  gap: { base: '2rem', md: '0' },
  margin: '0 auto',
  padding: { base: '2rem 0', sm: '3rem 0', md: '7rem 3rem 2.5rem', lg: '4.5rem 4rem 3rem' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden'
};
