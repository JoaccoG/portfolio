import { useRef, useEffect, type CSSProperties } from 'react';
import { GridRenderer } from './GridRenderer';

export const GRID_OPTIONS = {
  cellSize: { base: 128, sm: 192, md: 256 },
  baseOpacity: 0.03
} as const;

export const GRID_LIGHTS_OPTIONS = {
  count: { base: 2, sm: 3, lg: 5 },
  speed: { base: 0.4, md: 0.6, lg: 0.8 },
  radius: 2,
  turnChance: 0.2,
  trailLength: 200,
  spawnDelay: 500,
  spawnStagger: 1500
} as const;

const GRID_LINE_WIDTH = 1;

interface GridLayerProps {
  cellSize: number;
  orbCount: number;
  orbSpeed: number;
  styles: {
    fixedLayer: CSSProperties;
    gridSublayer: CSSProperties;
    orbCanvas: CSSProperties;
  };
  gridOverflow: number;
}

export const GridLayer = ({ cellSize, orbCount, orbSpeed, styles, gridOverflow }: GridLayerProps) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const line = (dir: string) =>
    `repeating-linear-gradient(to ${dir}, rgba(255,255,255,${GRID_OPTIONS.baseOpacity}) 0px, rgba(255,255,255,${GRID_OPTIONS.baseOpacity}) ${GRID_LINE_WIDTH}px, transparent ${GRID_LINE_WIDTH}px, transparent ${cellSize}px)`;
  const gridPattern = `${line('right')}, ${line('bottom')}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getGridDimensions = () => {
      if (!baseRef.current) return { w: 0, h: 0 };

      const rect = baseRef.current.getBoundingClientRect();

      return { w: rect.width, h: rect.height };
    };

    const computeOffset = (totalW: number, totalH: number) => ({
      x: ((totalW / 2) % cellSize) - cellSize / 2,
      y: ((totalH / 2) % cellSize) - cellSize / 2
    });

    const applyGridBackground = (offset: { x: number; y: number }) => {
      if (!baseRef.current) return;

      baseRef.current.style.backgroundPosition = `${offset.x}px ${offset.y}px`;
      baseRef.current.style.backgroundImage = gridPattern;
    };

    const { w, h } = getGridDimensions();
    const initialOffset = computeOffset(w, h);
    applyGridBackground(initialOffset);

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const renderer = new GridRenderer({
      cellSize,
      orbCount,
      orbSpeed,
      orbRadius: GRID_LIGHTS_OPTIONS.radius,
      turnChance: GRID_LIGHTS_OPTIONS.turnChance,
      trailLength: GRID_LIGHTS_OPTIONS.trailLength,
      gridOffsetX: initialOffset.x,
      gridOffsetY: initialOffset.y,
      gridOverflow,
      spawnDelay: GRID_LIGHTS_OPTIONS.spawnDelay,
      spawnStagger: GRID_LIGHTS_OPTIONS.spawnStagger
    });

    if (!renderer.mount(canvas)) return;

    const handleResize = () => {
      const { w: rw, h: rh } = getGridDimensions();
      const offset = computeOffset(rw, rh);
      applyGridBackground(offset);
      canvas.style.width = `${rw}px`;
      canvas.style.height = `${rh}px`;
      renderer.resize(canvas, rw, rh, offset.x, offset.y);
    };

    window.addEventListener('resize', handleResize);

    let rafId: number;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      renderer.render();
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cellSize, orbCount, orbSpeed]);

  return (
    <div style={styles.fixedLayer}>
      <div ref={baseRef} style={styles.gridSublayer} />
      <canvas ref={canvasRef} style={styles.orbCanvas} />
    </div>
  );
};
