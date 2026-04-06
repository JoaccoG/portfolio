import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { SvgIcon } from '@components/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, ariaLabel, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const { resolve } = useBreakpoint();

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement;
    const frame = requestAnimationFrame(() => dialogRef.current?.focus());

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div style={resolve(backdropStyle)} onClick={handleBackdropClick} data-testid="modal-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        style={resolve(cardStyle)}
        data-testid="modal-card">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={resolve(closeButtonStyle)}
          data-testid="modal-close">
          <SvgIcon icon="error" style={closeIconStyle} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

const closeIconStyle: ResponsiveStyles = {
  width: '1rem',
  height: '1rem'
};

const backdropStyle: ResponsiveStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: { base: 'flex-end', sm: 'center' },
  justifyContent: 'center',
  zIndex: 1000,
  padding: { base: '0', sm: '2rem' },
  animation: 'modalBackdropIn 0.25s ease-out'
};

const cardStyle: ResponsiveStyles = {
  position: 'relative',
  width: '100%',
  maxWidth: { base: '100%', sm: '420px' },
  maxHeight: { base: '85vh', sm: '90vh' },
  overflowY: 'auto',
  background: 'var(--color-black)',
  border: '1px solid rgba(242, 235, 227, 0.1)',
  borderRadius: { base: '12px 12px 0 0', sm: '8px' },
  padding: { base: '2rem 1.5rem', sm: '2.5rem 2rem' },
  outline: 'none',
  animation: 'modalCardIn 0.3s ease-out'
};

const closeButtonStyle: ResponsiveStyles = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  padding: 0,
  border: 'none',
  borderRadius: '4px',
  background: 'transparent',
  color: 'var(--color-light-gray)',
  cursor: 'pointer',
  transition: 'color 0.2s ease'
};
