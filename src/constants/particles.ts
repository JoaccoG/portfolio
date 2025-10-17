export const PARTICLES_CONFIG = Object.freeze({
  MIN_PARTICLES: 25,
  MAX_PARTICLES: 120,
  BASE_PARTICLES: 30,
  BASE_WIDTH: 1280,
  BASE_HEIGHT: 720,

  getAmountOfParticles(): number {
    if (typeof globalThis.window === 'undefined') return this.BASE_PARTICLES;

    const width = globalThis.window.innerWidth ?? this.BASE_WIDTH;
    const height = globalThis.window.innerHeight ?? this.BASE_HEIGHT;
    const area = (width * height) / (this.BASE_WIDTH * this.BASE_HEIGHT);

    return Math.min(this.MAX_PARTICLES, Math.max(this.MIN_PARTICLES, Math.round(this.BASE_PARTICLES * area)));
  }
});
