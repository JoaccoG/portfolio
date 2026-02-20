interface MockCanvasContext {
  clearRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  putImageData: ReturnType<typeof vi.fn>;
  createImageData: ReturnType<typeof vi.fn>;
  createRadialGradient: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  globalAlpha: number;
  fillStyle: string | CanvasGradient;
}

interface MockGradient {
  addColorStop: ReturnType<typeof vi.fn>;
}

export const createMockGradient = (): MockGradient => ({
  addColorStop: vi.fn()
});

export const createMockCanvasContext = (): MockCanvasContext => {
  const gradient = createMockGradient();

  return {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(
      (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }) as ImageData
    ),
    createRadialGradient: vi.fn(() => gradient),
    fillRect: vi.fn(),
    globalAlpha: 1,
    fillStyle: ''
  };
};

export const createMockCanvas = (ctx: MockCanvasContext | null = createMockCanvasContext()) => {
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx)
  };

  return canvas as unknown as HTMLCanvasElement & { getContext: ReturnType<typeof vi.fn> };
};
