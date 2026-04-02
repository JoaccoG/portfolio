import { renderHook } from '@testing-library/react';
import { useStableViewport } from './useStableViewport';

const getProperty = () => document.documentElement.style.getPropertyValue('--stable-vh');

describe('Given the useStableViewport hook', () => {
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    document.documentElement.style.removeProperty('--stable-vh');
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
  });

  describe('When mounted', () => {
    it('Then it should set --stable-vh to window.innerHeight', () => {
      Object.defineProperty(window, 'innerHeight', { value: 852, writable: true });
      renderHook(() => useStableViewport());
      expect(getProperty()).toBe('852px');
    });
  });

  describe('When orientation changes', () => {
    it('Then it should update --stable-vh with the new height', () => {
      const listeners = new Map<string, EventListener>();
      const mockMql = {
        addEventListener: vi.fn((_: string, cb: EventListener) => listeners.set('change', cb)),
        removeEventListener: vi.fn()
      };
      Object.defineProperty(window, 'matchMedia', { value: () => mockMql, writable: true });

      Object.defineProperty(window, 'innerHeight', { value: 852, writable: true });
      renderHook(() => useStableViewport());
      expect(getProperty()).toBe('852px');

      Object.defineProperty(window, 'innerHeight', { value: 393, writable: true });
      listeners.get('change')!(new Event('change'));
      expect(getProperty()).toBe('393px');
    });
  });

  describe('When unmounted', () => {
    it('Then it should remove the orientation change listener', () => {
      const mockMql = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };
      Object.defineProperty(window, 'matchMedia', { value: () => mockMql, writable: true });

      const { unmount } = renderHook(() => useStableViewport());
      unmount();

      expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('When matchMedia is not available', () => {
    it('Then it should still set --stable-vh but skip the listener', () => {
      const original = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', { value: undefined, writable: true });

      Object.defineProperty(window, 'innerHeight', { value: 700, writable: true });
      const { unmount } = renderHook(() => useStableViewport());
      expect(getProperty()).toBe('700px');
      unmount();

      Object.defineProperty(window, 'matchMedia', { value: original, writable: true });
    });
  });
});
