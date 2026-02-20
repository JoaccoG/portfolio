import type { CSSProperties } from 'react';
import { useBreakpoint, type ResponsiveValue } from '@hooks/useBreakpoint';
import { VignetteLayer } from './VignetteLayer';
import { GrainLayer, GRAIN_OPTIONS } from './GrainLayer';

export const Overlay = () => {
  const { resolve } = useBreakpoint();

  const fps = resolve(GRAIN_OPTIONS.fps as ResponsiveValue<number>, 30);

  return (
    <>
      <VignetteLayer style={styles.vignette} />
      <GrainLayer fps={fps} style={styles.grain} />
    </>
  );
};

const FIXED_BASE: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  inset: 0,
  zIndex: -1
};

const styles: Record<string, CSSProperties> = {
  grain: {
    ...FIXED_BASE,
    width: '100%',
    height: '100%',
    opacity: GRAIN_OPTIONS.opacity,
    mixBlendMode: 'overlay',
    imageRendering: 'pixelated'
  },
  vignette: {
    ...FIXED_BASE,
    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.85) 100%)',
    animation: 'overlayVignettePulse 8s ease-in-out infinite'
  }
};
