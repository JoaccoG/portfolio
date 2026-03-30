import { forwardRef } from 'react';
import { useBreakpoint, type ResponsiveStyles, type ResponsiveValue } from '@hooks/useBreakpoint';

const DEFAULTS = {
  text: 'COMING SOON',
  angle: { base: 0 },
  speed: { base: 50, md: 75, xl: 100 },
  direction: 'right',
  repetitions: 30
} as const;

interface TapeProps {
  text?: string;
  angle?: number | ResponsiveValue<number>;
  speed?: number | ResponsiveValue<number>;
  direction?: 'left' | 'right';
  repetitions?: number;
}

export const Tape = forwardRef<HTMLDivElement, TapeProps>(
  (
    {
      text = DEFAULTS.text,
      angle = DEFAULTS.angle,
      speed = DEFAULTS.speed,
      direction = DEFAULTS.direction,
      repetitions = DEFAULTS.repetitions
    },
    ref
  ) => {
    const { resolve } = useBreakpoint();

    const rotation = typeof angle === 'number' ? angle : resolve(angle, DEFAULTS.angle.base);
    const duration = typeof speed === 'number' ? speed : resolve(speed, DEFAULTS.speed.base);
    const animationName = direction === 'left' ? 'tapeMarqueeLeft' : 'tapeMarqueeRight';
    const isAnimated = duration > 0;
    const items = Array.from({ length: repetitions }, (_, i) => i);

    return (
      <div ref={ref} style={{ ...resolve(tapeStyle), transform: `rotate(${rotation}deg)` }}>
        <div
          style={{
            ...resolve(trackStyle),
            animation: isAnimated ? `${animationName} ${duration}s linear infinite` : 'none'
          }}>
          {items.map((i) => (
            <span key={i} style={resolve(itemStyle)}>
              <span style={resolve(textStyle)}>{text}</span>
              <span style={resolve(separatorStyle)} />
            </span>
          ))}
        </div>
      </div>
    );
  }
);

const tapeStyle: ResponsiveStyles = {
  position: 'relative',
  width: '120%',
  left: '-10%',
  overflow: 'hidden',
  background: 'var(--color-dark-gray)',
  borderTop: '1px solid var(--color-light-gray)',
  borderBottom: '1px solid var(--color-light-gray)',
  padding: { base: '0.65rem 0', lg: '0.8rem 0' },
  userSelect: 'none',
  pointerEvents: 'none',
  zIndex: 10
};

const trackStyle: ResponsiveStyles = {
  display: 'flex',
  width: 'max-content',
  willChange: 'transform'
};

const itemStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: { base: '1.5rem', lg: '1.75rem' },
  flexShrink: 0,
  padding: { base: '0 1.5rem', lg: '0 1.75rem' }
};

const textStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.7rem', lg: '0.8rem' },
  fontWeight: 500,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  whiteSpace: 'nowrap'
};

const separatorStyle: ResponsiveStyles = {
  width: { base: '4px', lg: '5px' },
  height: { base: '4px', lg: '5px' },
  background: 'var(--color-primary)',
  borderRadius: '50%',
  opacity: 0.6,
  flexShrink: 0
};
