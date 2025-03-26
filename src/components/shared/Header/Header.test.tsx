import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithMemoryRouter } from '../../../tests/utils';
import Header from './Header';

beforeAll((): void => {
  vi.spyOn(console, 'error').mockImplementation((): null => null);
});

afterAll((): void => {
  vi.restoreAllMocks();
});

describe('Given a "Header" component', (): void => {
  describe('When it is rendered', () => {
    test('Then it should be in the document', (): void => {
      renderWithMemoryRouter(<Header />);
      expect(screen.getByLabelText('Logo')).toBeInTheDocument();
    });
  });

  describe('When navigating', () => {
    test.each([
      { route: '/', testId: 'Home' },
      { route: '/about', testId: 'About' },
      { route: '/work', testId: 'Work' },
      { route: '/blog', testId: 'Blog' }
    ])('Then "%s" should be active', async ({ route, testId }) => {
      renderWithMemoryRouter(<Header />, { initialEntries: [route] });
      fireEvent.click(screen.getByLabelText('Toggle navigation menu'));
      await waitFor(() => {
        expect(screen.getByTestId(testId)).toHaveClass('active');
      });
    });
  });

  describe('When scrolled down', () => {
    test('Then the header should hide', async (): Promise<void> => {
      renderWithMemoryRouter(<Header />);
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
      await waitFor((): void => {
        expect(screen.getByRole('banner')).toHaveStyle('position: fixed');
        expect(screen.getByRole('banner')).toHaveStyle('transform: translateY(-100%)');
      });
    });
  });

  describe('When scrolled back up', () => {
    test('Then the header should be visible again', (): void => {
      window.innerWidth = 600;
      window.dispatchEvent(new Event('resize'));
      renderWithMemoryRouter(<Header />);
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);
      expect(screen.getByRole('banner')).toBeVisible();
    });
  });
});
