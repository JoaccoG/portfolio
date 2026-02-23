import ReactThreeTestRenderer from '@react-three/test-renderer';
import type { Mesh } from 'three';
import { ShaderMaterial } from 'three';
import { FullscreenQuad } from './FullscreenQuad';

const createMockMaterial = () =>
  new ShaderMaterial({
    uniforms: { uTest: { value: 0 } },
    vertexShader: 'void main() { gl_Position = vec4(0.0); }',
    fragmentShader: 'void main() { gl_FragColor = vec4(0.0); }'
  });

describe('Given the FullscreenQuad component', () => {
  describe('When rendered', () => {
    it('Then it should render a mesh', async () => {
      const material = createMockMaterial();
      const renderer = await ReactThreeTestRenderer.create(<FullscreenQuad material={material} renderOrder={2} />);
      const meshes = renderer.scene.findAllByType('Mesh');
      expect(meshes).toHaveLength(1);
    });

    it('Then the mesh should have the correct render order', async () => {
      const material = createMockMaterial();
      const renderer = await ReactThreeTestRenderer.create(<FullscreenQuad material={material} renderOrder={5} />);
      const mesh = renderer.scene.findByType('Mesh');
      expect(mesh.props.renderOrder).toBe(5);
    });

    it('Then it should contain a plane geometry', async () => {
      const material = createMockMaterial();
      const renderer = await ReactThreeTestRenderer.create(<FullscreenQuad material={material} renderOrder={1} />);
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      expect(instance.geometry).toBeDefined();
      expect(instance.geometry.type).toBe('PlaneGeometry');
    });
  });

  describe('When onFrame is provided', () => {
    it('Then it should call onFrame on each frame', async () => {
      const material = createMockMaterial();
      const onFrame = vi.fn();
      const renderer = await ReactThreeTestRenderer.create(
        <FullscreenQuad material={material} renderOrder={1} onFrame={onFrame} />
      );
      await renderer.advanceFrames(1, 16);
      expect(onFrame).toHaveBeenCalledWith(
        expect.objectContaining({
          elapsedTime: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number)
        })
      );
    });
  });

  describe('When onFrame is not provided', () => {
    it('Then it should render without errors', async () => {
      const material = createMockMaterial();
      const renderer = await ReactThreeTestRenderer.create(<FullscreenQuad material={material} renderOrder={1} />);
      await renderer.advanceFrames(1, 16);
      const meshes = renderer.scene.findAllByType('Mesh');
      expect(meshes).toHaveLength(1);
    });
  });
});
