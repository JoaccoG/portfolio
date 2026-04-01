import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingField } from './FloatingField';

const defaultProps = {
  type: 'text' as const,
  label: 'Name',
  value: '',
  onChange: vi.fn()
};

describe('Given the FloatingField component', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('When rendered with type "text"', () => {
    it('Then it should render an input element', () => {
      render(<FloatingField {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Then it should render the label', () => {
      render(<FloatingField {...defaultProps} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('When rendered with type "email"', () => {
    it('Then it should render an email input', () => {
      render(<FloatingField {...defaultProps} type="email" label="Email" />);
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
    });
  });

  describe('When rendered with type "textarea"', () => {
    it('Then it should render a textarea', () => {
      render(<FloatingField {...defaultProps} type="textarea" />);
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });
  });

  describe('When a value is entered', () => {
    it('Then it should call onChange with the new value', () => {
      const onChange = vi.fn();
      render(<FloatingField {...defaultProps} onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
      expect(onChange).toHaveBeenCalledWith('hello');
    });

    it('Then the label should float when a value is present', () => {
      render(<FloatingField {...defaultProps} value="hello" />);
      const label = screen.getByText('Name');
      expect(label).toHaveStyle({ fontSize: '0.65rem' });
    });
  });

  describe('When the input is focused', () => {
    it('Then the label should float', () => {
      render(<FloatingField {...defaultProps} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      const label = screen.getByText('Name');
      expect(label).toHaveStyle({ fontSize: '0.65rem' });
    });

    it('Then the label should stop floating on blur', () => {
      render(<FloatingField {...defaultProps} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);
      const label = screen.getByText('Name');
      expect(label).toHaveStyle({ fontSize: '0.875rem' });
    });
  });

  describe('When an error is provided', () => {
    it('Then it should render the error message', () => {
      render(<FloatingField {...defaultProps} error="Required" />);
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('Then the label should use the error color', () => {
      render(<FloatingField {...defaultProps} error="Required" />);
      expect(screen.getByText('Name')).toHaveStyle({ color: 'var(--color-error)' });
    });

    it('Then the input border should use the error color', () => {
      render(<FloatingField {...defaultProps} error="Required" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({ borderBottomColor: 'var(--color-error)' });
    });
  });
});
