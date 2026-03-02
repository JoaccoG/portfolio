import { forwardRef } from 'react';

export const BlogUnderline = forwardRef((props: React.SVGProps<SVGSVGElement>, ref: React.Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 140 20" ref={ref} {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M0 14c20-2 45-5 65-7 13-1 21-1.5 27-2-10 3-30 7-46 8.5-6 .5-10 .5-12 .5 18-.5 46-2 70-4 16-1 30-2 36-2.5"
    />
  </svg>
));
