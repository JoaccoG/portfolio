export const getParticlesNumber = (): number => {
  const baseParticles = 30;

  if (typeof window === 'undefined') return baseParticles;

  const baseWidth = 1280;
  const baseHeight = 720;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const area = (screenWidth * screenHeight) / (baseWidth * baseHeight);

  return Math.min(120, Math.max(25, Math.round(baseParticles * area)));
};
