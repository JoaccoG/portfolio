import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithMemoryRouter } from '@utils/tests';
import { App } from './App';

describe('Given an "App" component', () => {
  describe('When it is rendered', () => {
    test('Then it should display the main layout components', () => {
      renderWithMemoryRouter(<App />);
      expect(screen.getByTestId('Logo')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('When navigating to different routes', () => {
    test('Then it should render different page components without errors', () => {
      ['/', '/about', '/work', '/blog', '/contact'].forEach((route) => {
        const { unmount } = renderWithMemoryRouter(<App />, { initialEntries: [route] });
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByTestId('Logo')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('When navigating to a non-existent route', () => {
    test('Then it should display an error page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/non-existent-route'] });
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('Logo')).toBeInTheDocument();
    });
  });

  describe('When using navigation links', () => {
    test('Then it should navigate between pages correctly', async () => {
      const user = userEvent.setup();
      renderWithMemoryRouter(<App />);
      const navigationLinks = screen.getAllByRole('link');
      expect(navigationLinks.length).toBeGreaterThan(0);
      for (const link of navigationLinks) {
        await user.click(link);
        expect(screen.getByRole('main')).toBeInTheDocument();
      }
    });
  });

  describe('When the app loads', () => {
    test('Then it should maintain consistent layout across all routes', () => {
      ['/', '/about', '/work', '/blog', '/contact'].forEach((route) => {
        const { unmount } = renderWithMemoryRouter(<App />, { initialEntries: [route] });
        expect(screen.getByTestId('Logo')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
        unmount();
      });
    });
  });
});
