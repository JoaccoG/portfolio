import { useId, useState } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';

interface FloatingFieldProps {
  type: 'text' | 'email' | 'textarea';
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FloatingField = ({ type, label, value, error, onChange }: FloatingFieldProps) => {
  const id = useId();
  const { resolve } = useBreakpoint();
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const inputId = `field-${id}`;
  const errorId = `error-${id}`;

  const borderColor = error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'rgba(242, 235, 227, 0.12)';

  const inputStyles: ResponsiveStyles = {
    ...resolve(inputStyle),
    borderBottomColor: borderColor,
    boxShadow: isFocused && !error ? '0 1px 0 0 rgba(236, 119, 83, 0.3)' : 'none',
    paddingTop: '16px'
  };

  const labelColor = error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-light-gray)';

  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false)
  };

  return (
    <div style={resolve(fieldWrapperStyle)}>
      <label
        htmlFor={inputId}
        style={{
          ...resolve(labelStyle),
          color: labelColor,
          top: isFloating ? '-2px' : type === 'textarea' ? '0.75rem' : '0.65rem',
          fontSize: isFloating ? '0.65rem' : '0.875rem',
          letterSpacing: isFloating ? '0.1em' : '0.02em'
        }}>
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          {...sharedProps}
          id={inputId}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          style={{ ...resolve(inputStyles), resize: 'vertical', minHeight: '100px', maxHeight: '200px' }}
        />
      ) : (
        <input
          {...sharedProps}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          style={resolve(inputStyles)}
        />
      )}

      <span id={error ? errorId : undefined} role={error ? 'alert' : undefined} style={resolve(errorTextStyle)}>
        {error ?? ''}
      </span>
    </div>
  );
};

const fieldWrapperStyle: ResponsiveStyles = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle: ResponsiveStyles = {
  position: 'absolute',
  left: 0,
  fontFamily: 'var(--font-body)',
  pointerEvents: 'none',
  transition: 'all 0.2s ease'
};

const inputStyle: ResponsiveStyles = {
  width: '100%',
  padding: '4px 0',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(242, 235, 227, 0.12)',
  outline: 'none',
  color: 'var(--color-white)',
  fontFamily: 'var(--font-body)',
  fontSize: { base: '0.875rem', md: '0.9375rem' },
  lineHeight: 1.2,
  transition: 'border-color 0.3s ease, box-shadow 0.25s ease'
};

const errorTextStyle: ResponsiveStyles = {
  height: '16px',
  color: 'var(--color-error)',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.04em',
  marginTop: '0.25rem'
};
