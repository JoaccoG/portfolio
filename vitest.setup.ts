import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
