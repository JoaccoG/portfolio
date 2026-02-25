import type { ResponsiveValue } from '@hooks/useBreakpoint';

export const VIGNETTE = {
  innerRadius: { base: 0.8, sm: 0.6, md: 0.55 } as ResponsiveValue<number>,
  outerRadius: { base: 1.5, sm: 1.2, md: 1 } as ResponsiveValue<number>,
  maxDarkness: { base: 0.5, md: 0.65, lg: 0.8 } as ResponsiveValue<number>,
  pulseDuration: 8
} as const;

export const GRAIN = {
  fps: { base: 24, md: 30 } as ResponsiveValue<number>,
  opacity: 0.06,
  warmthRange: 75
} as const;

export const GRID = {
  cellSize: { base: 150, sm: 192, md: 256 } as ResponsiveValue<number>,
  lineOpacity: 0.08,
  overflow: 256
} as const;

export const ORBS = {
  count: { base: 6, sm: 8, lg: 10 } as ResponsiveValue<number>,
  speed: { base: 1, md: 1.2 } as ResponsiveValue<number>,
  radius: 3,
  spawnDelay: 0.2, // delay before the first orb spawns
  spawnStagger: 0.5, // delay between each consecutive orb spawning
  turnChance: 0.25, // probability of turning at a grid intersection
  trailLength: 80,
  headColor: 'white',
  trailColor: 'white',
  headAlpha: 0, // opacity of the orb's head
  trailMaxAlpha: 0.5, // opacity at the newest trail point (fades to 0 at the oldest trail point)
  trailMinSizeRatio: 0.5, // size ratio at the oldest trail point (multiplied by radius)
  trailSizeRange: 0.5, // additional size added toward the newest point (oldest=minRatio, newest=minRatio+range)
  turnCooldownFactor: 0.8, // min frames between turns, as fraction of cellSize/speed
  intersectionTolerance: 0.1 // extra px tolerance for detecting grid intersections
} as const;
