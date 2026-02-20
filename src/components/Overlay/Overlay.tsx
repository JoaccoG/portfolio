import type { CSSProperties } from 'react';
import { VignetteLayer } from './VignetteLayer';

export const Overlay = () => {
  return <VignetteLayer style={styles.vignette} />;
};

const styles: Record<string, CSSProperties> = {
  vignette: {
    position: 'fixed',
    pointerEvents: 'none',
    inset: 0,
    zIndex: -1,
    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.85) 100%)',
    animation: 'overlayVignettePulse 8s ease-in-out infinite'
  }
};
