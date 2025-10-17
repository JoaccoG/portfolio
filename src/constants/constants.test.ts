import { PARTICLES_CONFIG } from '@constants/particles';

describe('Given a "PARTICLES_CONFIG" constant', () => {
  const originalWindow = { ...globalThis.window };

  beforeEach(() => {
    globalThis.window = { ...originalWindow };
  });
  afterEach(() => {
    globalThis.window = { ...originalWindow };
  });

  describe('When window object is undefined', () => {
    test('Then it should return the "BASE_PARTICLES" number', () => {
      (globalThis as any).window = undefined;
      expect(PARTICLES_CONFIG.getAmountOfParticles()).toBe(PARTICLES_CONFIG.BASE_PARTICLES);
    });
  });

  describe('When window properties are undefined', () => {
    test('Then it should use BASE_WIDTH and BASE_HEIGHT dimensions', () => {
      delete (globalThis.window as any).innerWidth;
      delete (globalThis.window as any).innerHeight;
      expect(PARTICLES_CONFIG.getAmountOfParticles()).toBe(PARTICLES_CONFIG.BASE_PARTICLES);
    });
  });

  describe('When the screen is too small', () => {
    test('Then it should return the minimum number of particles', () => {
      globalThis.window.innerWidth = 1;
      globalThis.window.innerHeight = 1;
      expect(PARTICLES_CONFIG.getAmountOfParticles()).toBe(PARTICLES_CONFIG.MIN_PARTICLES);
    });
  });

  describe('When the screen is too big', () => {
    test('Then it should return the maximum number of particles', () => {
      globalThis.window.innerWidth = 100000;
      globalThis.window.innerHeight = 100000;
      expect(PARTICLES_CONFIG.getAmountOfParticles()).toBe(PARTICLES_CONFIG.MAX_PARTICLES);
    });
  });

  describe('When the screen is normal', () => {
    test('Then it should return a proportional number of particles', () => {
      globalThis.window.innerWidth = 1920;
      globalThis.window.innerHeight = 1080;
      const expected = Math.round(30 * ((1920 * 1080) / (1280 * 720)));
      expect(PARTICLES_CONFIG.getAmountOfParticles()).toBe(expected);
    });
  });
});
