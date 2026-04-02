import { useEffect } from 'react';

const STABLE_VH_PROPERTY = '--stable-vh';
const ORIENTATION_QUERY = '(orientation: portrait)';

export const useStableViewport = () => {
  useEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty(STABLE_VH_PROPERTY, `${window.innerHeight}px`);
    };

    update();

    if (!window.matchMedia) return;

    const mql = window.matchMedia(ORIENTATION_QUERY);
    mql.addEventListener('change', update);

    return () => mql.removeEventListener('change', update);
  }, []);
};
