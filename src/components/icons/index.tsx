import { forwardRef, createElement, type Ref, type ComponentType, type SVGProps } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { SvgGithub } from './Github';
import { SvgLinkedin } from './Linkedin';
import { SvgSpotify } from './Spotify';
import { SvgInstagram } from './Instagram';
import { SvgEmail } from './Email';
import { SvgX } from './X';
import { SvgBlogUnderline } from './BlogUnderline';
import { SvgArrowDown } from './ArrowDown';
import { SvgOpenNewWindow } from './OpenNewWindow';
import { SvgChevronDown } from './ChevronDown';
import { SvgSuccess } from './Success';
import { SvgError } from './Error';

const svgIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: SvgGithub,
  linkedin: SvgLinkedin,
  x: SvgX,
  instagram: SvgInstagram,
  spotify: SvgSpotify,
  email: SvgEmail,
  blogUnderline: SvgBlogUnderline,
  arrowDown: SvgArrowDown,
  chevronDown: SvgChevronDown,
  openNewWindow: SvgOpenNewWindow,
  success: SvgSuccess,
  error: SvgError
} as const;

interface SvgIconProps {
  icon: keyof typeof svgIcons;
  style?: ResponsiveStyles;
}

export const SvgIcon = forwardRef<HTMLDivElement, SvgIconProps>(({ icon, style = {} }, ref: Ref<HTMLDivElement>) => {
  const { resolve } = useBreakpoint();

  return (
    <div ref={ref} style={resolve({ ...svgIconStyle, ...style })}>
      {createElement(svgIcons[icon], { width: '100%', height: '100%' })}
    </div>
  );
});

const svgIconStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem'
};
