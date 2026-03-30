import { render, screen, act } from '@testing-library/react';
import { SpotlightText } from './SpotlightText';

const { mockBreakpoint } = vi.hoisted(() => ({ mockBreakpoint: { value: 'base' as string } }));

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: mockBreakpoint.value,
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));

vi.mock('@hooks/useMousePosition', () => ({
  useMousePosition: () => ({ x: 100, y: 100 })
}));

const lines = ['APIs', 'Web Apps', 'Libraries'];

describe('Given the SpotlightText component', () => {
  const rafCbs: FrameRequestCallback[] = [];
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockBreakpoint.value = 'base';
    rafCbs.length = 0;
    rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCbs.push(cb);

      return rafCbs.length;
    });
    cancelRafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });

  describe('When rendered', () => {
    it('Then it should render all provided text lines', () => {
      render(<SpotlightText lines={lines} />);

      lines.forEach((line) => {
        expect(screen.getAllByText(line).length).toBeGreaterThan(0);
      });
    });

    it('Then it should render the dark and lit layers', () => {
      const { container } = render(<SpotlightText lines={lines} />);
      const rootDiv = container.firstChild as HTMLDivElement;
      expect(rootDiv.children.length).toBe(2);
    });

    it('Then it should respect a custom rows count', () => {
      const { container } = render(<SpotlightText lines={lines} rows={3} />);
      const rootDiv = container.firstChild as HTMLDivElement;
      const darkLayer = rootDiv.children[0];
      expect(darkLayer.children.length).toBe(3);
    });
  });

  describe('When on a touch breakpoint (auto drift animation)', () => {
    it('Then it should schedule an animation frame on mount', () => {
      render(<SpotlightText lines={lines} />);
      expect(rafSpy).toHaveBeenCalled();
    });

    it('Then flushing the rAF callback should run the drift animation', () => {
      const { container } = render(<SpotlightText lines={lines} />);
      const rootDiv = container.firstChild as HTMLDivElement;

      rootDiv.getBoundingClientRect = vi.fn(() => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      const nowSpy = vi.spyOn(performance, 'now').mockReturnValue(5000);

      act(() => {
        const cb = rafCbs.shift();
        if (cb) cb(5000);
      });

      expect(nowSpy).toHaveBeenCalled();
      expect(rootDiv.getBoundingClientRect).toHaveBeenCalled();
      nowSpy.mockRestore();
    });

    it('Then the tick function should re-schedule itself after animating', () => {
      render(<SpotlightText lines={lines} />);
      const initialCount = rafSpy.mock.calls.length;

      act(() => {
        const cb = rafCbs.shift();
        if (cb) cb(0);
      });

      expect(rafSpy.mock.calls.length).toBeGreaterThan(initialCount);
    });

    it('Then unmounting should cancel the animation frame', () => {
      const { unmount } = render(<SpotlightText lines={lines} />);
      unmount();
      expect(cancelRafSpy).toHaveBeenCalled();
    });
  });

  describe('When on a desktop breakpoint (mouse-driven spotlight)', () => {
    it('Then it should NOT start the auto-drift animation loop', () => {
      mockBreakpoint.value = 'lg';
      rafSpy.mockClear();
      render(<SpotlightText lines={lines} />);
      expect(rafSpy).not.toHaveBeenCalled();
    });

    it('Then it should use the mouse position for the mask', () => {
      mockBreakpoint.value = 'xl';
      const { container } = render(<SpotlightText lines={lines} />);
      const rootDiv = container.firstChild as HTMLDivElement;
      const litLayer = rootDiv.children[1] as HTMLDivElement;
      expect(litLayer.style.maskImage || litLayer.style.webkitMaskImage).toContain('100px');
    });
  });

  describe('When the mask style is applied', () => {
    it('Then the lit layer should have a radial-gradient mask', () => {
      const { container } = render(<SpotlightText lines={lines} />);
      const rootDiv = container.firstChild as HTMLDivElement;
      const litLayer = rootDiv.children[1] as HTMLDivElement;
      expect(litLayer.style.maskImage || litLayer.style.webkitMaskImage).toContain('radial-gradient');
    });
  });
});
