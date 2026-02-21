import type { CSSProperties } from 'react';
import { render, cleanup } from '@testing-library/react';
import { GridLayer, GRID_OPTIONS, GRID_LIGHTS_OPTIONS } from './GridLayer';

const DEFAULT_STYLES: { fixedLayer: CSSProperties; gridSublayer: CSSProperties; orbCanvas: CSSProperties } = {
  fixedLayer: { position: 'fixed' },
  gridSublayer: { position: 'absolute' },
  orbCanvas: { position: 'absolute' }
};
const mockState = { mountReturn: true, renderCalls: 0, disposeCalls: 0, mountCalls: 0, resizeCalls: 0 };
const useRefOverrides: Record<number, { current: unknown }> = {};
let useRefCallIndex = 0;

vi.mock('./GridRenderer', () => {
  return {
    GridRenderer: class MockGridRenderer {
      mount() {
        mockState.mountCalls++;

        return mockState.mountReturn;
      }
      resize() {
        mockState.resizeCalls++;
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

describe('Given the GridLayer component', () => {
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

    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

    mockState.mountReturn = true;
    mockState.renderCalls = 0;
    mockState.disposeCalls = 0;
    mockState.mountCalls = 0;
    mockState.resizeCalls = 0;
    useRefCallIndex = 0;
    Object.keys(useRefOverrides).forEach((k) => delete useRefOverrides[Number(k)]);
  });

  afterEach(() => {
    cleanup();
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
  });

  describe('When rendered', () => {
    it('Then it should render a container with a grid div and a canvas', () => {
      const { container } = render(
        <GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />
      );
      expect(container.querySelector('div')).toBeInTheDocument();
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('Then it should mount the renderer and start the animation loop', () => {
      render(<GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />);
      expect(mockState.mountCalls).toBe(1);
      expect(rafCallbacks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('When the animation loop runs', () => {
    it('Then it should call renderer.render() on each frame', () => {
      render(<GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />);

      const loopCb = rafCallbacks[0];
      loopCb(0);

      expect(mockState.renderCalls).toBe(1);
    });
  });

  describe('When mount fails', () => {
    it('Then it should not start the animation loop', () => {
      mockState.mountReturn = false;
      render(<GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />);

      expect(mockState.mountCalls).toBe(1);
      expect(rafCallbacks).toHaveLength(0);
      expect(mockState.renderCalls).toBe(0);
    });
  });

  describe('When unmounted', () => {
    it('Then it should cancel animation and dispose the renderer', () => {
      const { unmount } = render(
        <GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />
      );
      unmount();

      expect(cancelledIds.length).toBeGreaterThanOrEqual(1);
      expect(mockState.disposeCalls).toBe(1);
    });
  });

  describe('When canvas ref is null', () => {
    it('Then the second effect should return early without mounting', () => {
      const nullRef = {} as { current: null };
      Object.defineProperty(nullRef, 'current', { get: () => null, set: () => {} });
      useRefOverrides[1] = nullRef;

      render(<GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />);

      expect(mockState.mountCalls).toBe(0);
      expect(rafCallbacks).toHaveLength(0);
    });
  });

  describe('When base ref is null', () => {
    it('Then applyOffset should skip setting background styles', () => {
      const nullRef = {} as { current: null };
      Object.defineProperty(nullRef, 'current', { get: () => null, set: () => {} });
      useRefOverrides[0] = nullRef;

      const { container } = render(
        <GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />
      );

      const gridDiv = container.querySelector('div > div') as HTMLDivElement;
      expect(gridDiv.style.backgroundImage).toBe('');
    });
  });

  describe('When the window is resized', () => {
    it('Then the first effect should reapply the grid offset', () => {
      const { container } = render(
        <GridLayer cellSize={128} orbCount={3} orbSpeed={1} styles={DEFAULT_STYLES} gridOverflow={256} />
      );

      const gridDiv = container.querySelector('div > div') as HTMLDivElement;

      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 400, writable: true });
      window.dispatchEvent(new Event('resize'));

      expect(gridDiv?.style.backgroundPosition).toBeDefined();
      expect(gridDiv?.style.backgroundImage).toBeDefined();
    });
  });

  describe('When GRID_OPTIONS is exported', () => {
    it('Then it should contain the expected configuration', () => {
      expect(GRID_OPTIONS.cellSize).toBeDefined();
      expect(GRID_OPTIONS.baseOpacity).toBe(0.03);
    });
  });

  describe('When GRID_LIGHTS_OPTIONS is exported', () => {
    it('Then it should contain the expected configuration', () => {
      expect(GRID_LIGHTS_OPTIONS.count).toBeDefined();
      expect(GRID_LIGHTS_OPTIONS.speed).toBeDefined();
      expect(GRID_LIGHTS_OPTIONS.radius).toBe(2);
      expect(GRID_LIGHTS_OPTIONS.turnChance).toBe(0.2);
      expect(GRID_LIGHTS_OPTIONS.trailLength).toBe(200);
      expect(GRID_LIGHTS_OPTIONS.spawnDelay).toBe(500);
      expect(GRID_LIGHTS_OPTIONS.spawnStagger).toBe(1500);
    });
  });
});
