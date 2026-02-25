import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { LineSegments } from 'three';
import { GridLayer } from './GridLayer';

describe('Given the GridLayer component', () => {
  describe('When rendered', () => {
    it('Then it should create line segments', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GridLayer cellSize={256} />);
      const lineSegments = renderer.scene.findAllByType('LineSegments');
      expect(lineSegments).toHaveLength(1);
    });

    it('Then the geometry should contain position data', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GridLayer cellSize={256} />);
      const lineSegments = renderer.scene.findByType('LineSegments');
      const instance = lineSegments.instance as unknown as LineSegments;
      const posAttr = instance.geometry.getAttribute('position');
      expect(posAttr).toBeDefined();
      expect(posAttr.count).toBeGreaterThan(0);
    });

    it('Then the material should be transparent with correct opacity', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GridLayer cellSize={256} />);
      const lineSegments = renderer.scene.findByType('LineSegments');
      const children = lineSegments.allChildren;
      const material = children.find((c) => c.type === 'LineBasicMaterial');
      expect(material).toBeDefined();
      expect(material!.props.transparent).toBe(true);
      expect(material!.props.opacity).toBe(0.08);
    });

    it('Then render order should be 0', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GridLayer cellSize={256} />);
      const lineSegments = renderer.scene.findByType('LineSegments');
      expect(lineSegments.props.renderOrder).toBe(0);
    });
  });
});
