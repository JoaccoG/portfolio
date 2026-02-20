import { useRef, useEffect, type CSSProperties } from 'react';
import { GrainRenderer } from './GrainRenderer';

export const GRAIN_OPTIONS = {
  fps: { base: 24, sm: 30, md: 60 },
  canvasSize: 256,
  opacity: 0.08
} as const;

interface GrainLayerProps {
  fps: number;
  style: CSSProperties;
}

export const GrainLayer = ({ fps, style }: GrainLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GrainRenderer>(new GrainRenderer(GRAIN_OPTIONS.canvasSize));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = rendererRef.current;
    if (!renderer.mount(canvas)) return;

    const frameDuration = 1000 / fps;

    let rafId: number;
    let lastRenderTime = 0;

    const loop = (timestamp: number) => {
      rafId = requestAnimationFrame(loop);
      if (timestamp - lastRenderTime < frameDuration) return;
      lastRenderTime = timestamp;

      renderer.render();
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, [fps]);

  return <canvas ref={canvasRef} style={style} />;
};
