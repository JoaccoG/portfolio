import { getParticlesNumber, BASE_PARTICLES, MIN_PARTICLES, MAX_PARTICLES } from './index';

describe('Given a "getParticlesNumber" function', (): void => {
  const originalWindow = { ...globalThis.window };

  beforeEach((): void => {
    globalThis.window = { ...originalWindow };
  });
  afterEach((): void => {
    globalThis.window = { ...originalWindow };
  });

  describe('When window object is undefined', (): void => {
    test('Then it should return the "baseParticles" number', (): void => {
      (globalThis as any).window = undefined;
      expect(getParticlesNumber()).toBe(BASE_PARTICLES);
    });
  });

  describe('When window properties are undefined', (): void => {
    test('Then it should use base dimensions', (): void => {
      delete (globalThis.window as any).innerWidth;
      delete (globalThis.window as any).innerHeight;
      expect(getParticlesNumber()).toBe(BASE_PARTICLES);
    });
  });

  describe('When the screen is small', (): void => {
    test('Then it should return the minimum number of particles', (): void => {
      globalThis.window.innerWidth = 1;
      globalThis.window.innerHeight = 1;
      expect(getParticlesNumber()).toBe(MIN_PARTICLES);
    });
  });

  describe('When the screen is large', (): void => {
    test('Then it should return the maximum number of particles', (): void => {
      globalThis.window.innerWidth = 100000;
      globalThis.window.innerHeight = 100000;
      expect(getParticlesNumber()).toBe(MAX_PARTICLES);
    });
  });

  describe('When the screen is normal', (): void => {
    test('Then it should return a proportional number of particles', (): void => {
      globalThis.window.innerWidth = 1920;
      globalThis.window.innerHeight = 1080;
      const expected = Math.round(30 * ((1920 * 1080) / (1280 * 720)));
      expect(getParticlesNumber()).toBe(expected);
    });
  });
});
