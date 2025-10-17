import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithMemoryRouter } from '@utils/tests';
import { Header } from '@components/Header/Header';

describe('Given a "Header" component', () => {
  describe('When it is rendered', () => {
    test('Then it should display the logo', () => {
      renderWithMemoryRouter(<Header />);
      expect(screen.getByText('Joaquín Godoy')).toBeInTheDocument();
    });

    test('Then it should display all navigation items', () => {
      renderWithMemoryRouter(<Header />);
      expect(screen.getByTestId('Home')).toBeInTheDocument();
      expect(screen.getByTestId('About')).toBeInTheDocument();
      expect(screen.getByTestId('Work')).toBeInTheDocument();
      expect(screen.getByTestId('Blog')).toBeInTheDocument();
    });

    test('Then it should have the correct navigation numbers', () => {
      renderWithMemoryRouter(<Header />);
      expect(screen.getByText('01.')).toBeInTheDocument();
      expect(screen.getByText('02.')).toBeInTheDocument();
      expect(screen.getByText('03.')).toBeInTheDocument();
      expect(screen.getByText('04.')).toBeInTheDocument();
    });
  });

  describe('When the hamburger menu is clicked', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
    });

    test('Then the navigation menu should open', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(screen.getByTestId('header-overlay')).toBeInTheDocument());
    });

    test('Then the body overflow should be hidden', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    });

    test('Then the hamburger animation should change', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => {
        const lines = hamburgerButton.querySelectorAll('div');
        expect(lines[0]).toHaveStyle('transform: rotate(45deg) translate(10px, 5px)');
        expect(lines[1]).toHaveStyle('transform: translateX(48px)');
        expect(lines[1]).toHaveStyle('opacity: 0');
        expect(lines[2]).toHaveStyle('transform: rotate(-45deg) translate(10px, -5px)');
      });
    });
  });

  describe('When the overlay is clicked', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
    });

    test('Then the navigation menu should close', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(screen.getByTestId('header-overlay')).toBeInTheDocument());
      const overlay = screen.getByTestId('header-overlay');
      fireEvent.click(overlay);
      await waitFor(() => expect(screen.queryByTestId('header-overlay')).not.toBeInTheDocument());
    });

    test('Then the body overflow should be restored', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
      const overlay = screen.getByTestId('header-overlay');
      fireEvent.click(overlay);
      await waitFor(() => expect(document.body.style.overflow).toBe(''));
    });
  });

  describe('When a navigation link is clicked', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
    });

    test('Then the navigation menu should close', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(screen.getByTestId('header-overlay')).toBeInTheDocument());
      const homeLink = screen.getByTestId('Home');
      fireEvent.click(homeLink);
      await waitFor(() => expect(screen.queryByTestId('header-overlay')).not.toBeInTheDocument());
    });

    test('Then the body overflow should be restored', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
      const aboutLink = screen.getByTestId('About');
      fireEvent.click(aboutLink);
      await waitFor(() => expect(document.body.style.overflow).toBe(''));
    });
  });

  describe('When the logo is clicked', () => {
    test('Then the navigation menu should close if open', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(screen.getByTestId('header-overlay')).toBeInTheDocument());
      const logo = screen.getByTestId('Logo');
      fireEvent.click(logo);
      await waitFor(() => expect(screen.queryByTestId('header-overlay')).not.toBeInTheDocument());
    });
  });

  describe('When scrolling down', () => {
    test('Then the header should hide when scrolled past 80px', async () => {
      renderWithMemoryRouter(<Header />);
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
      await waitFor(() => expect(screen.getByRole('banner')).toHaveStyle('transform: translateY(-100%)'));
    });

    test('Then the header should have scrolled state when scrolled past 16px', async () => {
      renderWithMemoryRouter(<Header />);
      Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
      fireEvent.scroll(window);
      await waitFor(() => expect(screen.getByRole('banner')).toHaveStyle('transform: translateY(0)'));
    });
  });

  describe('When scrolling back up', () => {
    test('Then the header should be visible again', async () => {
      renderWithMemoryRouter(<Header />);
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
      await waitFor(() => expect(screen.getByRole('banner')).toHaveStyle('transform: translateY(-100%)'));
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);
      await waitFor(() => expect(screen.getByRole('banner')).toHaveStyle('transform: translateY(0)'));
    });
  });

  describe('When hovering over navigation links', () => {
    test('Then the link color should change to white', async () => {
      renderWithMemoryRouter(<Header />);
      const homeLink = screen.getByTestId('Home');
      fireEvent.mouseEnter(homeLink);
      await waitFor(() => expect(homeLink).toHaveStyle('color: var(--color-neutral-white)'));
    });

    test('Then the link color should return to gray when not active', async () => {
      renderWithMemoryRouter(<Header />);
      const aboutLink = screen.getByTestId('About');
      fireEvent.mouseEnter(aboutLink);
      fireEvent.mouseLeave(aboutLink);
      await waitFor(() => expect(aboutLink).toHaveStyle('color: var(--color-neutral-light-gray)'));
    });
  });

  describe('When hovering over the logo', () => {
    test('Then the logo should be interactive', () => {
      renderWithMemoryRouter(<Header />);
      const logo = screen.getByTestId('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveStyle('background-size: 300% 100%');
    });

    test('Then the logo should maintain its styling', () => {
      renderWithMemoryRouter(<Header />);
      const logo = screen.getByTestId('Logo');
      fireEvent.mouseEnter(logo);
      fireEvent.mouseLeave(logo);
      expect(logo).toHaveStyle('background-size: 300% 100%');
    });
  });

  describe('When on the home route', () => {
    test('Then the home link should have active styling', async () => {
      renderWithMemoryRouter(<Header />, { initialEntries: ['/'] });
      await waitFor(() => expect(screen.getByTestId('Home')).toHaveStyle('color: var(--color-neutral-white)'));
    });

    test('Then the home link should maintain white color on hover leave', async () => {
      renderWithMemoryRouter(<Header />, { initialEntries: ['/'] });
      const homeLink = screen.getByTestId('Home');
      fireEvent.mouseEnter(homeLink);
      fireEvent.mouseLeave(homeLink);
      await waitFor(() => expect(homeLink).toHaveStyle('color: var(--color-neutral-white)'));
    });
  });

  describe('When the window is resized to desktop width', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
    });

    test('Then the navigation menu should close if it was open', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(screen.getByTestId('header-overlay')).toBeInTheDocument());
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      fireEvent.resize(window);
      await waitFor(() => expect(screen.queryByTestId('header-overlay')).not.toBeInTheDocument());
    });

    test('Then the body overflow should be restored', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      fireEvent.resize(window);
      await waitFor(() => expect(document.body.style.overflow).toBe(''));
    });

    test('Then the hamburger animation should reset', async () => {
      renderWithMemoryRouter(<Header />);
      const hamburgerButton = screen.getByLabelText('Toggle navigation menu');
      fireEvent.click(hamburgerButton);
      await waitFor(() => {
        const lines = hamburgerButton.querySelectorAll('div');
        expect(lines[0]).toHaveStyle('transform: rotate(45deg) translate(10px, 5px)');
        expect(lines[1]).toHaveStyle('opacity: 0');
        expect(lines[2]).toHaveStyle('transform: rotate(-45deg) translate(10px, -5px)');
      });
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      fireEvent.resize(window);
      await waitFor(() => {
        const lines = hamburgerButton.querySelectorAll('div');
        expect(lines[0]).toHaveStyle('transform: rotate(0)');
        expect(lines[1]).toHaveStyle('opacity: 1');
        expect(lines[1]).toHaveStyle('transform: translateX(0)');
        expect(lines[2]).toHaveStyle('transform: rotate(0)');
      });
    });
  });
});
