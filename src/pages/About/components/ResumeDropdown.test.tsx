import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ABOUT } from '@constants/content';
import { ResumeDropdown } from './ResumeDropdown';

const getDropdownContainer = () => screen.getByText(ABOUT.buttonOptions[0].label).closest('a')!.parentElement!;

describe('Given the ResumeDropdown component', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('When rendered', () => {
    it('Then it should render a button with the label', () => {
      render(<ResumeDropdown />);
      expect(screen.getByRole('button')).toHaveTextContent(ABOUT.buttonLabel);
    });

    it('Then it should render the chevron icon', () => {
      render(<ResumeDropdown />);
      expect(screen.getByTestId('svg-icon-chevronDown')).toBeInTheDocument();
    });

    it('Then the dropdown should be hidden by default', () => {
      render(<ResumeDropdown />);
      expect(getDropdownContainer()).toHaveStyle({ opacity: 0, pointerEvents: 'none' });
    });

    it('Then it should render all options with correct hrefs', () => {
      render(<ResumeDropdown />);
      ABOUT.buttonOptions.forEach(({ label, href }) => {
        const link = screen.getByText(label).closest('a');
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('Then all option links should open in a new tab', () => {
      render(<ResumeDropdown />);
      ABOUT.buttonOptions.forEach(({ label }) => {
        const link = screen.getByText(label).closest('a');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('Then each option should have the open-new-window icon', () => {
      render(<ResumeDropdown />);
      const icons = screen.getAllByTestId('svg-icon-openNewWindow');
      expect(icons).toHaveLength(ABOUT.buttonOptions.length);
    });
  });

  describe('When the button is clicked', () => {
    it('Then the dropdown should become visible', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      expect(getDropdownContainer()).toHaveStyle({ opacity: 1, pointerEvents: 'auto' });
    });

    it('Then the button should have open border-radius', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveStyle({ borderRadius: '4px 4px 0 0' });
    });

    it('Then clicking again should close the dropdown', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
      expect(getDropdownContainer()).toHaveStyle({ opacity: 0, pointerEvents: 'none' });
    });
  });

  describe('When clicking outside the dropdown', () => {
    it('Then the dropdown should close', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.mouseDown(document.body);
      expect(getDropdownContainer()).toHaveStyle({ opacity: 0 });
    });
  });

  describe('When pressing Escape', () => {
    it('Then the dropdown should close', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(getDropdownContainer()).toHaveStyle({ opacity: 0 });
    });
  });

  describe('When an option is clicked', () => {
    it('Then the dropdown should close', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText(ABOUT.buttonOptions[0].label));
      expect(getDropdownContainer()).toHaveStyle({ opacity: 0 });
    });
  });

  describe('When the button is hovered', () => {
    it('Then the background should change to the hover color', () => {
      render(<ResumeDropdown />);
      fireEvent.mouseEnter(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveStyle({ background: 'rgba(236, 119, 83, 0.06)' });
    });

    it('Then the background should revert on mouse leave', () => {
      render(<ResumeDropdown />);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
      expect(button).toHaveStyle({ background: 'transparent' });
    });
  });

  describe('When a dropdown option is hovered', () => {
    it('Then its color should change to primary', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      const option = screen.getByText(ABOUT.buttonOptions[0].label).closest('a')!;
      fireEvent.mouseEnter(option);
      expect(option).toHaveStyle({ color: 'var(--color-primary)' });
    });

    it('Then its color should revert on mouse leave', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      const option = screen.getByText(ABOUT.buttonOptions[0].label).closest('a')!;
      fireEvent.mouseEnter(option);
      fireEvent.mouseLeave(option);
      expect(option).toHaveStyle({ color: 'var(--color-white)' });
    });
  });

  describe('When the page is scrolled while dropdown is open', () => {
    it('Then the dropdown should remain open', () => {
      render(<ResumeDropdown />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.scroll(window);
      expect(getDropdownContainer()).toHaveStyle({ opacity: 1, pointerEvents: 'auto' });
    });
  });

  describe('When a ref is forwarded', () => {
    it('Then the ref should point to the container element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ResumeDropdown ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
