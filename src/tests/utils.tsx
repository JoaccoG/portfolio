import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

export const renderWithMemoryRouter = (
  ui: React.ReactElement,
  { initialEntries = ['/'] }: { initialEntries?: string[] } = {}
) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
};
