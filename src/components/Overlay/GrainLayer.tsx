import { useRef, useEffect, type CSSProperties } from 'react';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = GRAIN_OPTIONS.canvasSize;
    canvas.height = GRAIN_OPTIONS.canvasSize;

    let rafId: number;
    let lastTime = 0;
    const interval = 1000 / fps;

    const render = (time: number) => {
      rafId = requestAnimationFrame(render);
      if (time - lastTime < interval) return;
      lastTime = time;

      const imageData = ctx.createImageData(GRAIN_OPTIONS.canvasSize, GRAIN_OPTIONS.canvasSize);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        const warm = (Math.random() - 0.5) * 18;
        data[i] = Math.min(255, value + warm);
        data[i + 1] = value;
        data[i + 2] = Math.min(255, value - warm);
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [fps]);

  return <canvas ref={canvasRef} style={style} />;
};
