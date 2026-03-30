import { useRef, useState, useCallback, useEffect } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { useMousePosition } from '@hooks/useMousePosition';

const SPOTLIGHT_RADIUS = 180;
const MARQUEE_SPEED = 200;
const TRACK_REPS = 4;

const DRIFT = {
  freqX: 0.00181,
  freqY: 0.00127,
  phaseX: Math.random() * Math.PI * 2,
  phaseY: Math.random() * Math.PI * 2,
  driftFreqX: 0.000071,
  driftFreqY: 0.000093
} as const;

interface SpotlightTextProps {
  lines: readonly string[];
  rows?: number;
}

export const SpotlightText = ({ lines, rows = 5 }: SpotlightTextProps) => {
  const { breakpoint, resolve } = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition(containerRef);
  const [autoPos, setAutoPos] = useState({ x: 0, y: 0 });

  const isTouch = !['md', 'lg', 'xl'].includes(breakpoint);

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const t = performance.now();

    const cx = (Math.sin(t * DRIFT.freqX + DRIFT.phaseX) + Math.sin(t * DRIFT.driftFreqX)) / 2;
    const cy = (Math.sin(t * DRIFT.freqY + DRIFT.phaseY) + Math.sin(t * DRIFT.driftFreqY)) / 2;

    setAutoPos({
      x: width * (0.15 + (cx + 1) * 0.35),
      y: height * (0.15 + (cy + 1) * 0.35)
    });
  }, []);

  useEffect(() => {
    if (!isTouch) return;

    let rafId: number;
    const tick = () => {
      animate();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isTouch, animate]);

  const pos = isTouch ? autoPos : mouse;
  const mask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${pos.x}px ${pos.y}px, black 0%, transparent 100%)`;

  const buildTrackItems = (textStyle: ResponsiveStyles, dotStyle: ResponsiveStyles) =>
    Array.from({ length: TRACK_REPS }, (_, repIdx) =>
      lines.map((line, lineIdx) => (
        <span key={`${repIdx}-${lineIdx}`} style={resolve(itemStyle)}>
          <span style={resolve(textStyle)}>{line}</span>
          <span style={resolve(dotStyle)} />
        </span>
      ))
    ).flat();

  const renderRows = (textStyle: ResponsiveStyles, dotStyle: ResponsiveStyles) =>
    Array.from({ length: rows }, (_, rowIdx) => {
      const animation = rowIdx % 2 === 0 ? 'tapeMarqueeLeft' : 'tapeMarqueeRight';

      return (
        <div key={rowIdx} style={resolve(rowStyle)}>
          <div
            style={{
              ...resolve(trackStyle),
              animation: `${animation} ${MARQUEE_SPEED}s linear infinite`
            }}>
            {buildTrackItems(textStyle, dotStyle)}
          </div>
        </div>
      );
    });

  return (
    <div ref={containerRef} style={resolve(containerStyle)}>
      <div style={resolve(layerStyle)}>{renderRows(darkTextStyle, darkDotStyle)}</div>

      <div style={{ ...resolve(litLayerStyle), maskImage: mask, WebkitMaskImage: mask }}>
        {renderRows(litTextStyle, litDotStyle)}
      </div>
    </div>
  );
};

const containerStyle: ResponsiveStyles = {
  position: 'relative',
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  overflow: 'hidden',
  cursor: 'default'
};

const layerStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column'
};

const rowStyle: ResponsiveStyles = {
  overflow: 'hidden'
};

const trackStyle: ResponsiveStyles = {
  display: 'flex',
  width: 'max-content',
  willChange: 'transform'
};

const itemStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: { base: '1rem', md: '1.5rem' },
  flexShrink: 0,
  padding: { base: '0 1rem', md: '0 1.5rem' }
};

const textBase: ResponsiveStyles = {
  fontFamily: 'var(--font-body)',
  fontSize: {
    base: '2rem',
    xs: '2.5rem',
    sm: '3rem',
    md: '4rem',
    lg: '5rem',
    xl: '7rem'
  },
  letterSpacing: '0.03em',
  lineHeight: 1,
  userSelect: 'none',
  whiteSpace: 'nowrap'
};

const dotBase: ResponsiveStyles = {
  width: { base: '5px', md: '8px' },
  height: { base: '5px', md: '8px' },
  borderRadius: '50%',
  opacity: 0.4,
  flexShrink: 0
};

const darkTextStyle: ResponsiveStyles = { ...textBase, color: '#424342' };
const darkDotStyle: ResponsiveStyles = { ...dotBase, background: '#424342' };

const litLayerStyle: ResponsiveStyles = {
  ...layerStyle,
  position: 'absolute',
  inset: '0',
  zIndex: 2,
  pointerEvents: 'none'
};

const litTextStyle: ResponsiveStyles = { ...textBase, color: 'var(--color-white)' };
const litDotStyle: ResponsiveStyles = { ...dotBase, background: 'var(--color-white)' };
