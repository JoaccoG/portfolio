import { forwardRef } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';

interface TitleProps {
  children: React.ReactNode;
  style?: ResponsiveStyles;
  as?: 'h1' | 'h2' | 'h3';
  isTruncated?: boolean;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, style, as: Tag = 'h2', isTruncated = false }, ref) => {
    const { resolve } = useBreakpoint();

    return (
      <Tag
        ref={ref}
        style={{
          ...resolve({ ...titleStyle, ...style }),
          ...(isTruncated && { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
        }}>
        {children}
      </Tag>
    );
  }
);

const titleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  fontSize: {
    base: '4rem',
    xs: '5rem',
    sm: '8rem',
    md: '10rem',
    lg: '12rem',
    xl: '14rem'
  },
  lineHeight: 1.2,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  textAlign: 'center',
  pointerEvents: 'none',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textShadow: '2px 2px 16px rgba(0, 0, 0, 0.5)'
};
