import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { ABOUT } from '@constants/content';
import { SvgIcon } from '@components/icons';

export const ResumeDropdown = forwardRef<HTMLDivElement>(function ResumeDropdown(_, forwardedRef) {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolve } = useBreakpoint();

  const mergeRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
    },
    [forwardedRef]
  );

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close);
    };
  }, [isOpen]);

  const activeBorder = isButtonHovered || isOpen ? 'var(--color-primary)' : 'rgba(242, 235, 227, 0.15)';

  return (
    <div ref={mergeRef} style={resolve(containerStyle)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        style={{
          ...resolve(buttonStyle),
          borderColor: activeBorder,
          borderRadius: isOpen ? '4px 4px 0 0' : '4px',
          borderBottomColor: isOpen ? 'transparent' : activeBorder,
          background: isButtonHovered || isOpen ? 'rgba(236, 119, 83, 0.06)' : 'transparent'
        }}>
        {ABOUT.buttonLabel}
        <SvgIcon
          icon="chevronDown"
          style={{
            width: '1rem',
            height: '1rem',
            color: 'var(--color-white)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      <div
        style={{
          ...resolve(dropdownStyle),
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          borderColor: 'var(--color-primary)'
        }}>
        {ABOUT.buttonOptions.map(({ label, href }) => (
          <DropdownOption key={href} label={label} href={href} onSelect={() => setIsOpen(false)} />
        ))}
      </div>
    </div>
  );
});

interface DropdownOptionProps {
  label: string;
  href: string;
  onSelect: () => void;
}

const DropdownOption = ({ label, href, onSelect }: DropdownOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { resolve } = useBreakpoint();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...resolve(optionStyle),
        background: isHovered ? 'rgba(236, 119, 83, 0.08)' : 'transparent',
        color: isHovered ? 'var(--color-primary)' : 'var(--color-white)'
      }}>
      {label}
      <SvgIcon
        icon="openNewWindow"
        style={{
          width: '1rem',
          height: '1rem',
          color: isHovered ? 'var(--color-primary)' : 'var(--color-white)'
        }}
      />
    </a>
  );
};

const containerStyle: ResponsiveStyles = {
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const buttonStyle: ResponsiveStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: { base: '0.5rem 1.5rem', sm: '0.5rem 2rem', lg: '0.75rem 2.5rem' },
  border: '1px solid rgba(242, 235, 227, 0.15)',
  borderRadius: '4px',
  background: 'transparent',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', sm: '0.875rem', lg: '1rem' },
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  gap: '4px'
};

const dropdownStyle: ResponsiveStyles = {
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  border: '1px solid var(--color-primary)',
  borderRadius: '0 0 4px 4px',
  overflow: 'hidden',
  transition: 'opacity 0.2s ease',
  zIndex: 20
};

const optionStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  padding: '0.6rem 1rem',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-white)',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
};
