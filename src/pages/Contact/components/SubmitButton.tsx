import { useState, useRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { CONTACT } from '@constants/content';
import { SvgSuccess } from '@components/icons/Success';
import { SvgError } from '@components/icons/Error';
import type { FormStatus } from '../hooks/useContactForm';

const BUTTON_LABELS: Record<'idle' | 'sending', string> = {
  idle: CONTACT.submit,
  sending: CONTACT.loading
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
  const animationKey = useRef(0);
  const prevStatus = useRef<FormStatus>(status);

  if (prevStatus.current !== status) {
    if (status === 'success' || status === 'error') animationKey.current += 1;
    prevStatus.current = status;
  }

  const isBusy = status !== 'idle';
  const isIcon = status === 'success' || status === 'error';

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
      {isIcon ? (
        status === 'success' ? (
          <SvgSuccess key={animationKey.current} width={22} height={22} style={resolve(successIconStyle)} />
        ) : (
          <SvgError key={animationKey.current} width={22} height={22} style={resolve(errorIconStyle)} />
        )
      ) : (
        BUTTON_LABELS[status]
      )}
    </button>
  );
};

const buttonStyle: ResponsiveStyles = {
  width: '100%',
  minHeight: '48px',
  maxHeight: '48px',
  padding: { base: '0.85rem', md: '1rem' },
  marginTop: '4px',
  border: '1px solid rgba(242, 235, 227, 0.15)',
  borderRadius: '4px',
  background: 'transparent',
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', md: '0.8rem' },
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const successIconStyle: ResponsiveStyles = {
  color: 'var(--color-success)',
  strokeDasharray: 80,
  strokeDashoffset: 80,
  animation: 'drawCheck 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
};

const errorIconStyle: ResponsiveStyles = {
  color: 'var(--color-error)',
  animation: 'shakeError 0.35s ease-in-out'
};
