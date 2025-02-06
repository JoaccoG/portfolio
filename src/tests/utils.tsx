import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

/**
 * Renders a component with MemoryRouter to allow testing with React Router.
 *
 * @param ui - The component to render.
 * @param initialEntries (optional) - The initial route to render.
 */
export const renderWithMemoryRouter = (
  ui: React.ReactElement,
  { initialEntries = ['/'] }: { initialEntries?: string[] } = {}
) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
};
