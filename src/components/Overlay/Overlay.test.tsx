import { render } from '@testing-library/react';
import { Overlay } from './Overlay';

vi.mock('./VignetteLayer', () => ({
  VignetteLayer: ({ style }: { style: React.CSSProperties }) => <div data-testid="vignette" style={style} />
}));

vi.mock('./GrainLayer', () => ({
  GrainLayer: ({ fps, style }: { fps: number; style: React.CSSProperties }) => (
    <canvas data-testid="grain" data-fps={fps} style={style} />
  ),
  GRAIN_OPTIONS: { fps: { base: 24, sm: 30, md: 60 }, canvasSize: 256, opacity: 0.08 }
}));

vi.mock('./GridLayer', () => ({
  GridLayer: (props: Record<string, unknown>) => <div data-testid="grid" data-cell-size={props.cellSize} />,
  GRID_OPTIONS: { cellSize: { base: 128, sm: 192, md: 256 }, baseOpacity: 0.03 },
  GRID_LIGHTS_OPTIONS: {
    count: { base: 2, sm: 3, lg: 5 },
    speed: { base: 0.4, md: 0.6, lg: 0.8 },
    radius: 2,
    turnChance: 0.25,
    trailLength: 300,
    spawnDelay: 500,
    spawnStagger: 1000
  }
}));

describe('Given the Overlay component', () => {
  describe('When rendered', () => {
    it('Then it should render all three layers', () => {
      const { getByTestId } = render(<Overlay />);
      expect(getByTestId('vignette-layer')).toBeInTheDocument();
      expect(getByTestId('grain-layer')).toBeInTheDocument();
      expect(getByTestId('grid-layer')).toBeInTheDocument();
    });
  });
});
