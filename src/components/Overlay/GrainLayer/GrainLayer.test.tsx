import { render, cleanup } from '@testing-library/react';
import { GrainLayer, GRAIN_OPTIONS } from './GrainLayer';

const DEFAULT_STYLE = { width: '100%', height: '100%' };
const mockState = { mountReturn: true, renderCalls: 0, disposeCalls: 0, mountCalls: 0 };
const useRefOverrides: Record<number, { current: unknown }> = {};
let useRefCallIndex = 0;

vi.mock('./GrainRenderer', () => {
  return {
    GrainRenderer: class MockGrainRenderer {
      mount() {
        mockState.mountCalls++;

        return mockState.mountReturn;
      }
      render() {
        mockState.renderCalls++;
      }
      dispose() {
        mockState.disposeCalls++;
      }
    }
  };
});

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useRef: (initialValue: unknown) => {
      const idx = useRefCallIndex++;
      if (idx in useRefOverrides) return useRefOverrides[idx];

      return actual.useRef(initialValue);
    }
  };
});

describe('Given the GrainLayer component', () => {
  let rafCallbacks: ((time: number) => void)[];
  let cancelledIds: number[];
  let originalRaf: typeof requestAnimationFrame;
  let originalCaf: typeof cancelAnimationFrame;

  beforeEach(() => {
    rafCallbacks = [];
    cancelledIds = [];
    originalRaf = globalThis.requestAnimationFrame;
    originalCaf = globalThis.cancelAnimationFrame;

    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);

      return rafCallbacks.length;
    }) as typeof requestAnimationFrame;

    globalThis.cancelAnimationFrame = ((id: number) => {
      cancelledIds.push(id);
    }) as typeof cancelAnimationFrame;

    mockState.mountReturn = true;
    mockState.renderCalls = 0;
    mockState.disposeCalls = 0;
    mockState.mountCalls = 0;
    useRefCallIndex = 0;
    Object.keys(useRefOverrides).forEach((k) => delete useRefOverrides[Number(k)]);
  });

  afterEach(() => {
    cleanup();
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
  });

  describe('When rendered', () => {
    it('Then it should render a canvas element', () => {
      const { container } = render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('Then it should mount the renderer and start the animation loop', () => {
      render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);
      expect(mockState.mountCalls).toBe(1);
      expect(rafCallbacks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('When the animation loop runs', () => {
    it('If enough time has passed, then it should call renderer.render()', () => {
      render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);
      const frameDuration = 1000 / 30;

      const loopCb = rafCallbacks[0];
      loopCb(frameDuration);

      expect(mockState.renderCalls).toBe(1);
    });

    it('If not enough time has passed, then it should skip rendering', () => {
      render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);
      const frameDuration = 1000 / 30;

      const loopCb = rafCallbacks[0];
      loopCb(frameDuration);
      const before = mockState.renderCalls;

      const secondLoopCb = rafCallbacks[1];
      secondLoopCb(frameDuration + 1);

      expect(mockState.renderCalls).toBe(before);
    });
  });

  describe('When mount fails', () => {
    it('Then it should not start the animation loop', () => {
      mockState.mountReturn = false;
      render(<GrainLayer fps={60} style={DEFAULT_STYLE} />);

      expect(mockState.mountCalls).toBe(1);
      expect(rafCallbacks).toHaveLength(0);
      expect(mockState.renderCalls).toBe(0);
    });
  });

  describe('When unmounted', () => {
    it('Then it should cancel animation and dispose the renderer', () => {
      const { unmount } = render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);
      unmount();

      expect(cancelledIds.length).toBeGreaterThanOrEqual(1);
      expect(mockState.disposeCalls).toBe(1);
    });
  });

  describe('When canvas ref is null', () => {
    it('Then the effect should return early without mounting', () => {
      const nullRef = {} as { current: null };
      Object.defineProperty(nullRef, 'current', { get: () => null, set: () => {} });
      useRefOverrides[0] = nullRef;

      render(<GrainLayer fps={30} style={DEFAULT_STYLE} />);

      expect(mockState.mountCalls).toBe(0);
      expect(rafCallbacks).toHaveLength(0);
    });
  });

  describe('When GRAIN_OPTIONS is exported', () => {
    it('Then it should contain the expected configuration', () => {
      expect(GRAIN_OPTIONS.canvasSize).toBe(256);
      expect(GRAIN_OPTIONS.opacity).toBeDefined();
      expect(GRAIN_OPTIONS.fps).toBeDefined();
    });
  });
});
