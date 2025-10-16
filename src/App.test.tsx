import { screen } from '@testing-library/react';
import { renderWithMemoryRouter } from '@utils/tests';
import { App } from './App';

describe('Given an "App" component', () => {
  describe('When it is rendered', () => {
    test('Then it should display the header', () => {
      renderWithMemoryRouter(<App />);
      expect(screen.getByTestId('Logo')).toBeInTheDocument();
    });

    test('Then it should display the footer', () => {
      renderWithMemoryRouter(<App />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    test('Then it should display the main content area', () => {
      renderWithMemoryRouter(<App />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('When navigating to the home route', () => {
    test('Then it should display the home page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/'] });
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });
  });

  describe('When navigating to the about route', () => {
    test('Then it should display the about page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/about'] });
      expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    });
  });

  describe('When navigating to the work route', () => {
    test('Then it should display the work page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/work'] });
      expect(screen.getByRole('heading', { name: 'Work' })).toBeInTheDocument();
    });
  });

  describe('When navigating to the blog route', () => {
    test('Then it should display the blog page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/blog'] });
      expect(screen.getByRole('heading', { name: 'Blog' })).toBeInTheDocument();
    });
  });

  describe('When navigating to a specific blog entry', () => {
    test('Then it should display the blog entry page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/blog/my-first-post'] });
      expect(screen.getByRole('heading', { name: 'Blog Entry' })).toBeInTheDocument();
    });
  });

  describe('When navigating to the contact route', () => {
    test('Then it should display the contact page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/contact'] });
      expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    });
  });

  describe('When navigating to a non-existent route', () => {
    test('Then it should display the not found page', () => {
      renderWithMemoryRouter(<App />, { initialEntries: ['/non-existent'] });
      expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument();
    });
  });

  describe('When navigating between routes', () => {
    test('Then it should maintain the header and footer across different routes', () => {
      const { unmount } = renderWithMemoryRouter(<App />, { initialEntries: ['/'] });
      expect(screen.getByTestId('Logo')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      unmount();
      renderWithMemoryRouter(<App />, { initialEntries: ['/about'] });
      expect(screen.getByTestId('Logo')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
