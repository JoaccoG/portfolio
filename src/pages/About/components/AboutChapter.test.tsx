import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { AboutChapter } from './AboutChapter';

describe('Given the AboutChapter component', () => {
  const defaultProps = {
    number: '01',
    title: 'TEST CHAPTER',
    paragraphs: ['First paragraph.', 'Second paragraph.']
  };

  describe('When rendered with chapter data', () => {
    it('Then it should render the chapter label with the number', () => {
      render(<AboutChapter {...defaultProps} />);
      expect(screen.getByText('CHAPTER.01')).toBeInTheDocument();
    });

    it('Then it should render the chapter title as an h3', () => {
      render(<AboutChapter {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('TEST CHAPTER');
    });

    it('Then it should render all paragraphs', () => {
      render(<AboutChapter {...defaultProps} />);
      expect(screen.getByText('First paragraph.')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    });

    it('Then animated elements should have data-animate attributes', () => {
      render(<AboutChapter {...defaultProps} />);
      const label = screen.getByText('CHAPTER.01');
      const title = screen.getByRole('heading', { level: 3 });
      const paragraphs = screen.getAllByText(/paragraph/);

      expect(label).toHaveAttribute('data-animate');
      expect(title).toHaveAttribute('data-animate');
      paragraphs.forEach((p) => expect(p).toHaveAttribute('data-animate'));
    });
  });

  describe('When rendered with ReactNode paragraphs', () => {
    it('Then it should render JSX content inside paragraphs', () => {
      const props = {
        ...defaultProps,
        paragraphs: [
          <>
            Hello <a href="https://test.com">World</a>
          </>
        ]
      };
      render(<AboutChapter {...props} />);
      const link = screen.getByRole('link', { name: 'World' });
      expect(link).toHaveAttribute('href', 'https://test.com');
    });
  });

  describe('When a ref is passed', () => {
    it('Then it should forward the ref to the root div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<AboutChapter ref={ref} {...defaultProps} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.querySelector('h3')).toHaveTextContent('TEST CHAPTER');
    });
  });
});
