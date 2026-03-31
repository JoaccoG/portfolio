import { forwardRef, createElement, type Ref, type ComponentType, type SVGProps } from 'react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { SvgBlogUnderline } from './BlogUnderline';
import { SvgGithub } from './Github';
import { SvgLinkedin } from './Linkedin';
import { SvgSpotify } from './Spotify';
import { SvgInstagram } from './Instagram';
import { SvgEmail } from './Email';

const svgIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  blogUnderline: SvgBlogUnderline,
  email: SvgEmail,
  github: SvgGithub,
  instagram: SvgInstagram,
  linkedin: SvgLinkedin,
  spotify: SvgSpotify
} as const;

interface SvgIconProps {
  icon: keyof typeof svgIcons;
  style?: ResponsiveStyles;
}

export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(({ icon, style = {} }, ref: Ref<SVGSVGElement>) => {
  const { resolve } = useBreakpoint();

  return <div style={resolve({ ...svgIconStyle, ...style })}>{createElement(svgIcons[icon], { ref })}</div>;
});

const svgIconStyle: ResponsiveStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem'
};
