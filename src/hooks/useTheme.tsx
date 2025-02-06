import { useContext } from 'react';
import { type ThemeContextProps, ThemeContext } from '../contexts/theme/context';

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
