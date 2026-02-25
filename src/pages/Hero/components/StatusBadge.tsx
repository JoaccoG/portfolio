import { useState, useEffect, forwardRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { HERO } from '@constants/content';

export const StatusBadge = forwardRef<HTMLDivElement>((_, ref) => {
  const { resolve } = useBreakpoint();
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime(new Date())), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} style={resolve(badgeContainerStyle)}>
      <div style={resolve(badgeStyle)}>
        <span style={resolve(dotStyle)} />
        <span style={resolve(statusTextStyle)}>{HERO.status}</span>
        <span style={resolve(separatorStyle)}>|</span>
        <span style={resolve(clockStyle)}>{time}</span>
      </div>
    </div>
  );
});

const formatTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const badgeContainerStyle: ResponsiveStyles = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  opacity: 0
};

const badgeStyle: ResponsiveStyles = {
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: { base: '0.4rem 0.8rem', sm: '0.5rem 1rem' },
  border: '1px solid rgba(242, 235, 227, 0.1)',
  borderRadius: '256px',
  background: 'rgba(242, 235, 227, 0.03)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)'
};

const dotStyle: ResponsiveStyles = {
  width: '6px',
  height: '6px',
  marginBottom: '1px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-success)',
  animation: 'statusPulse 2s ease-in-out infinite',
  flexShrink: 0
};

const statusTextStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.65rem', sm: '0.75rem' },
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-success)'
};

const separatorStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'rgba(242, 235, 227, 0.2)'
};

const clockStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.65rem', sm: '0.75rem' },
  letterSpacing: '0.15em',
  color: 'rgba(242, 235, 227, 0.5)'
};
