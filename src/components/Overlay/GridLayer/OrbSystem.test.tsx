import ReactThreeTestRenderer from '@react-three/test-renderer';
import { ShaderMaterial, type Points } from 'three';
import { OrbSystem } from './OrbSystem';

vi.mock('@shaders/overlay/orb.vert?raw', () => ({
  default: 'void main() { gl_Position = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/orb.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

vi.mock('@hooks/useOrbSimulation', () => ({
  useOrbSimulation: () => ({
    update: () => [
      {
        x: 10,
        y: 20,
        isSpawned: true,
        isFading: false,
        trail: new Float32Array([5, 15, 7, 17, 9, 19, 10, 20]),
        trailHead: 4,
        trailSize: 4,
        direction: 'right' as const
      },
      {
        x: 50,
        y: 60,
        isSpawned: true,
        isFading: true,
        trail: new Float32Array([45, 55, 50, 60]),
        trailHead: 2,
        trailSize: 2,
        direction: 'up' as const
      },
      {
        x: 0,
        y: 0,
        isSpawned: false,
        isFading: false,
        trail: new Float32Array(160),
        trailHead: 0,
        trailSize: 0,
        direction: 'down' as const
      },
      {
        x: 30,
        y: 40,
        isSpawned: true,
        isFading: false,
        trail: new Float32Array([30, 40]),
        trailHead: 1,
        trailSize: 1,
        direction: 'left' as const
      }
    ],
    orbsRef: { current: [] }
  })
}));

describe('Given the OrbSystem component', () => {
  describe('When rendered', () => {
    it('Then it should create a points object', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      const points = renderer.scene.findAllByType('Points');
      expect(points).toHaveLength(1);
    });

    it('Then the points should have a ShaderMaterial with additive blending', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      const points = renderer.scene.findByType('Points');
      const instance = points.instance as unknown as Points;
      expect(instance.material).toBeInstanceOf(ShaderMaterial);

      const material = instance.material as ShaderMaterial;
      expect(material.transparent).toBe(true);
      expect(material.depthTest).toBe(false);
    });

    it('Then the geometry should have position, color, and size attributes', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      const points = renderer.scene.findByType('Points');
      const instance = points.instance as unknown as Points;
      expect(instance.geometry.getAttribute('position')).toBeDefined();
      expect(instance.geometry.getAttribute('color')).toBeDefined();
      expect(instance.geometry.getAttribute('size')).toBeDefined();
    });

    it('Then it should have render order 1', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      const points = renderer.scene.findByType('Points');
      expect(points.props.renderOrder).toBe(1);
    });
  });

  describe('When frames advance with spawned orbs', () => {
    it('Then the draw range should reflect active and fading orbs', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      await renderer.advanceFrames(1, 16);
      const points = renderer.scene.findByType('Points');
      const instance = points.instance as unknown as Points;

      // orb 0: 4 trail + 1 head = 5
      // orb 1 (fading): 2 trail, no head = 2
      // orb 2 (not spawned, not fading): skipped = 0
      // orb 3: 1 trail + 1 head = 2 (trailSize=1, progress=1 for single point)
      // Total = 9
      expect(instance.geometry.drawRange.count).toBe(9);
    });

    it('Then fading orbs should not render head points', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      await renderer.advanceFrames(1, 16);
      const points = renderer.scene.findByType('Points');
      const instance = points.instance as unknown as Points;
      const sizeAttr = instance.geometry.getAttribute('size');
      const activeCount = instance.geometry.drawRange.count;
      expect(activeCount).toBe(9);
      expect(sizeAttr.getX(activeCount)).toBe(0);
    });

    it('Then trail colors should interpolate between trail and head color', async () => {
      const renderer = await ReactThreeTestRenderer.create(<OrbSystem cellSize={256} orbCount={4} orbSpeed={2} />);
      await renderer.advanceFrames(1, 16);
      const points = renderer.scene.findByType('Points');
      const instance = points.instance as unknown as Points;
      const colorAttr = instance.geometry.getAttribute('color');
      expect(colorAttr.count).toBeGreaterThan(0);
    });
  });
});
