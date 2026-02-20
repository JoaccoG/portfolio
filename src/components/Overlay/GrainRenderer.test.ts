import { createMockCanvasContext, createMockCanvas } from '@test/helpers/canvas';
import { GrainRenderer } from './GrainRenderer';

const CANVAS_SIZE = 4;
const PRECOMPUTED_FRAME_COUNT = 12;
const RGBA_CHANNELS = 4;

describe('Given a GrainRenderer instance', () => {
  let renderer: GrainRenderer;

  beforeEach(() => {
    renderer = new GrainRenderer(CANVAS_SIZE);
  });

  afterEach(() => {
    renderer.dispose();
  });

  describe('When constructed', () => {
    it('Then it should precompute the correct number of frames', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);
      renderer.mount(canvas);

      const expectedBufferLength = CANVAS_SIZE * CANVAS_SIZE * RGBA_CHANNELS;

      for (let i = 0; i < PRECOMPUTED_FRAME_COUNT; i++) renderer.render();

      expect(ctx.putImageData).toHaveBeenCalledTimes(PRECOMPUTED_FRAME_COUNT);

      const firstCall = ctx.putImageData.mock.calls[0][0] as ImageData;
      expect(firstCall.data.length).toBe(expectedBufferLength);
    });
  });

  describe('When mount() is called', () => {
    it('If the canvas context is valid, then it should return true', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);

      expect(renderer.mount(canvas)).toBe(true);
      expect(canvas.width).toBe(CANVAS_SIZE);
      expect(canvas.height).toBe(CANVAS_SIZE);
    });

    it('If getContext returns null, then it should return false', () => {
      const canvas = createMockCanvas(null);

      expect(renderer.mount(canvas)).toBe(false);
    });
  });

  describe('When render() is called', () => {
    it('If mounted, then it should put image data on the canvas', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);
      renderer.mount(canvas);

      renderer.render();

      expect(ctx.putImageData).toHaveBeenCalledTimes(1);
    });

    it('If mounted, then it should cycle through all frames and wrap around', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);
      renderer.mount(canvas);

      for (let i = 0; i < PRECOMPUTED_FRAME_COUNT + 1; i++) renderer.render();

      const firstFrameData = ctx.putImageData.mock.calls[0][0] as ImageData;
      const wrappedFrameData = ctx.putImageData.mock.calls[PRECOMPUTED_FRAME_COUNT][0] as ImageData;

      expect(firstFrameData.data).toEqual(wrappedFrameData.data);
    });

    it('If not mounted, then it should do nothing', () => {
      renderer.render();
      // No error thrown, no calls made
    });

    it('If disposed after mounting, then it should do nothing', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);
      renderer.mount(canvas);
      renderer.dispose();

      renderer.render();

      expect(ctx.putImageData).not.toHaveBeenCalled();
    });
  });

  describe('When dispose() is called', () => {
    it('Then subsequent renders should be no-ops', () => {
      const ctx = createMockCanvasContext();
      const canvas = createMockCanvas(ctx);
      renderer.mount(canvas);

      renderer.dispose();
      renderer.render();

      expect(ctx.putImageData).not.toHaveBeenCalled();
    });
  });
});
