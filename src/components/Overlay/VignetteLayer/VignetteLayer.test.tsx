import { render } from '@testing-library/react';
import { VignetteLayer } from './VignetteLayer';

describe('Given the VignetteLayer component', () => {
  describe('When rendered', () => {
    it('Then it should render a div with the provided style', () => {
      const style = { background: 'radial-gradient(black, white)', opacity: 0.5 };
      const { container } = render(<VignetteLayer style={style} />);
      const div = container.firstElementChild as HTMLElement;
      expect(div).toBeInTheDocument();
      expect(div.style.background).toBe('radial-gradient(black, white)');
      expect(div.style.opacity).toBe('0.5');
    });
  });
});
