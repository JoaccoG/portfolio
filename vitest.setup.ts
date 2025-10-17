import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach((): void => {
  vi.clearAllMocks();
});

afterEach((): void => {
  cleanup();
});

beforeAll((): void => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      media: query,
      matches: false,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });

  global.IntersectionObserver = vi.fn().mockImplementation((_, options) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: options?.root || null,
    rootMargin: options?.rootMargin || '0px',
    thresholds: options?.thresholds || [0]
  }));
});

afterAll((): void => {
  vi.restoreAllMocks();
});
