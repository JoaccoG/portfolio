import { getParticlesNumber } from './index';

describe('Given a "getParticlesNumber" function', (): void => {
  const originalWindow = { ...globalThis.window };

  beforeEach((): void => {
    globalThis.window = { ...originalWindow };
  });
  afterEach((): void => {
    globalThis.window = { ...originalWindow };
  });

  test('When window is undefined, then it should return the "baseParticles" number', (): void => {
    (globalThis as any).window = undefined;
    expect(getParticlesNumber()).toBe(30);
  });

  test('When the screen size is small, then it should return the minimum number of particles', (): void => {
    globalThis.window.innerWidth = 1;
    globalThis.window.innerHeight = 1;
    expect(getParticlesNumber()).toBe(25);
  });

  test('When the screen size is large, then it should return the maximum number of particles', (): void => {
    globalThis.window.innerWidth = 100000;
    globalThis.window.innerHeight = 100000;
    expect(getParticlesNumber()).toBe(120);
  });
});
