import { useContext } from 'react';
import { type ThemeContextProps, ThemeContext } from '../contexts/theme/context';

export const useTheme = (): ThemeContextProps => {
  if (!ThemeContext) throw new Error('useTheme must be used within a ThemeProvider');

  return useContext(ThemeContext);
};
