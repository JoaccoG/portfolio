import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../mocks/store';
import Footer from './Footer';

describe('Given a footer component', () => {
  describe('When rendered', () => {
    test('Then there should be a footer element on the document', () => {
      renderWithProviders(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });
});
