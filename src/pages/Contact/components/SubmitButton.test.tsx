import { render, screen, fireEvent } from '@testing-library/react';
import { CONTACT } from '@constants/content';
import { SubmitButton } from './SubmitButton';

describe('Given the SubmitButton component', () => {
  describe('When status is "idle"', () => {
    it('Then it should render the send label', () => {
      render(<SubmitButton status="idle" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.submit);
    });

    it('Then it should not be disabled', () => {
      render(<SubmitButton status="idle" />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('When status is "sending"', () => {
    it('Then it should render the sending label', () => {
      render(<SubmitButton status="sending" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.loading);
    });

    it('Then it should be disabled', () => {
      render(<SubmitButton status="sending" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('When status is "success"', () => {
    it('Then it should render the success icon instead of text', () => {
      render(<SubmitButton status="success" />);
      expect(screen.getByTestId('svg-icon-success')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toHaveTextContent(CONTACT.submit);
    });

    it('Then the icon wrapper should use the success color', () => {
      render(<SubmitButton status="success" />);
      expect(screen.getByTestId('svg-icon-success')).toHaveStyle({ color: 'var(--color-success)' });
    });
  });

  describe('When status is "error"', () => {
    it('Then it should render the error icon instead of text', () => {
      render(<SubmitButton status="error" />);
      expect(screen.getByTestId('svg-icon-error')).toBeInTheDocument();
      expect(screen.getByRole('button')).not.toHaveTextContent(CONTACT.submit);
    });

    it('Then the icon wrapper should use the error color', () => {
      render(<SubmitButton status="error" />);
      expect(screen.getByTestId('svg-icon-error')).toHaveStyle({ color: 'var(--color-error)' });
    });
  });

  describe('When transitioning from a text state to an icon state', () => {
    it('Then it should show the success icon after transitioning from idle', () => {
      const { rerender } = render(<SubmitButton status="idle" />);
      rerender(<SubmitButton status="success" />);
      const icon = screen.getByTestId('svg-icon-success');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveStyle({ color: 'var(--color-success)' });
    });

    it('Then it should show the error icon after transitioning from sending', () => {
      const { rerender } = render(<SubmitButton status="sending" />);
      rerender(<SubmitButton status="error" />);
      const icon = screen.getByTestId('svg-icon-error');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveStyle({ color: 'var(--color-error)' });
    });
  });

  describe('When the user hovers while idle', () => {
    it('Then it should update background on mouseenter', () => {
      render(<SubmitButton status="idle" />);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(button).toHaveStyle({ background: 'rgba(236, 119, 83, 0.06)' });
    });

    it('Then it should reset background on mouseleave', () => {
      render(<SubmitButton status="idle" />);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
      expect(button).toHaveStyle({ background: 'transparent' });
    });
  });

  describe('When the user hovers while busy (sending/success/error)', () => {
    it('Then it should not apply hover background when sending', () => {
      render(<SubmitButton status="sending" />);
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(button).toHaveStyle({ background: 'transparent' });
    });
  });
});
