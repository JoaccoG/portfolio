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
  const gridOffsetRef = useRef({ x: 0, y: 0 });

  const line = (dir: string) =>
    `repeating-linear-gradient(to ${dir}, rgba(255,255,255,${GRID_OPTIONS.baseOpacity}) 0px, rgba(255,255,255,${GRID_OPTIONS.baseOpacity}) ${GRID_LINE_WIDTH}px, transparent ${GRID_LINE_WIDTH}px, transparent ${cellSize}px)`;
  const gridPattern = `${line('right')}, ${line('bottom')}`;

  useEffect(() => {
    const applyOffset = () => {
      const totalW = window.innerWidth + gridOverflow * 2;
      const totalH = window.innerHeight + gridOverflow * 2;
      const x = ((totalW / 2) % cellSize) - cellSize / 2;
      const y = ((totalH / 2) % cellSize) - cellSize / 2;

      gridOffsetRef.current = { x, y };

      if (baseRef.current) {
        baseRef.current.style.backgroundPosition = `${x}px ${y}px`;
        baseRef.current.style.backgroundImage = gridPattern;
      }
    };

    applyOffset();
    window.addEventListener('resize', applyOffset);

    return () => window.removeEventListener('resize', applyOffset);
  }, [cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x: ox, y: oy } = gridOffsetRef.current;
    const gridOffsetX = ((ox % cellSize) + cellSize) % cellSize;
    const gridOffsetY = ((oy % cellSize) + cellSize) % cellSize;

    const renderer = new GridRenderer({
      cellSize,
      orbCount,
      orbSpeed,
      orbRadius: GRID_LIGHTS_OPTIONS.radius,
      turnChance: GRID_LIGHTS_OPTIONS.turnChance,
      trailLength: GRID_LIGHTS_OPTIONS.trailLength,
      gridOffsetX,
      gridOffsetY,
      spawnDelay: GRID_LIGHTS_OPTIONS.spawnDelay,
      spawnStagger: GRID_LIGHTS_OPTIONS.spawnStagger
    });

    if (!renderer.mount(canvas)) return;

    const handleResize = () => renderer.resize(canvas);
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
