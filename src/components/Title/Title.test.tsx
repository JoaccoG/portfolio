import { render, screen } from '@testing-library/react';
import { Title } from './Title';

describe('Given the Title component', () => {
  describe('When rendered', () => {
    it('Then it should render a heading element', () => {
      render(<Title>Test 1</Title>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test 1');
    });

    it('If isTruncated is true, then it should render a heading element with truncation styles', () => {
      render(<Title isTruncated>Test 2</Title>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test 2');
      expect(heading).toHaveStyle({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
    });
  });
});
