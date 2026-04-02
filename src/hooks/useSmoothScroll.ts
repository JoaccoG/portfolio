import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const SCROLL_DURATION = 1.2;
const EXPONENTIAL_DECAY = -10;
const FOCUSABLE_INPUTS = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

const exponentialEaseOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, EXPONENTIAL_DECAY * t));

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: SCROLL_DURATION,
      easing: exponentialEaseOut,
      smoothWheel: true
    });

    lenisRef.current = lenis;

    const onScroll = ScrollTrigger.update;
    const tickerFn = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', onScroll);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as Element)?.matches(FOCUSABLE_INPUTS)) lenis.stop();
    };

    const onFocusOut = (e: FocusEvent) => {
      if ((e.target as Element)?.matches(FOCUSABLE_INPUTS)) lenis.start();
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  const scrollTo = useCallback((target: string) => {
    lenisRef.current?.scrollTo(`#${target}`, { offset: 0 });
  }, []);

  return { scrollTo };
};
