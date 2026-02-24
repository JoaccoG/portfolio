import '@testing-library/jest-dom';
import { vi, afterAll, beforeAll } from 'vitest';

const originalConsole = { ...console };

beforeAll(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
  console.info = vi.fn();
  console.debug = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
});

vi.mock('./src/lib/analytics', () => ({
  loadUmami: vi.fn(),
  track: vi.fn()
}));

vi.mock('./src/hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: 'base',
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));
