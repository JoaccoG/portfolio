import { useRef, useEffect, type CSSProperties } from 'react';

export const GRAIN_OPTIONS = {
  fps: { base: 24, sm: 30, md: 60 },
  canvasSize: 256,
  opacity: 0.08
} as const;

const PRECOMPUTED_FRAME_COUNT = 12;
const COLOR_WARMTH_RANGE = 18;
const MAX_COLOR_VALUE = 255;
const RGBA_CHANNELS = 4;
const FULL_OPACITY = 255;

const CANVAS_SIZE = GRAIN_OPTIONS.canvasSize;
const BUFFER_LENGTH = CANVAS_SIZE * CANVAS_SIZE * RGBA_CHANNELS;

const LCG = {
  multiplier: 9301,
  increment: 49297,
  modulus: 233280
} as const;

const createLcgRandom = () => {
  let seed = (Date.now() * LCG.multiplier + LCG.increment) % LCG.modulus;

  return (): number => {
    seed = (seed * LCG.multiplier + LCG.increment) % LCG.modulus;

    return seed / LCG.modulus;
  };
};

const precomputeGrainFrames = (): Uint8ClampedArray[] => {
  const random = createLcgRandom();

  return Array.from({ length: PRECOMPUTED_FRAME_COUNT }, () => {
    const pixelBuffer = new Uint8ClampedArray(BUFFER_LENGTH);

    for (let i = 0; i < BUFFER_LENGTH; i += RGBA_CHANNELS) {
      const brightness = random() * MAX_COLOR_VALUE;
      const warmthShift = (random() - 0.5) * COLOR_WARMTH_RANGE;
      pixelBuffer[i] = brightness + warmthShift;
      pixelBuffer[i + 1] = brightness;
      pixelBuffer[i + 2] = brightness - warmthShift;
      pixelBuffer[i + 3] = FULL_OPACITY;
    }

    return pixelBuffer;
  });
};

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

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const frames = precomputeGrainFrames();
    const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
    const frameDuration = 1000 / fps;

    let rafId: number;
    let lastRenderTime = 0;
    let currentFrameIndex = 0;

    const render = (timestamp: number) => {
      rafId = requestAnimationFrame(render);
      if (timestamp - lastRenderTime < frameDuration) return;
      lastRenderTime = timestamp;

      imageData.data.set(frames[currentFrameIndex]);
      ctx.putImageData(imageData, 0, 0);
      currentFrameIndex = (currentFrameIndex + 1) % PRECOMPUTED_FRAME_COUNT;
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [fps]);

  return <canvas ref={canvasRef} style={style} />;
};
