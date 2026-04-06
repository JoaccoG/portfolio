import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Modal } from './Modal';

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: 'base',
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));

const renderModal = (props: Partial<Parameters<typeof Modal>[0]> = {}) =>
  render(
    <Modal isOpen={true} onClose={vi.fn()} ariaLabel="Test modal" {...props}>
      <p>Modal content</p>
      <input data-testid="first-input" />
      <button data-testid="last-button">Action</button>
    </Modal>
  );

describe('Given the Modal component', () => {
  describe('When isOpen is false', () => {
    it('Then it should not render anything', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('When isOpen is true', () => {
    it('Then it should render the dialog via portal in document.body', () => {
      renderModal();
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog.closest('body')).toBe(document.body);
    });

    it('Then it should render children inside the dialog', () => {
      renderModal();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('Then it should have aria-modal and aria-label', () => {
      renderModal({ ariaLabel: 'Newsletter signup' });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Newsletter signup');
    });

    it('Then it should render a close button', () => {
      renderModal();
      expect(screen.getByTestId('modal-close')).toBeInTheDocument();
      expect(screen.getByTestId('modal-close')).toHaveAttribute('aria-label', 'Close');
    });

    it('Then it should lock body scroll', () => {
      renderModal();
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('When the close button is clicked', () => {
    it('Then it should call onClose', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderModal({ onClose });

      await user.click(screen.getByTestId('modal-close'));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('When the backdrop is clicked', () => {
    it('Then it should call onClose', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderModal({ onClose });

      await user.click(screen.getByTestId('modal-backdrop'));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('Then it should not call onClose when clicking inside the card', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderModal({ onClose });

      await user.click(screen.getByText('Modal content'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('When Escape key is pressed', () => {
    it('Then it should call onClose', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderModal({ onClose });

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('When the modal is closed after being open', () => {
    it('Then it should restore body scroll', () => {
      document.body.style.overflow = 'auto';
      const { rerender } = render(
        <Modal isOpen={true} onClose={vi.fn()} ariaLabel="Test">
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={vi.fn()} ariaLabel="Test">
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  describe('When Tab is pressed with no focusable children', () => {
    it('Then it should not throw and focus should remain on the dialog', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} ariaLabel="Empty modal">
          <p>No buttons here</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      (dialog as HTMLElement).focus();
      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      expect(document.activeElement).toBe(dialog);
    });
  });

  describe('When Tab key is pressed for focus trap', () => {
    it('Then it should wrap focus from last to first focusable element', () => {
      renderModal();

      const closeButton = screen.getByTestId('modal-close');
      const lastButton = screen.getByTestId('last-button');

      (lastButton as HTMLElement).focus();
      lastButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      expect(document.activeElement).toBe(closeButton);
    });

    it('Then Shift+Tab on first element should wrap to last focusable element', () => {
      renderModal();

      const closeButton = screen.getByTestId('modal-close');
      const lastButton = screen.getByTestId('last-button');

      (closeButton as HTMLElement).focus();
      closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));

      expect(document.activeElement).toBe(lastButton);
    });

    it('Then Tab on a middle element should not prevent default', () => {
      renderModal();

      const input = screen.getByTestId('first-input');
      (input as HTMLElement).focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      input.dispatchEvent(event);

      expect(preventSpy).not.toHaveBeenCalled();
    });
  });
});
