import { fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../mocks/store';
import Header from './Header';

describe('Given a header component', () => {
  describe('When is rendered', () => {
    test('Then there should be a banner element in the document', () => {
      renderWithProviders(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
    });

    test('When the user clicks on a link, then the active className should be added to it.', async () => {
      renderWithProviders(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      await fireEvent.click(screen.getByTestId('home-link'));
      expect(screen.getByTestId('home-link')).toHaveClass('active');

      expect(screen.getByTestId('about-link')).not.toHaveClass('active');
      await fireEvent.click(screen.getByTestId('about-link'));
      expect(screen.getByTestId('home-link')).not.toHaveClass('active');
      expect(screen.getByTestId('about-link')).toHaveClass('active');

      expect(screen.getByTestId('skills-link')).not.toHaveClass('active');
      await fireEvent.click(screen.getByTestId('skills-link'));
      expect(screen.getByTestId('skills-link')).toHaveClass('active');

      expect(screen.getByTestId('projects-link')).not.toHaveClass('active');
      await fireEvent.click(screen.getByTestId('projects-link'));
      expect(screen.getByTestId('projects-link')).toHaveClass('active');

      expect(screen.getByTestId('contact-link')).not.toHaveClass('active');
      await fireEvent.click(screen.getByTestId('contact-link'));
      expect(screen.getByTestId('contact-link')).toHaveClass('active');
    });
  });
});
