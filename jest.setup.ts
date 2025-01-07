import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { renderWithProvider } from './mocks/utils';

declare global {
  // eslint-disable-next-line no-var
  var renderWithProvider: (ui: ReactElement, options?: object) => ReturnType<typeof render>;
}

global.renderWithProvider = renderWithProvider;
