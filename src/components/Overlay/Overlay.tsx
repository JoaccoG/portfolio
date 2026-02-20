import type { CSSProperties } from 'react';
import { useBreakpoint, type ResponsiveValue } from '@hooks/useBreakpoint';
import { VignetteLayer } from './VignetteLayer';
import { GrainLayer, GRAIN_OPTIONS } from './GrainLayer';
import { GridLayer, GRID_OPTIONS, GRID_LIGHTS_OPTIONS } from './GridLayer';

export const Overlay = () => {
  const { resolve } = useBreakpoint();

  const fps = resolve(GRAIN_OPTIONS.fps as ResponsiveValue<number>, 30);
  const cellSize = resolve(GRID_OPTIONS.cellSize as ResponsiveValue<number>, 128);
  const orbCount = resolve(GRID_LIGHTS_OPTIONS.count as ResponsiveValue<number>, 1);
  const orbSpeed = resolve(GRID_LIGHTS_OPTIONS.speed as ResponsiveValue<number>, 0.4);

  return (
    <>
      <VignetteLayer style={styles.vignette} />
      <GrainLayer fps={fps} style={styles.grain} />
      <GridLayer
        cellSize={cellSize}
        orbCount={orbCount}
        orbSpeed={orbSpeed}
        gridOverflow={GRID_OVERFLOW}
        styles={{ fixedLayer: styles.fixedLayer, gridSublayer: styles.gridSublayer, orbCanvas: styles.orbCanvas }}
      />
    </>
  );
};

const GRID_OVERFLOW = 256;

const FIXED_BASE: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  inset: 0,
  zIndex: -1
};

const styles: Record<string, CSSProperties> = {
  fixedLayer: {
    ...FIXED_BASE,
    overflow: 'hidden'
  },
  gridSublayer: {
    position: 'absolute',
    inset: -GRID_OVERFLOW
  },
  orbCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none'
  },
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
