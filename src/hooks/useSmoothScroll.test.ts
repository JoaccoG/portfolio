import { renderHook } from '@testing-library/react';
import { useSmoothScroll } from './useSmoothScroll';

const { mockLenisInstance, capturedLenisOptions, mockTicker } = vi.hoisted(() => ({
  mockLenisInstance: {
    on: vi.fn(),
    off: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
    scrollTo: vi.fn()
  },
  capturedLenisOptions: { current: {} },
  mockTicker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() }
}));

vi.mock('lenis', () => ({
  default: class {
    on = mockLenisInstance.on;
    off = mockLenisInstance.off;
    raf = mockLenisInstance.raf;
    destroy = mockLenisInstance.destroy;
    scrollTo = mockLenisInstance.scrollTo;
    constructor(opts: Record<string, unknown>) {
      capturedLenisOptions.current = opts;
    }
  }
}));

vi.mock('gsap', () => ({ gsap: { ticker: mockTicker } }));

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { update: vi.fn() } }));

describe('Given the useSmoothScroll hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When the hook is used', () => {
    it('Then it should wire Lenis scroll events to GSAP ScrollTrigger', () => {
      renderHook(() => useSmoothScroll());
      expect(mockLenisInstance.on).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('When the GSAP ticker fires', () => {
    it('Then it should forward the time to Lenis raf in milliseconds', () => {
      renderHook(() => useSmoothScroll());
      const tickerFn = mockTicker.add.mock.calls[0][0] as (time: number) => void;
      tickerFn(1.5);
      expect(mockLenisInstance.raf).toHaveBeenCalledWith(1500);
    });
  });

  describe('When Lenis is constructed', () => {
    it('Then the easing function should return values in [0, 1]', () => {
      renderHook(() => useSmoothScroll());
      const { easing } = capturedLenisOptions.current as { easing?: (t: number) => number };
      expect(easing).toBeDefined();
      expect(easing!(0)).toBeCloseTo(0, 2);
      expect(easing!(1)).toBeCloseTo(1, 2);
      expect(easing!(0.5)).toBeGreaterThan(0);
      expect(easing!(0.5)).toBeLessThanOrEqual(1);
    });
  });

  describe('When scrollTo is called', () => {
    it('Then it should delegate to Lenis scrollTo with the target hash', () => {
      const { result } = renderHook(() => useSmoothScroll());
      result.current.scrollTo('about');
      expect(mockLenisInstance.scrollTo).toHaveBeenCalledWith('#about', { offset: 0 });
    });
  });

  describe('When unmounted', () => {
    it('Then it should clean up Lenis and GSAP listeners', () => {
      const { unmount } = renderHook(() => useSmoothScroll());
      unmount();
      expect(mockLenisInstance.off).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(mockLenisInstance.destroy).toHaveBeenCalledOnce();
    });
  });
});
