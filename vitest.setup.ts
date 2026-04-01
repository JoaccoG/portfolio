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

vi.mock('./src/hooks/useBreakpoint', () => {
  const resolveResponsiveValue = (value: unknown): unknown => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const map = value as Record<string, unknown>;
      for (const bp of ['base', 'xs', 'sm', 'md', 'lg', 'xl']) {
        if (map[bp] !== undefined) return map[bp];
      }
      return undefined;
    }
    return value;
  };

  return {
    useBreakpoint: () => ({
      breakpoint: 'base' as const,
      resolve: vi.fn((input: unknown, fallback?: unknown) => {
        if (fallback !== undefined) return resolveResponsiveValue(input) ?? fallback;
        if (typeof input !== 'object' || input === null) return {};
        return Object.fromEntries(
          Object.entries(input as Record<string, unknown>).map(([k, v]) => [k, resolveResponsiveValue(v)])
        );
      })
    })
  };
});

vi.mock('./src/components/icons', async () => {
  const { forwardRef, useRef, useEffect, createElement } = await vi.importActual<typeof import('react')>('react');

  return {
    SvgIcon: forwardRef(({ icon }: { icon: string; style?: unknown }, ref: React.Ref<SVGSVGElement>) => {
      const svgRef = useRef<SVGSVGElement>(null);

      useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const path = svg.querySelector('path');
        if (path && !path.getTotalLength) (path as unknown as Record<string, unknown>).getTotalLength = () => 100;
      }, []);

      useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        if (typeof ref === 'function') ref(svg);
        else if (ref && typeof ref === 'object') (ref as { current: SVGSVGElement | null }).current = svg;
      }, [ref]);

      return createElement(
        'div',
        { 'data-testid': `svg-icon-${icon}` },
        createElement('svg', { ref: svgRef }, createElement('path', { d: 'M0 0' }))
      );
    })
  };
});
