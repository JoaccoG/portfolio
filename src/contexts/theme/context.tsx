import { createContext } from 'react';
import { themes } from '../../styles/themes';
import { Theme } from '../../types/theme';

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: (newTheme: keyof typeof themes) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: themes.dark,
  toggleTheme: (): void => {}
});
