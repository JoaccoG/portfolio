import { forwardRef, type Ref, type SVGProps } from 'react';

export const SvgError = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -0.5 25 25" ref={ref} {...props}>
    <path
      fill="currentColor"
      d="M6.97 16.47a.75.75 0 1 0 1.06 1.06zm6.06-3.94a.75.75 0 1 0-1.06-1.06zm-1.06-1.06a.75.75 0 1 0 1.06 1.06zm6.06-3.94a.75.75 0 0 0-1.06-1.06zm-5 3.94a.75.75 0 1 0-1.06 1.06zm3.94 6.06a.75.75 0 1 0 1.06-1.06zm-5-5a.75.75 0 1 0 1.06-1.06zM8.03 6.47a.75.75 0 0 0-1.06 1.06zm0 11.06 5-5-1.06-1.06-5 5zm5-5 5-5-1.06-1.06-5 5zm-1.06 0 5 5 1.06-1.06-5-5zm1.06-1.06-5-5-1.06 1.06 5 5z"
    />
  </svg>
));
