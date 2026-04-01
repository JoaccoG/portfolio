import { useState, useEffect, useCallback, type RefObject } from 'react';

const IDLE_DELAY_MS = 1000;
const FIRST_APPEARANCE_DELAY_MS = 5000;

interface UseScrollHintRefs {
  sectionRef: RefObject<HTMLElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
}

export const useScrollHint = ({ sectionRef, innerRef }: UseScrollHintRefs) => {
  const [isScrollIdle, setIsScrollIdle] = useState(false);
  const [isInHero, setIsInHero] = useState(false);
  const [isInSection, setIsInSection] = useState(false);
  const [isChaptersVisible, setIsChaptersVisible] = useState(false);

  const checkVisibility = useCallback(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const hero = document.getElementById('hero');

    const vh = window.innerHeight;

    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      setIsInHero(heroRect.top < vh && heroRect.bottom > 0);
    }

    if (!section || !inner) return;

    const sectionRect = section.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();

    setIsInSection(sectionRect.top < vh && sectionRect.bottom > 0);
    setIsChaptersVisible(innerRect.top < vh);
  }, [sectionRef, innerRef]);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdle = () => {
      setIsScrollIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsScrollIdle(true), IDLE_DELAY_MS);
    };

    const onScroll = () => {
      checkVisibility();
      resetIdle();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    checkVisibility();
    idleTimer = setTimeout(() => setIsScrollIdle(true), FIRST_APPEARANCE_DELAY_MS);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
    };
  }, [checkVisibility]);

  const isEligible = isInHero || (isInSection && !isChaptersVisible);

  return { showHint: isEligible && isScrollIdle };
};
