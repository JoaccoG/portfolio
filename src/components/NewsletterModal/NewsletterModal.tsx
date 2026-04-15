import { useEffect, useState } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { useNewsletterForm, type NewsletterStatus } from '@hooks/useNewsletterForm';
import { NEWSLETTER } from '@constants/content';
import { Modal } from '@components/Modal/Modal';
import { FloatingField } from '@pages/Contact/components/FloatingField';
import { SvgIcon } from '@components/icons';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const { resolve } = useBreakpoint();
  const { email, error, status, serverError, warning, handleChange, handleSubmit, reset } = useNewsletterForm();

  const feedbackMessage = warning ?? serverError ?? '';

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={NEWSLETTER.title}>
      {status === 'success' ? (
        <SuccessView message={NEWSLETTER.success} onClose={onClose} />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
          style={resolve(formStyle)}>
          <h2 style={resolve(titleStyle)}>{NEWSLETTER.title}</h2>
          <p style={resolve(subtitleStyle)}>{NEWSLETTER.subtitle}</p>

          <FloatingField
            type="email"
            label={NEWSLETTER.field}
            value={email}
            error={error ?? undefined}
            onChange={handleChange}
          />

          <p
            role={feedbackMessage ? 'alert' : undefined}
            style={{
              ...resolve(feedbackStyle),
              color: warning ? 'var(--color-warning)' : 'var(--color-error)'
            }}>
            {feedbackMessage}
          </p>

          <SubscribeButton status={status} />
        </form>
      )}
    </Modal>
  );
};

const SuccessView = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const { resolve } = useBreakpoint();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <output style={resolve(successContainerStyle)}>
      <SvgIcon icon="success" style={successIconStyle} />
      <p style={resolve(successTextStyle)}>{message}</p>
      <button
        type="button"
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...resolve(doneButtonStyle),
          borderColor: isHovered ? 'var(--color-primary)' : 'rgba(242, 235, 227, 0.15)',
          background: isHovered ? 'rgba(236, 119, 83, 0.06)' : 'transparent'
        }}>
        {NEWSLETTER.done}
      </button>
    </output>
  );
};

const SubscribeButton = ({ status }: { status: NewsletterStatus }) => {
  const { resolve } = useBreakpoint();
  const [isHovered, setIsHovered] = useState(false);

  const isSending = status === 'sending';

  return (
    <button
      type="submit"
      disabled={isSending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...resolve(buttonStyle),
        borderColor: isHovered && !isSending ? 'var(--color-primary)' : 'rgba(242, 235, 227, 0.15)',
        background: isHovered && !isSending ? 'rgba(236, 119, 83, 0.06)' : 'transparent',
        opacity: isSending ? 0.7 : 1
      }}>
      {isSending ? NEWSLETTER.loading : NEWSLETTER.submit}
    </button>
  );
};

const successIconStyle: ResponsiveStyles = {
  width: '2.5rem',
  height: '2.5rem',
  color: 'var(--color-success)'
};

const formStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const titleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  fontSize: { base: '2rem', sm: '2.25rem' },
  lineHeight: 1.1,
  letterSpacing: '0.04em',
  color: 'var(--color-primary)',
  paddingRight: '2rem'
};

const subtitleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', sm: '0.8rem' },
  color: 'var(--color-white)',
  letterSpacing: '0.04em',
  lineHeight: 1.6
};

const feedbackStyle: ResponsiveStyles = {
  minHeight: '16px',
  maxHeight: '16px',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.04em',
  textAlign: 'center'
};

const sharedButtonStyle: ResponsiveStyles = {
  width: '100%',
  minHeight: '48px',
  padding: '0.85rem',
  border: '1px solid rgba(242, 235, 227, 0.15)',
  borderRadius: '4px',
  background: 'transparent',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const buttonStyle: ResponsiveStyles = sharedButtonStyle;
const doneButtonStyle: ResponsiveStyles = sharedButtonStyle;

const successContainerStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.25rem',
  padding: '1.5rem 0'
};

const successTextStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.8rem', sm: '0.85rem' },
  color: 'var(--color-white)',
  letterSpacing: '0.04em',
  lineHeight: 1.6,
  textAlign: 'center'
};
