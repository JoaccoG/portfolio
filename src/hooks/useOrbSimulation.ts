import { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { ORBS } from '@constants/overlay';

type Direction = 'up' | 'down' | 'left' | 'right';
type Edge = 'top' | 'bottom' | 'left' | 'right';

interface OrbState {
  x: number;
  y: number;
  direction: Direction;
  trail: Float32Array;
  trailHead: number;
  trailSize: number;
  lastTurnFrame: number;
  isSpawned: boolean;
  spawnTime: number;
  isFading: boolean;
}

interface ViewBounds {
  halfW: number;
  halfH: number;
  exitLeft: number;
  exitRight: number;
  exitTop: number;
  exitBottom: number;
  totalW: number;
  totalH: number;
}

const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: 1 },
  down: { dx: 0, dy: -1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
};

const PERPENDICULAR: Record<Direction, Direction[]> = {
  up: ['left', 'right'],
  down: ['left', 'right'],
  left: ['up', 'down'],
  right: ['up', 'down']
};

const EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

const EDGE_DIRECTION: Record<Edge, Direction> = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left'
};

const FIXED_DT = 1 / 60;
const MAX_STEPS_PER_FRAME = 4;
const MAX_DELTA = MAX_STEPS_PER_FRAME * FIXED_DT;
const EXIT_BUFFER = 10;
const TRAIL_FADE_RATE = 2;

const { trailLength, turnChance, intersectionTolerance, turnCooldownFactor } = ORBS;

const computeGridOffset = (totalSize: number, cellSize: number) => ((totalSize / 2) % cellSize) - cellSize / 2;

interface SimulationConfig {
  cellSize: number;
  orbCount: number;
  orbSpeed: number;
}

