import { forwardRef, type Ref, type SVGProps } from 'react';

export const SvgSuccess = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" ref={ref} {...props}>
    <path
      d="M8 35 L23 50 L56 17"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
));
