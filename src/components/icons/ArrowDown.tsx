import { forwardRef, type Ref, type SVGProps } from 'react';

export const SvgArrowDown = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" ref={ref} {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12 5v14m0 0-6-6m6 6 6-6"
    />
  </svg>
));
