import { renderHook, act } from '@testing-library/react';
import { mockMatchMedia } from '@test/helpers/media';
import { useBreakpoint } from './useBreakpoint';

vi.unmock('@hooks/useBreakpoint');

const BP_QUERIES = {
  xs: '(min-width: 480px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 1024px)',
  lg: '(min-width: 1280px)',
  xl: '(min-width: 1440px)'
};

const allFalse = () => ({
  [BP_QUERIES.xs]: false,
  [BP_QUERIES.sm]: false,
  [BP_QUERIES.md]: false,
  [BP_QUERIES.lg]: false,
  [BP_QUERIES.xl]: false
});

const matchUpTo = (bp: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const order = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  const index = order.indexOf(bp);
  const matches = allFalse();

  for (let i = 0; i <= index; i++) matches[BP_QUERIES[order[i]]] = true;

  return matches;
};

describe('Given the useBreakpoint hook', () => {
  describe('When the viewport matches different breakpoints', () => {
    it('If no queries match, then it should return base', () => {
      mockMatchMedia(allFalse());
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('base');
    });

    it('If only xs matches, then it should return xs', () => {
      mockMatchMedia({ ...allFalse(), [BP_QUERIES.xs]: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('xs');
    });

    it('If up to sm matches, then it should return sm', () => {
      mockMatchMedia(matchUpTo('sm'));
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('sm');
    });

    it('If up to md matches, then it should return md', () => {
      mockMatchMedia(matchUpTo('md'));
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('md');
    });

    it('If up to lg matches, then it should return lg', () => {
      mockMatchMedia(matchUpTo('lg'));
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('lg');
    });

    it('If all queries match, then it should return xl', () => {
      mockMatchMedia(matchUpTo('xl'));
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('xl');
    });
  });

  describe('When matchMedia fires a change event', () => {
    it('Then it should update the breakpoint', () => {
      const { triggerChange } = mockMatchMedia(allFalse());
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.breakpoint).toBe('base');
      act(() => triggerChange(BP_QUERIES.xs, true));
      expect(result.current.breakpoint).toBe('xs');
    });
  });

  describe('When resolve() is called with ResponsiveStyles', () => {
    it('Then it should resolve each property to the active breakpoint value', () => {
      mockMatchMedia(matchUpTo('md'));
      const { result } = renderHook(() => useBreakpoint());
      const resolved = result.current.resolve({ fontSize: { base: '12px', md: '24px', xl: '48px' }, color: 'red' });
      expect(resolved).toEqual({ fontSize: '24px', color: 'red' });
    });

    it('Then it should fall back mobile-first to the nearest smaller breakpoint', () => {
      mockMatchMedia(matchUpTo('lg'));
      const { result } = renderHook(() => useBreakpoint());
      const resolved = result.current.resolve({ fontSize: { base: '12px', sm: '18px' } });
      expect(resolved).toEqual({ fontSize: '18px' });
    });

    it('If no breakpoint value is defined, then it should resolve to undefined', () => {
      mockMatchMedia(allFalse());
      const { result } = renderHook(() => useBreakpoint());
      const resolved = result.current.resolve({ fontSize: { md: '24px' } });
      expect(resolved).toEqual({ fontSize: undefined });
    });
  });

  describe('When resolve() is called with ResponsiveValue and fallback', () => {
    it('Then it should return the value for the current breakpoint', () => {
      mockMatchMedia(matchUpTo('md'));
      const { result } = renderHook(() => useBreakpoint());
      const value = result.current.resolve({ base: 10, md: 30 }, 0);
      expect(value).toBe(30);
    });

    it('Then it should fall back to the nearest smaller breakpoint', () => {
      mockMatchMedia(matchUpTo('lg'));
      const { result } = renderHook(() => useBreakpoint());
      const value = result.current.resolve({ base: 10, sm: 20 }, 0);
      expect(value).toBe(20);
    });

    it('If no breakpoint matches, then it should return the fallback', () => {
      mockMatchMedia(allFalse());
      const { result } = renderHook(() => useBreakpoint());
      const value = result.current.resolve({ md: 30 }, 99);
      expect(value).toBe(99);
    });

    it('Then it should return base value when at base breakpoint', () => {
      mockMatchMedia(allFalse());
      const { result } = renderHook(() => useBreakpoint());
      const value = result.current.resolve({ base: 5 }, 99);
      expect(value).toBe(5);
    });
  });
});
