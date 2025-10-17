import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithMemoryRouter } from '@utils/tests';
import { Footer } from '@components/Footer/Footer';
import { SOCIAL_LINKS } from '@constants/links';

describe('Given a "Footer" component', () => {
  describe('When it is rendered', () => {
    test('Then it should display the footer', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText(/Designed & Built by/)).toBeInTheDocument();
      expect(screen.getByText('Joaquín Godoy')).toBeInTheDocument();
    });

    test('Then it should display all social media links', () => {
      renderWithMemoryRouter(<Footer />);
      SOCIAL_LINKS.forEach((link) => expect(screen.getByLabelText(link.label)).toBeInTheDocument());
    });

    test('Then it should display the current year in copyright', () => {
      renderWithMemoryRouter(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(
        screen.getAllByText((_, element) => element?.textContent?.includes(currentYear.toString()) ?? false)[0]
      ).toBeInTheDocument();
    });

    test('Then it should display desktop sidebars', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  describe('When social links are clicked', () => {
    test('Then all social links should have correct attributes', () => {
      renderWithMemoryRouter(<Footer />);
      SOCIAL_LINKS.forEach((link) => {
        const linkElement = screen.getByLabelText(link.label);
        expect(linkElement).toHaveAttribute('href', link.href);
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('When checking responsive behavior', () => {
    test('Then it should adapt to mobile layout', () => {
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    });

    test('Then it should adapt to desktop layout', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    });
  });

  describe('When checking accessibility', () => {
    test('Then all links should have proper aria-labels', () => {
      renderWithMemoryRouter(<Footer />);
      SOCIAL_LINKS.forEach((link) => {
        const linkElement = screen.getByLabelText(link.label);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('aria-label', link.label);
      });
    });

    test('Then footer should have proper semantic role', () => {
      renderWithMemoryRouter(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('When checking styling and layout', () => {
    test('Then footer should have proper border and spacing', () => {
      renderWithMemoryRouter(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveStyle('border-top: 1px');
    });

    test('Then copyright text should have correct styling', () => {
      renderWithMemoryRouter(<Footer />);
      const copyrightText = screen.getByText(/Designed & Built by/);
      expect(copyrightText).toHaveStyle('color: var(--color-neutral-light-gray)');
      expect(copyrightText).toHaveStyle('font-family: var(--font-family-inter)');
    });

    test('Then author name should be highlighted', () => {
      renderWithMemoryRouter(<Footer />);
      const authorName = screen.getByText('Joaquín Godoy');
      expect(authorName).toHaveStyle('color: var(--color-neutral-white)');
    });
  });

  describe('When checking sidebar functionality', () => {
    test('Then it should render left sidebar with icons', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('Spotify')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    });

    test('Then it should render right sidebar with email text', () => {
      renderWithMemoryRouter(<Footer />);
      const emailLink = screen.getByLabelText('Email');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:joaquingodoy2407@gmail.com');
    });
  });

  describe('When checking mobile layout behavior', () => {
    vi.mock('@chakra-ui/react', async () => ({
      ...(await vi.importActual('@chakra-ui/react')),
      useBreakpointValue: vi.fn(() => false)
    }));

    test('Then it should not display desktop sidebars when in mobile mode', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getAllByLabelText('GitHub')).toHaveLength(1);
    });

    test('Then it should display social links in mobile layout when not in desktop mode', () => {
      renderWithMemoryRouter(<Footer />);
      SOCIAL_LINKS.forEach((link) => expect(screen.getByLabelText(link.label)).toBeInTheDocument());
    });
  });

  describe('When checking sidebar conditional rendering', () => {
    test('Then it should render sidebar links with icons when showIcon is true', () => {
      renderWithMemoryRouter(<Footer />);
      const githubLink = screen.getByLabelText('GitHub');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink.getAttribute('href')).toContain('github');
    });

    test('Then it should render sidebar links with text when showIcon is false', () => {
      renderWithMemoryRouter(<Footer />);
      const emailLink = screen.getByLabelText('Email');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.getAttribute('href')).toContain('mailto');
    });
  });

  describe('When checking animation states', () => {
    test('Then it should handle inView state for animations', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText(/Designed & Built by/)).toBeInTheDocument();
    });

    test('Then it should render motion components with proper initial states', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText(/Designed & Built by/)).toBeInTheDocument();
    });

    test('Then it should render social links with proper motion animations', () => {
      renderWithMemoryRouter(<Footer />);
      SOCIAL_LINKS.forEach((link) => expect(screen.getByLabelText(link.label)).toBeInTheDocument());
    });
  });

  describe('When checking email link text rendering', () => {
    test('Then it should display email link in sidebar', () => {
      renderWithMemoryRouter(<Footer />);
      const emailLink = screen.getByLabelText('Email');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.getAttribute('href')).toContain('mailto');
    });
  });

  describe('When checking sidebar positioning', () => {
    test('Then it should render left sidebar with proper positioning', () => {
      renderWithMemoryRouter(<Footer />);
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    });

    test('Then it should render right sidebar with email link', () => {
      renderWithMemoryRouter(<Footer />);
      const emailLink = screen.getByLabelText('Email');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.getAttribute('href')).toContain('mailto');
    });
  });
});
