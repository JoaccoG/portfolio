import { forwardRef, type Ref, type SVGProps } from 'react';

export const SvgX = forwardRef((props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" xmlSpace="preserve" ref={ref} {...props}>
    <path
      d="m24.89 23.01 32.9 43.98h7.45l-32.9-43.98z"
      transform="translate(1.407 1.407)scale(2.81)"
      fill="currentColor"
    />
    <path
      d="M45 0C20.147 0 0 20.147 0 45s20.147 45 45 45 45-20.147 45-45S69.853 0 45 0m11.032 70.504L41.054 50.477 22.516 70.504h-4.765L38.925 47.63 17.884 19.496h16.217L47.895 37.94l17.072-18.444h4.765L50.024 40.788l22.225 29.716z"
      transform="translate(1.407 1.407)scale(2.81)"
      fill="currentColor"
    />
  </svg>
));
