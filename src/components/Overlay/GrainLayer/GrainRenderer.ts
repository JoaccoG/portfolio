import { createLcgRandom } from '@utils/lcg';

const RGBA_CHANNELS = 4;
const FULL_OPACITY = 255;
const MAX_COLOR_VALUE = 255;
const COLOR_WARMTH_RANGE = 18;
const PRECOMPUTED_FRAME_COUNT = 12;

export class GrainRenderer {
  private readonly canvasSize: number;
  private readonly bufferLength: number;
  private readonly frames: Uint8ClampedArray[];

  private ctx: CanvasRenderingContext2D | null = null;
  private imageData: ImageData | null = null;
  private currentFrameIndex = 0;

  constructor(canvasSize: number) {
    this.canvasSize = canvasSize;
    this.bufferLength = canvasSize * canvasSize * RGBA_CHANNELS;
    this.frames = this.precomputeFrames();
  }

  mount(canvas: HTMLCanvasElement): boolean {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    this.ctx = ctx;
    this.imageData = ctx.createImageData(this.canvasSize, this.canvasSize);

    return true;
  }

  render(): void {
    if (!this.ctx || !this.imageData) return;

    this.imageData.data.set(this.frames[this.currentFrameIndex]);
    this.ctx.putImageData(this.imageData, 0, 0);
    this.currentFrameIndex = (this.currentFrameIndex + 1) % PRECOMPUTED_FRAME_COUNT;
  }

  dispose(): void {
    this.ctx = null;
    this.imageData = null;
    this.currentFrameIndex = 0;
  }

  private precomputeFrames(): Uint8ClampedArray[] {
    const random = createLcgRandom();

    return Array.from({ length: PRECOMPUTED_FRAME_COUNT }, () => {
      const pixelBuffer = new Uint8ClampedArray(this.bufferLength);

      for (let i = 0; i < this.bufferLength; i += RGBA_CHANNELS) {
        const brightness = random() * MAX_COLOR_VALUE;
        const warmthShift = (random() - 0.5) * COLOR_WARMTH_RANGE;
        pixelBuffer[i] = brightness + warmthShift;
        pixelBuffer[i + 1] = brightness;
        pixelBuffer[i + 2] = brightness - warmthShift;
        pixelBuffer[i + 3] = FULL_OPACITY;
      }

      return pixelBuffer;
    });
  }
}
