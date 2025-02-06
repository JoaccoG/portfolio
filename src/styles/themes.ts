import type { Theme } from '../types/theme';

export const themes: Record<string, Theme> = {
  dark: {
    primary: '#ff8a65',
    secondary: '#ffcc80',
    background: '#090807',
    'neutral-white': '#f2ebe3',
    'neutral-dark-gray': '#383838',
    'neutral-light-gray': '#757575',
    'accent-red': '#c62828',
    'accent-brown': '#a67b5b',
    'accent-olive': '#6d8b74',
    'accent-copper': '#1f1010'
  },
  // TODO: Add light theme colors
  light: {
    primary: '#ffffff',
    secondary: '',
    background: '',
    'neutral-white': '',
    'neutral-dark-gray': '',
    'neutral-light-gray': '',
    'accent-red': '',
    'accent-brown': '',
    'accent-olive': '',
    'accent-copper': ''
  }
};
