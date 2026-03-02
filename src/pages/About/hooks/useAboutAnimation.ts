import type { RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const TITLE_DURATION = 1.0;
const CONTENT_START = 0.1;
const CONTENT_SPEED = 1000;
const TAIL_PX = 100;

interface UseAboutAnimationRefs {
  sectionRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  windowRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  lastChapterRef: RefObject<HTMLDivElement | null>;
  chapterRefs: RefObject<(HTMLDivElement | null)[]>;
}

export const useAboutAnimation = (refs: UseAboutAnimationRefs) => {
  const { sectionRef, titleRef, windowRef, innerRef, lastChapterRef, chapterRefs } = refs;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const windowEl = windowRef.current;
      const inner = innerRef.current;
      const lastChapter = lastChapterRef.current;
      if (!section || !title || !windowEl || !inner || !lastChapter) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const windowH = windowEl.clientHeight;
        const lastChapterBottom = lastChapter.offsetTop + lastChapter.offsetHeight;
        const contentEndY = windowH - lastChapterBottom - TAIL_PX;
        const contentDuration = Math.max((windowH - contentEndY) / CONTENT_SPEED, 2);
        const total = CONTENT_START + contentDuration;

        const sectionW = section.offsetWidth;
        const leftColumnWidth = windowEl.offsetLeft;
        const moveX = leftColumnWidth / 2 - sectionW / 2;

        gsap.set(title, { xPercent: -50, yPercent: -50 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${Math.round(total * 100)}%`,
              pin: true,
              scrub: 1,
              anticipatePin: 1
            }
          })
          .fromTo(
            title,
            { x: 0, y: '0vh', scale: 1 },
            { x: moveX, y: '-23vh', scale: 0.6, duration: TITLE_DURATION, ease: 'none' },
            0
          )
          .fromTo(inner, { y: windowH }, { y: contentEndY, duration: contentDuration, ease: 'none' }, CONTENT_START);
      });

      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%' }
          }
        );

        chapterRefs.current.forEach((chapter) => {
          if (!chapter) return;

          const elements = chapter.querySelectorAll('[data-animate]');

          gsap.fromTo(
            elements,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: chapter, start: 'top 85%' }
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );
};
