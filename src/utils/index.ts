export const MIN_PARTICLES = 25;
export const MAX_PARTICLES = 120;
export const BASE_PARTICLES = 30;
export const BASE_WIDTH = 1280;
export const BASE_HEIGHT = 720;

export const getParticlesNumber = (): number => {
  if (typeof window === 'undefined') return BASE_PARTICLES;

  const screenWidth = window?.innerWidth ?? BASE_WIDTH;
  const screenHeight = window?.innerHeight ?? BASE_HEIGHT;
  const area = (screenWidth * screenHeight) / (BASE_WIDTH * BASE_HEIGHT);

  return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(BASE_PARTICLES * area)));
};
