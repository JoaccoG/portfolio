import { renderWithMemoryRouter } from './tests/utils';
import { screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './App';

describe('Given App', (): void => {
  test('Then it should render', (): void => {
    renderWithMemoryRouter(<App />);
    expect(screen.getByText(/Joaquín Godoy/i)).toBeInTheDocument();
  });
});
