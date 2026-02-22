import { renderHook } from '@testing-library/react';
import { useSmoothScroll } from './useSmoothScroll';

const mockLenisInstance = vi.hoisted(() => ({
  on: vi.fn(),
  off: vi.fn(),
  raf: vi.fn(),
  destroy: vi.fn(),
  scrollTo: vi.fn()
}));

vi.mock('lenis', () => ({
  default: class {
    on = mockLenisInstance.on;
    off = mockLenisInstance.off;
    raf = mockLenisInstance.raf;
    destroy = mockLenisInstance.destroy;
    scrollTo = mockLenisInstance.scrollTo;
  }
}));

vi.mock('gsap', () => ({
  gsap: {
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() }
  }
}));

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
