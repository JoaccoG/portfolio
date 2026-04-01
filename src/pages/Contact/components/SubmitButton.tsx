import { useState } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { CONTACT } from '@constants/content';
import type { FormStatus } from '../hooks/useContactForm';

const BUTTON_LABELS: Record<FormStatus, string> = {
  idle: CONTACT.send,
  sending: CONTACT.sending,
  success: CONTACT.success,
  error: CONTACT.error
};

const BUTTON_COLORS: Record<FormStatus, string> = {
  idle: 'var(--color-white)',
  sending: 'var(--color-light-gray)',
  success: 'var(--color-success)',
  error: 'var(--color-error)'
};

export const SubmitButton = ({ status }: { status: FormStatus }) => {
  const { resolve } = useBreakpoint();
  const [isHovered, setIsHovered] = useState(false);

  const isBusy = status !== 'idle';

  return (
    <button
      type="submit"
      disabled={status === 'sending'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...resolve(buttonStyle),
        color: BUTTON_COLORS[status],
        borderColor: isBusy ? BUTTON_COLORS[status] : isHovered ? 'var(--color-primary)' : 'rgba(242, 235, 227, 0.15)',
        background: isHovered && !isBusy ? 'rgba(236, 119, 83, 0.06)' : 'transparent',
        opacity: status === 'sending' ? 0.7 : 1
      }}>
      {BUTTON_LABELS[status]}
    </button>
  );
};

const buttonStyle: ResponsiveStyles = {
  width: '100%',
  padding: { base: '0.85rem', md: '1rem' },
  marginTop: '0.5rem',
  border: '1px solid rgba(242, 235, 227, 0.15)',
  borderRadius: '4px',
  background: 'transparent',
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', md: '0.8rem' },
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};
