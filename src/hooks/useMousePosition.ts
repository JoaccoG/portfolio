import { useState, useEffect, useRef, type RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMousePosition = (containerRef: RefObject<HTMLElement | null>, enabled = true): MousePosition => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      });
    };

    globalThis.addEventListener('mousemove', onMouseMove);

    return () => {
      globalThis.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, enabled]);

  return position;
};
