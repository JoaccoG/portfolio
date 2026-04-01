import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { SvgIcon } from '@components/icons';

interface ScrollHintProps {
  isVisible: boolean;
}

export const ScrollHint = ({ isVisible }: ScrollHintProps) => {
  const { resolve } = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const prevIsVisibleRef = useRef(isVisible);

  useGSAP(
    () => {
      if (!arrowRef.current) return;
      gsap.to(arrowRef.current, { y: 7, duration: 0.7, ease: 'power1.inOut', yoyo: true, repeat: -1 });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const wasVisible = prevIsVisibleRef.current;
    prevIsVisibleRef.current = isVisible;

    const duration = wasVisible && !isVisible ? 0.1 : 0.25;

    const tween = gsap.to(containerRef.current, {
      opacity: isVisible ? 1 : 0,
      duration,
      ease: 'power2.inOut',
      overwrite: true
    });

    return () => {
      tween.kill();
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} style={resolve(containerStyle)}>
      <span style={resolve(labelStyle)}>Scroll</span>
      <SvgIcon icon="arrowDown" ref={arrowRef} style={resolve(arrowStyle)} />
    </div>
  );
};

const containerStyle: ResponsiveStyles = {
  position: 'fixed',
  bottom: '2.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  opacity: 0,
  pointerEvents: 'none',
  zIndex: 50
};

const labelStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: 'var(--color-light-gray)'
};

const arrowStyle: ResponsiveStyles = {
  width: '1.25rem',
  height: '1.25rem',
  color: 'var(--color-primary)'
};
