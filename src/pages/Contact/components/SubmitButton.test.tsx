import { render, screen, fireEvent } from '@testing-library/react';
import { CONTACT } from '@constants/content';
import { SubmitButton } from './SubmitButton';

describe('Given the SubmitButton component', () => {
  describe('When status is "idle"', () => {
    it('Then it should render the send label', () => {
      render(<SubmitButton status="idle" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.send);
    });

    it('Then it should not be disabled', () => {
      render(<SubmitButton status="idle" />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('When status is "sending"', () => {
    it('Then it should render the sending label', () => {
      render(<SubmitButton status="sending" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.sending);
    });

    it('Then it should be disabled', () => {
      render(<SubmitButton status="sending" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('When status is "success"', () => {
    it('Then it should render the success label', () => {
      render(<SubmitButton status="success" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.success);
    });
  });

  describe('When status is "error"', () => {
    it('Then it should render the error label', () => {
      render(<SubmitButton status="error" />);
      expect(screen.getByRole('button')).toHaveTextContent(CONTACT.error);
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