export const useOrbSimulation = ({ cellSize, orbCount, orbSpeed }: SimulationConfig) => {
  const { size } = useThree();
  const orbsRef = useRef<OrbState[]>([]);
  const frameCountRef = useRef(0);
  const isInitializedRef = useRef(false);
  const accumulatorRef = useRef(0);

  const getViewBounds = useCallback((): ViewBounds => {
    const halfW = size.width / 2;
    const halfH = size.height / 2;

    return {
      halfW,
      halfH,
      exitLeft: -(halfW + EXIT_BUFFER),
      exitRight: halfW + EXIT_BUFFER,
      exitTop: halfH + EXIT_BUFFER,
      exitBottom: -(halfH + EXIT_BUFFER),
      totalW: size.width,
      totalH: size.height
    };
  }, [size.width, size.height]);

  const getVisibleGridLines = useCallback(
    (bounds: ViewBounds) => {
      const offsetX = computeGridOffset(bounds.totalW, cellSize);
      const offsetY = computeGridOffset(bounds.totalH, cellSize);

      const xLines: number[] = [];
      for (let x = -bounds.halfW + offsetX; x <= bounds.halfW; x += cellSize) {
        xLines.push(x);
      }

      const yLines: number[] = [];
      for (let y = -bounds.halfH + offsetY; y <= bounds.halfH; y += cellSize) {
        yLines.push(y);
      }

      return { xLines, yLines };
    },
    [cellSize]
  );

  const spawnOrbAtEdge = useCallback(
    (bounds: ViewBounds, spawnTime: number, immediate: boolean): OrbState => {
      const { xLines, yLines } = getVisibleGridLines(bounds);

      const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
      const direction = EDGE_DIRECTION[edge];

      const isHorizontalEdge = edge === 'top' || edge === 'bottom';
      const gridLines = isHorizontalEdge ? xLines : yLines;
      const linePos = gridLines[Math.floor(Math.random() * gridLines.length)];

      let x: number;
      let y: number;

      if (edge === 'top') {
        x = linePos;
        y = bounds.exitTop;
      } else if (edge === 'bottom') {
        x = linePos;
        y = bounds.exitBottom;
      } else if (edge === 'left') {
        x = bounds.exitLeft;
        y = linePos;
      } else {
        x = bounds.exitRight;
        y = linePos;
      }

      return {
        x,
        y,
        direction,
        trail: new Float32Array(trailLength * 2),
        trailHead: 0,
        trailSize: 0,
        lastTurnFrame: -100,
        isSpawned: immediate,
        spawnTime,
        isFading: false
      };
    },
    [getVisibleGridLines]
  );

  const initializeOrbs = useCallback(() => {
    if (isInitializedRef.current && orbsRef.current.length >= orbCount) return;

    const bounds = getViewBounds();
    orbsRef.current = Array.from({ length: orbCount }, (_, i) =>
      spawnOrbAtEdge(bounds, ORBS.spawnDelay + i * ORBS.spawnStagger, false)
    );
    frameCountRef.current = 0;
    accumulatorRef.current = 0;
    isInitializedRef.current = true;
  }, [orbCount, spawnOrbAtEdge, getViewBounds]);

  const tick = useCallback(
    (orbs: OrbState[], elapsed: number, bounds: ViewBounds, offsetX: number, offsetY: number) => {
      const frameCount = ++frameCountRef.current;
      const tolerance = orbSpeed + intersectionTolerance;
      const turnCooldown = (cellSize / orbSpeed) * turnCooldownFactor;
      const newOrbs: OrbState[] = [];

      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];

        if (orb.isFading) {
          orb.trailSize = Math.max(0, orb.trailSize - TRAIL_FADE_RATE);
          if (orb.trailSize <= 0) orbs.splice(i, 1);

          continue;
        }

        if (!orb.isSpawned) {
          if (elapsed >= orb.spawnTime) orb.isSpawned = true;
          else continue;
        }

        const { dx, dy } = DIRECTION_VECTORS[orb.direction];
        orb.x += dx * orbSpeed;
        orb.y += dy * orbSpeed;

        const idx = orb.trailHead * 2;
        orb.trail[idx] = orb.x;
        orb.trail[idx + 1] = orb.y;
        orb.trailHead = (orb.trailHead + 1) % trailLength;
        if (orb.trailSize < trailLength) orb.trailSize++;

        const xRem = Math.abs((orb.x - offsetX) % cellSize);
        const yRem = Math.abs((orb.y - offsetY) % cellSize);
        const isXSnapped = xRem <= tolerance || cellSize - xRem <= tolerance;
        const isYSnapped = yRem <= tolerance || cellSize - yRem <= tolerance;

        if (isXSnapped && isYSnapped && frameCount - orb.lastTurnFrame > turnCooldown && Math.random() < turnChance) {
          const perpDirs = PERPENDICULAR[orb.direction];
          orb.direction = perpDirs[Math.floor(Math.random() * perpDirs.length)];
          orb.x = Math.round((orb.x - offsetX) / cellSize) * cellSize + offsetX;
          orb.y = Math.round((orb.y - offsetY) / cellSize) * cellSize + offsetY;
          orb.lastTurnFrame = frameCount;
        }

        const isOutOfBounds =
          orb.x < bounds.exitLeft || orb.x > bounds.exitRight || orb.y < bounds.exitBottom || orb.y > bounds.exitTop;

        if (isOutOfBounds) {
          orb.isFading = true;
          newOrbs.push(spawnOrbAtEdge(bounds, 0, true));
        }
      }

      if (newOrbs.length > 0) {
        orbs.push(...newOrbs);
      }
    },
    [cellSize, orbSpeed, spawnOrbAtEdge]
  );

  const update = useCallback(
    (delta: number, elapsed: number) => {
      initializeOrbs();

      const orbs = orbsRef.current;
      const bounds = getViewBounds();
      const offsetX = computeGridOffset(bounds.totalW, cellSize) - bounds.totalW / 2;
      const offsetY = computeGridOffset(bounds.totalH, cellSize) - bounds.totalH / 2;

      accumulatorRef.current += Math.min(delta, MAX_DELTA);
      const steps = Math.min(Math.floor(accumulatorRef.current / FIXED_DT), MAX_STEPS_PER_FRAME);
      accumulatorRef.current -= steps * FIXED_DT;

      for (let s = 0; s < steps; s++) {
        tick(orbs, elapsed, bounds, offsetX, offsetY);
      }

      return orbs;
    },
    [cellSize, initializeOrbs, getViewBounds, tick]
  );

  return { update, orbsRef };
};
