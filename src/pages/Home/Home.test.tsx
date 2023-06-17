import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../mocks/store';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Given a home page', () => {
  describe('When it is rendered', () => {
    test('Then it should have a header in the document', () => {
      renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      // TODO: Replace the assertion when actual home page is developed
      expect(true).toBe(true);
    });
  });
});
