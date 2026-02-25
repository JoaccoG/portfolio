import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  xs: 480, // mobile
  sm: 768, // tablet
  md: 1024, // laptop
  lg: 1280, // small desktop
  xl: 1440 // large desktop
} as const;

export type Breakpoint = 'base' | keyof typeof BREAKPOINTS;

export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>>;

export type ResponsiveStyles = {
  [K in keyof React.CSSProperties]: React.CSSProperties[K] | ResponsiveValue<React.CSSProperties[K]>;
};

export const useBreakpoint = () => {
  const isXs = useMediaQuery(`(min-width: ${BREAKPOINTS.xs}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);

  const getBreakpoint = (): Breakpoint => {
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    if (isXs) return 'xs';

    return 'base';
  };

  const breakpoint = getBreakpoint();

  function resolve(styles: ResponsiveStyles): React.CSSProperties;
  function resolve<T>(value: ResponsiveValue<T>, fallback: T): T;
  function resolve<T>(input: ResponsiveStyles | ResponsiveValue<T>, fallback?: T): React.CSSProperties | T {
    if (fallback !== undefined) return resolveResponsiveValue(input as ResponsiveValue<T>, breakpoint) ?? fallback;

    return resolveStyles(input as ResponsiveStyles, breakpoint);
  }

  return { breakpoint, resolve };
};

const BREAKPOINT_ORDER: Breakpoint[] = ['base', 'xs', 'sm', 'md', 'lg', 'xl'];

const useMediaQuery = (query: string): boolean => {
  const [isMatch, setIsMatch] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsMatch(e.matches);

    mediaQuery.addEventListener('change', onChange);
    setIsMatch(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return isMatch;
};

const isResponsiveValue = (value: unknown): value is ResponsiveValue<unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const resolveResponsiveValue = <T>(map: ResponsiveValue<T>, breakpoint: Breakpoint): T | undefined => {
  const index = BREAKPOINT_ORDER.indexOf(breakpoint);

  for (let i = index; i >= 0; i--) {
    const value = map[BREAKPOINT_ORDER[i]];
    if (value !== undefined) return value;
  }

  return undefined;
};

const resolveStyles = (styles: ResponsiveStyles, breakpoint: Breakpoint): React.CSSProperties =>
  Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [
      key,
      isResponsiveValue(value) ? resolveResponsiveValue(value, breakpoint) : value
    ])
  ) as React.CSSProperties;
