'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { type Theme, light, dark } from './theme';

const StyledThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(dark);

  useEffect((): VoidFunction => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light;
    setTheme(preferredTheme);

    const handleThemeChange = (e: MediaQueryListEvent): void => {
      if (e.matches) {
        setTheme(dark);
      } else {
        setTheme(light);
      }
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);

    return (): void => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
    };
  }, []);

  const toggleTheme = (): void => {
    setTheme(theme === light ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      {children}
      <button onClick={toggleTheme}>Toggle Theme</button>
    </ThemeProvider>
  );
};

export default StyledThemeProvider;
