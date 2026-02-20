import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('./src/lib/analytics', () => ({
  loadUmami: vi.fn(),
  track: vi.fn()
}));
