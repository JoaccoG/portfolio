import { render, screen, fireEvent } from '@testing-library/react';
import { FOOTER } from '@constants/content';
import { Footer } from './Footer';

describe('Given the Footer component', () => {
  describe('When rendered', () => {
    it('Then it should render a footer element', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('Then it should render the copyright text', () => {
      render(<Footer />);
      expect(screen.getByText(FOOTER.copyright)).toBeInTheDocument();
    });

    it('Then it should render a link for every social entry', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(FOOTER.socialLinks.length);
    });

    it('Then each link should have the correct href', () => {
      render(<Footer />);
      FOOTER.socialLinks.forEach((link) => {
        expect(screen.getByTestId(`svg-icon-${link.icon}`).closest('a')).toHaveAttribute('href', link.url);
      });
    });

    it('Then each link should open in a new tab with noopener', () => {
      render(<Footer />);
      screen.getAllByRole('link').forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('When a social link is hovered', () => {
    it('Then the link color should change to the primary color', () => {
      render(<Footer />);
      const link = screen.getAllByRole('link')[0];
      fireEvent.mouseEnter(link);
      expect(link).toHaveStyle({ color: 'var(--color-primary)' });
    });

    it('Then the link color should revert on mouse leave', () => {
      render(<Footer />);
      const link = screen.getAllByRole('link')[0];
      fireEvent.mouseEnter(link);
      fireEvent.mouseLeave(link);
      expect(link).toHaveStyle({ color: '#3d3d3d' });
    });
  });
});
