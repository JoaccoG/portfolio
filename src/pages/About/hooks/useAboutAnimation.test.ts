import gsap from 'gsap';
import { renderHook } from '@testing-library/react';
import { useAboutAnimation } from './useAboutAnimation';

type MatchMediaCallback = () => void;
const capturedMediaCallbacks = new Map<string, MatchMediaCallback>();

const mockTimeline = {
  fromTo: vi.fn().mockReturnThis()
};

vi.mock('gsap', () => ({
  default: {
    set: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => mockTimeline),
    matchMedia: vi.fn(() => ({
      add: vi.fn((query: string, cb: MatchMediaCallback) => capturedMediaCallbacks.set(query, cb))
    }))
  }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return { useGSAP: (cb: () => void) => useEffect(() => cb(), []) };
});

const createMockElement = (overrides: Record<string, unknown> = {}) =>
  ({
    clientHeight: 800,
    offsetWidth: 1400,
    offsetTop: 0,
    offsetHeight: 200,
    offsetLeft: 700,
    querySelectorAll: vi.fn(() => [document.createElement('span')]),
    ...overrides
  }) as unknown;

const createPopulatedRefs = () => {
  const section = createMockElement({ offsetWidth: 1400 });
  const title = createMockElement();
  const windowEl = createMockElement({ clientHeight: 800, offsetLeft: 840 });
  const inner = createMockElement();
  const lastChapter = createMockElement({ offsetTop: 400, offsetHeight: 200 });
  const chapter = createMockElement();

  return {
    sectionRef: { current: section as HTMLElement },
    titleRef: { current: title as HTMLHeadingElement },
    windowRef: { current: windowEl as HTMLDivElement },
    innerRef: { current: inner as HTMLDivElement },
    lastChapterRef: { current: lastChapter as HTMLDivElement },
    chapterRefs: { current: [chapter as HTMLDivElement] }
  };
};

describe('Given the useAboutAnimation hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedMediaCallbacks.clear();
  });

  describe('When any ref is null', () => {
    it('Then it should bail out without creating matchMedia', () => {
      const refs = createPopulatedRefs();
      refs.sectionRef.current = null as unknown as HTMLElement;
      renderHook(() => useAboutAnimation(refs));
      expect(gsap.matchMedia).not.toHaveBeenCalled();
    });

    it('Then it should bail out when titleRef is null', () => {
      const refs = createPopulatedRefs();
      refs.titleRef.current = null as unknown as HTMLHeadingElement;
      renderHook(() => useAboutAnimation(refs));
      expect(gsap.matchMedia).not.toHaveBeenCalled();
    });

    it('Then it should bail out when windowRef is null', () => {
      const refs = createPopulatedRefs();
      refs.windowRef.current = null as unknown as HTMLDivElement;
      renderHook(() => useAboutAnimation(refs));
      expect(gsap.matchMedia).not.toHaveBeenCalled();
    });

    it('Then it should bail out when innerRef is null', () => {
      const refs = createPopulatedRefs();
      refs.innerRef.current = null as unknown as HTMLDivElement;
      renderHook(() => useAboutAnimation(refs));
      expect(gsap.matchMedia).not.toHaveBeenCalled();
    });

    it('Then it should bail out when lastChapterRef is null', () => {
      const refs = createPopulatedRefs();
      refs.lastChapterRef.current = null as unknown as HTMLDivElement;
      renderHook(() => useAboutAnimation(refs));
      expect(gsap.matchMedia).not.toHaveBeenCalled();
    });
  });

  describe('When all refs are populated', () => {
    it('Then it should create gsap.matchMedia with desktop and mobile queries', () => {
      renderHook(() => useAboutAnimation(createPopulatedRefs()));
      expect(gsap.matchMedia).toHaveBeenCalled();
      expect(capturedMediaCallbacks.has('(min-width: 1024px)')).toBe(true);
      expect(capturedMediaCallbacks.has('(max-width: 1023px)')).toBe(true);
    });
  });

  describe('When the desktop media query callback fires', () => {
    it('Then it should set title centering transforms', () => {
      renderHook(() => useAboutAnimation(createPopulatedRefs()));
      capturedMediaCallbacks.get('(min-width: 1024px)')!();
      expect(gsap.set).toHaveBeenCalledWith(expect.anything(), { xPercent: -50, yPercent: -50 });
    });

    it('Then it should create a pinned ScrollTrigger timeline', () => {
      renderHook(() => useAboutAnimation(createPopulatedRefs()));
      capturedMediaCallbacks.get('(min-width: 1024px)')!();
      expect(gsap.timeline).toHaveBeenCalledWith(
        expect.objectContaining({
          scrollTrigger: expect.objectContaining({ pin: true, scrub: 1, anticipatePin: 1 })
        })
      );
    });

    it('Then the timeline should animate title and inner content', () => {
      renderHook(() => useAboutAnimation(createPopulatedRefs()));
      capturedMediaCallbacks.get('(min-width: 1024px)')!();
      expect(mockTimeline.fromTo).toHaveBeenCalledTimes(2);
    });

    it('Then it should calculate moveX dynamically from DOM measurements', () => {
      const refs = createPopulatedRefs();
      renderHook(() => useAboutAnimation(refs));
      capturedMediaCallbacks.get('(min-width: 1024px)')!();
      const expectedMoveX = 840 / 2 - 1400 / 2;
      const titleFromTo = mockTimeline.fromTo.mock.calls[0];
      expect(titleFromTo[2]).toEqual(expect.objectContaining({ x: expectedMoveX }));
    });

    it('Then contentDuration should be at least 2', () => {
      const refs = createPopulatedRefs();
      (refs.lastChapterRef.current as unknown as Record<string, number>).offsetTop = 0;
      (refs.lastChapterRef.current as unknown as Record<string, number>).offsetHeight = 10;
      renderHook(() => useAboutAnimation(refs));
      capturedMediaCallbacks.get('(min-width: 1024px)')!();
      expect(gsap.timeline).toHaveBeenCalledWith(
        expect.objectContaining({ scrollTrigger: expect.objectContaining({ end: expect.stringMatching(/^\+=\d+%$/) }) })
      );
    });
  });

  describe('When the mobile media query callback fires', () => {
    it('Then it should animate the title with a fade-in', () => {
      renderHook(() => useAboutAnimation(createPopulatedRefs()));
      capturedMediaCallbacks.get('(max-width: 1023px)')!();
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ y: 50, opacity: 0, scale: 0.9 }),
        expect.objectContaining({ y: 0, opacity: 1, scale: 1, scrollTrigger: expect.any(Object) })
      );
    });

    it('Then it should animate chapter elements with stagger', () => {
      const refs = createPopulatedRefs();
      renderHook(() => useAboutAnimation(refs));
      capturedMediaCallbacks.get('(max-width: 1023px)')!();
      const chapter = refs.chapterRefs.current[0] as unknown as { querySelectorAll: ReturnType<typeof vi.fn> };
      expect(chapter.querySelectorAll).toHaveBeenCalledWith('[data-animate]');
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ y: 60, opacity: 0 }),
        expect.objectContaining({ stagger: 0.12, scrollTrigger: expect.any(Object) })
      );
    });

    it('Then it should skip null chapters in the array', () => {
      const refs = createPopulatedRefs();
      refs.chapterRefs.current = [null as unknown as HTMLDivElement];
      renderHook(() => useAboutAnimation(refs));
      capturedMediaCallbacks.get('(max-width: 1023px)')!();
      expect(gsap.fromTo).toHaveBeenCalledTimes(1);
    });
  });
});
