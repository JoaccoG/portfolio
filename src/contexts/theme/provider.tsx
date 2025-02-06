import { FC, ReactNode, useState, useMemo } from 'react';
import { ThemeProvider as ThemeProviderStyledComponents } from 'styled-components';
import { GlobalStyles } from '../../styles/globals';
import { themes } from '../../styles/themes';
import { ThemeContext, ThemeContextProps } from './context';
import { Theme } from '../../types/theme';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(themes.dark);

  const toggleTheme = (newTheme: keyof typeof themes): void => {
    if (themes[newTheme]) setTheme(themes[newTheme]);
    else throw new Error(`Theme '${newTheme}' does not exist`);
  };

  const value = useMemo((): ThemeContextProps => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProviderStyledComponents theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProviderStyledComponents>
    </ThemeContext.Provider>
  );
};
