import { Canvas } from '@react-three/fiber';
import { useBreakpoint, type ResponsiveValue, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { VIGNETTE, GRAIN, GRID, ORBS } from '@constants/overlay';
import { VignetteLayer } from './VignetteLayer/VignetteLayer';
import { GrainLayer } from './GrainLayer/GrainLayer';
import { GridLayer } from './GridLayer/GridLayer';
import { OrbSystem } from './GridLayer/OrbSystem';

export const Overlay = () => {
  const { resolve } = useBreakpoint();

  const vignetteInner = resolve(VIGNETTE.innerRadius as ResponsiveValue<number>, VIGNETTE.innerRadius.base as number);
  const vignetteOuter = resolve(VIGNETTE.outerRadius as ResponsiveValue<number>, VIGNETTE.outerRadius.base as number);
  const vignetteMaxDarkness = resolve(
    VIGNETTE.maxDarkness as ResponsiveValue<number>,
    VIGNETTE.maxDarkness.base as number
  );
  const grainFps = resolve(GRAIN.fps as ResponsiveValue<number>, GRAIN.fps.base as number);
  const cellSize = resolve(GRID.cellSize as ResponsiveValue<number>, GRID.cellSize.base as number);
  const orbCount = resolve(ORBS.count as ResponsiveValue<number>, ORBS.count.base as number);
  const orbSpeed = resolve(ORBS.speed as ResponsiveValue<number>, ORBS.speed.base as number);

  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, near: -100, far: 100, position: [0, 0, 1] }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      frameloop="always"
      style={resolve(canvasStyle)}>
      <VignetteLayer innerRadius={vignetteInner} outerRadius={vignetteOuter} maxDarkness={vignetteMaxDarkness} />
      <GrainLayer fps={grainFps} />
      <GridLayer cellSize={cellSize} />
      <OrbSystem cellSize={cellSize} orbCount={orbCount} orbSpeed={orbSpeed} />
    </Canvas>
  );
};

const canvasStyle: ResponsiveStyles = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: -1
};
