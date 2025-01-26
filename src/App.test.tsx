import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './App';

describe('Given App', (): void => {
  test('Then it should render', (): void => {
    render(<App />);
    expect(screen.getByText('Joaquin Godoy')).toBeInTheDocument();
  });
});
