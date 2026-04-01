import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBreakpoint, type ResponsiveStyles } from '@hooks/useBreakpoint';
import { CONTACT } from '@constants/content';
import { Section } from '@components/Section/Section';
import { FloatingField } from './components/FloatingField';
import { SubmitButton } from './components/SubmitButton';
import { useContactForm } from './hooks/useContactForm';

export const Contact = () => {
  const { resolve } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { fields, errors, status, serverError, handleChange, handleSubmit } = useContactForm();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        defaults: { ease: 'power3.out' }
      });

      tl.fromTo(headerRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });

      if (formRef.current) {
        tl.fromTo(
          formRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          '-=0.4'
        );
      }
    },
    { scope: sectionRef }
  );

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Section ref={sectionRef} id="contact" style={contactSectionStyle}>
      <div style={resolve(innerStyle)}>
        <div ref={headerRef} style={resolve(headerStyle)}>
          <h2 style={resolve(titleStyle)}>{CONTACT.title}</h2>
          <p style={resolve(subtitleStyle)}>{CONTACT.subtitle}</p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} style={resolve(formStyle)} noValidate>
          <FloatingField
            type="email"
            label={CONTACT.fields.email}
            value={fields.email}
            error={errors.email}
            onChange={(v) => handleChange('email', v)}
          />
          <FloatingField
            type="text"
            label={CONTACT.fields.subject}
            value={fields.subject}
            error={errors.subject}
            onChange={(v) => handleChange('subject', v)}
          />
          <FloatingField
            type="textarea"
            label={CONTACT.fields.message}
            value={fields.message}
            error={errors.message}
            onChange={(v) => handleChange('message', v)}
          />

          {serverError && <p style={serverErrorStyle}>{serverError}</p>}

          <SubmitButton status={status} />
        </form>
      </div>
    </Section>
  );
};

const contactSectionStyle: ResponsiveStyles = {
  height: 'auto',
  minHeight: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4rem 2rem',
  gap: '0',
  overflow: 'visible'
};

const innerStyle: ResponsiveStyles = {
  width: '100%',
  maxWidth: { base: '520px', md: '800px', lg: '900px' },
  display: { base: 'flex', md: 'grid' },
  flexDirection: 'column',
  gridTemplateColumns: { md: '2fr 3fr' },
  gap: { base: '2rem', md: '3rem', lg: '4rem' },
  padding: { base: '2rem 1.5rem', sm: '2.5rem 2rem', md: '3rem 2.5rem', lg: '3rem 3.5rem' },
  border: '1px solid rgba(242, 235, 227, 0.08)',
  borderRadius: '8px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  background: 'rgba(242, 235, 227, 0.02)',
  alignItems: { base: 'stretch', md: 'center' }
};

const headerStyle: ResponsiveStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  gap: { base: '1rem', lg: '2rem' },
  textAlign: { base: 'center', md: 'left' }
};

const titleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  fontSize: { base: '2.5rem', xs: '3rem', sm: '3.5rem', md: '3.5rem', lg: '4rem' },
  lineHeight: 1.1,
  letterSpacing: '0.04em',
  color: 'var(--color-white)'
};

const subtitleStyle: ResponsiveStyles = {
  fontFamily: 'var(--font-mono)',
  fontSize: { base: '0.75rem', sm: '0.8rem', md: '0.8rem', lg: '0.875rem' },
  color: 'var(--color-light-gray)',
  letterSpacing: '0.06em',
  lineHeight: 1.6
};

const formStyle: ResponsiveStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: { base: '1.25rem', md: '1.5rem' },
  width: '100%'
};

const serverErrorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  color: 'var(--color-error)',
  letterSpacing: '0.04em',
  textAlign: 'center'
};
