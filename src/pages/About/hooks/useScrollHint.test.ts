import { renderHook, act } from '@testing-library/react';
import { useScrollHint } from './useScrollHint';

const makeRect = (top: number, bottom: number): DOMRect =>
  ({ top, bottom, left: 0, right: 0, width: 0, height: 0, toJSON: () => {} }) as DOMRect;

const createRefs = (sectionInView = false, chaptersVisible = false) => {
  const section = document.createElement('section');
  const inner = document.createElement('div');
  document.body.appendChild(section);
  document.body.appendChild(inner);
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(
    makeRect(sectionInView ? -100 : 2000, sectionInView ? 500 : 3000)
  );
  vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue(
    makeRect(chaptersVisible ? 0 : 2000, chaptersVisible ? 500 : 3000)
  );

  return {
    sectionRef: { current: section },
    innerRef: { current: inner }
  };
};

describe('Given the useScrollHint hook', () => {
  let heroEl: HTMLElement | null = null;

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    heroEl?.remove();
    heroEl = null;
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  const appendHeroInView = () => {
    heroEl = document.createElement('section');
    heroEl.id = 'hero';
    document.body.appendChild(heroEl);
    vi.spyOn(heroEl, 'getBoundingClientRect').mockReturnValue(makeRect(0, 500));
  };

  describe('When initially mounted', () => {
    it('Then showHint is false', () => {
      const refs = createRefs();
      const { result } = renderHook(() => useScrollHint(refs));
      expect(result.current.showHint).toBe(false);
    });
  });

  describe('When the About section is in view and chapters are not visible', () => {
    it('Then showHint becomes true after the 5s initial idle delay', () => {
      const refs = createRefs(true, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.showHint).toBe(true);
    });

    it('Then showHint stays false when chapters are already visible', () => {
      const refs = createRefs(true, true);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.showHint).toBe(false);
    });

    it('Then showHint stays false when the section is not in the viewport', () => {
      const refs = createRefs(false, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.showHint).toBe(false);
    });
  });

  describe('When the hero section is in the viewport', () => {
    it('Then showHint becomes true after the idle delay', () => {
      appendHeroInView();
      const refs = createRefs(false, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.showHint).toBe(true);
    });
  });

  describe('When the user scrolls', () => {
    it('Then showHint becomes false immediately', () => {
      const refs = createRefs(true, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.showHint).toBe(true);

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.showHint).toBe(false);
    });

    it('Then showHint becomes true again after 1s of inactivity', () => {
      const refs = createRefs(true, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.showHint).toBe(true);
    });

    it('Then each scroll resets the 1s idle timer', () => {
      const refs = createRefs(true, false);
      const { result } = renderHook(() => useScrollHint(refs));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current.showHint).toBe(false);
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current.showHint).toBe(true);
    });
  });

  describe('When the hook unmounts', () => {
    it('Then it should remove the scroll event listener', () => {
      const spy = vi.spyOn(window, 'removeEventListener');
      const refs = createRefs();
      const { unmount } = renderHook(() => useScrollHint(refs));
      unmount();
      expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
