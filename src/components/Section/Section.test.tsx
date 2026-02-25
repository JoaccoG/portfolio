import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

const { mockResolve } = vi.hoisted(() => ({
  mockResolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
}));

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({ breakpoint: 'base', resolve: mockResolve })
}));

describe('Given the Section component', () => {
  beforeEach(() => mockResolve.mockClear());

  describe('When rendered with children', () => {
    it('Then it should render a <section> element containing them', () => {
      render(<Section>Hello World</Section>);
      const section = screen.getByText('Hello World');
      expect(section.tagName).toBe('SECTION');
    });
  });

  describe('When an id is provided', () => {
    it('Then the <section> should have that id attribute', () => {
      render(<Section id="about">Content</Section>);
      expect(document.getElementById('about')).toBeInTheDocument();
      expect(document.getElementById('about')?.tagName).toBe('SECTION');
    });
  });

  describe('When no id is provided', () => {
    it('Then the <section> should not have an id attribute', () => {
      render(<Section>Content</Section>);
      expect(screen.getByText('Content')).not.toHaveAttribute('id');
    });
  });

  describe('When a ref is provided', () => {
    it('Then the ref should point to the <section> element', () => {
      const ref = createRef<HTMLElement>();
      render(<Section ref={ref}>Content</Section>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('SECTION');
    });
  });

  describe('When no custom style is provided', () => {
    it('Then resolve should be called with only the default section styles', () => {
      render(<Section>Content</Section>);
      expect(mockResolve).toHaveBeenCalledWith(
        expect.objectContaining({ maxWidth: '1400px', display: 'flex', flexDirection: 'column' })
      );
    });
  });

  describe('When a custom style is provided', () => {
    it('Then resolve should be called with the custom style merged into the defaults', () => {
      render(<Section style={{ background: 'red', overflow: 'visible' }}>Content</Section>);
      expect(mockResolve).toHaveBeenCalledWith(
        expect.objectContaining({
          maxWidth: '1400px',
          display: 'flex',
          flexDirection: 'column',
          background: 'red',
          overflow: 'visible'
        })
      );
    });
  });
});
