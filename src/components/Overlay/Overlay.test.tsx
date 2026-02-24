import { render } from '@testing-library/react';
import { Overlay } from './Overlay';

vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');

  return {
    ...actual,
    Canvas: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
      <div data-testid="canvas" style={style}>
        {children}
      </div>
    )
  };
});

vi.mock('@shaders/overlay/fullscreen.vert?raw', () => ({
  default: 'void main() { gl_Position = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/grain.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/vignette.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/orb.vert?raw', () => ({
  default: 'void main() { gl_Position = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/orb.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

vi.mock('./VignetteLayer/VignetteLayer', () => ({ VignetteLayer: () => null }));
vi.mock('./GrainLayer/GrainLayer', () => ({ GrainLayer: () => null }));
vi.mock('./GridLayer/GridLayer', () => ({ GridLayer: () => null }));
vi.mock('./GridLayer/OrbSystem', () => ({ OrbSystem: () => null }));

describe('Given the Overlay component', () => {
  describe('When rendered', () => {
    it('Then it should render a canvas container', () => {
      const { getByTestId } = render(<Overlay />);
      const canvas = getByTestId('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('Then the canvas container should be present in the document', () => {
      const { getByTestId } = render(<Overlay />);
      const canvas = getByTestId('canvas');
      expect(canvas).toBeVisible();
    });
  });
});
