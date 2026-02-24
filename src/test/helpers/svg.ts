import { forwardRef, useRef, useEffect, createElement } from 'react';

interface SvgIconMockOptions {
  testId?: string;
  renderPath?: () => boolean;
}

/**
 * Creates a mock SVG icon component compatible with SVGR-generated icons.
 * Forwards refs to the root <svg> element and polyfills `getTotalLength` on <path> elements for jsdom environments.
 *
 * @param {string} testId - The test ID to use for the SVG icon.
 * @param {Function} renderPath - A function that returns a boolean indicating whether to render the path element.
 *
 * @returns {React.ComponentType<SVGProps<SVGSVGElement>>} A mock SVG icon component.
 */
export const createSvgIconMock = ({ testId = 'svg-icon', renderPath = () => true }: SvgIconMockOptions = {}) =>
  forwardRef((props: React.SVGProps<SVGSVGElement>, ref: React.Ref<SVGSVGElement>) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      if (!svgRef.current) return;
      const path = svgRef.current.querySelector('path');
      if (path && !path.getTotalLength) (path as unknown as Record<string, unknown>).getTotalLength = () => 100;
    }, []);

    useEffect(() => {
      if (!svgRef.current) return;
      if (typeof ref === 'function') ref(svgRef.current);
      else if (ref && typeof ref === 'object') (ref as { current: SVGSVGElement | null }).current = svgRef.current;
    }, [ref]);

    return createElement(
      'svg',
      { ref: svgRef, 'data-testid': testId, ...props },
      renderPath() ? createElement('path', { d: 'M0 0' }) : null
    );
  });
