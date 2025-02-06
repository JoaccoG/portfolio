import { createGlobalStyle } from 'styled-components';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/300-italic.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/inter/600-italic.css';
import '@fontsource/inter/700-italic.css';
import '@fontsource/fira-code/300.css';
import '@fontsource/fira-code/400.css';
import '@fontsource/fira-code/500.css';
import '@fontsource/fira-code/600.css';
import '@fontsource/fira-code/700.css';

export const GlobalStyles = createGlobalStyle`
:root {
  /* Colors */
  --color-primary: ${({ theme }): string => theme['primary']};
  --color-secondary: ${({ theme }): string => theme['secondary']};
  --color-background: ${({ theme }): string => theme['background']};
  --color-neutral-white: ${({ theme }): string => theme['neutral-white']};
  --color-neutral-dark-gray: ${({ theme }): string => theme['neutral-dark-gray']};
  --color-neutral-light-gray: ${({ theme }): string => theme['neutral-light-gray']};
  --color-accent-red: ${({ theme }): string => theme['accent-red']};
  --color-accent-brown: ${({ theme }): string => theme['accent-brown']};
  --color-accent-olive: ${({ theme }): string => theme['accent-olive']};
  --color-accent-copper: ${({ theme }): string => theme['accent-copper']};

  /* Margins */
  --margin-xxxs: 0.25rem;
  --margin-xxs: 0.5rem;
  --margin-xs: 0.75rem;
  --margin-s: 1rem;
  --margin-m: 1.5rem;
  --margin-l: 2rem;
  --margin-xl: 2.5rem;
  --margin-xxl: 3rem;
  --margin-xxxl: 4rem;

  /* Paddings */
  --padding-xxxs: 0.25rem;
  --padding-xxs: 0.5rem;
  --padding-xs: 0.75rem;
  --padding-s: 1rem;
  --padding-m: 1.5rem;
  --padding-l: 2rem;
  --padding-xl: 2.5rem;
  --padding-xxl: 3rem;
  --padding-xxxl: 4rem;

  /* Font families */
  --font-family-inter: 'Inter', 'Helvetica', 'Arial', sans-serif;
  --font-family-fira-code: 'Fira Code', 'Courier', 'Courier New', monospace;

  /* Font sizes */
  --font-size-xxxs: 0.5rem;
  --font-size-xxs: 0.75rem;
  --font-size-xs: 0.875rem;
  --font-size-s: 1rem;
  --font-size-m: 1.125rem;
  --font-size-l: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-xxl: 2rem;
  --font-size-xxxl: 2.5rem;

  /* Font weights */
  --font-weight-thin: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --font-weight-black: 700;

  /* Border radius */
  --border-radius-xs: 8px;
  --border-radius-s: 16px;
  --border-radius-m: 24px;
  --border-radius-l: 32px;
  --border-radius-xl: 64px;
  --border-radius-none: 0;
  --border-radius-round: 50%;

  /* Transitions */
  --transition-fastest: 0.1s;
  --transition-faster: 0.15s;
  --transition-fast: 0.2s;
  --transition-medium: 0.3s;
  --transition-slow: 0.4s;
  --transition-slower: 0.6s;
  --transition-slowest: 0.8s;

  /* Z indexes */
  --z-index-100: 100;
  --z-index-200: 200;
  --z-index-300: 300;
  --z-index-400: 400;
  --z-index-500: 500;
  --z-index-negative: -1;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  color: var(--color-neutral-light-gray);
  outline: none;
  caret-color: transparent;
  font-family: var(--font-family-inter);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  #particlesComponent {
    position: absolute;
    z-index: var(--z-index-negative);
  }
}

main {
  margin: calc(64px + 16px) 0 32px 0;
  min-height: calc(100vh - (64px + 16px));

  @media screen and (min-width: 768px) {
    margin: calc(80px + 16px) 0 32px 0;
    min-height: calc(100vh - (80px + 16px));
  }
}

img,
picture,
video,
canvas {
  max-width: 100%;
  height: auto;
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
}
`;
