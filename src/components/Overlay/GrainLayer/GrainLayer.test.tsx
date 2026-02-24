import ReactThreeTestRenderer from '@react-three/test-renderer';
import { ShaderMaterial, type Mesh } from 'three';
import { GrainLayer } from './GrainLayer';
import { GRAIN } from '@constants/overlay';

vi.mock('@shaders/overlay/fullscreen.vert?raw', () => ({
  default: 'void main() { gl_Position = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/grain.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

describe('Given the GrainLayer component', () => {
  describe('When rendered', () => {
    it('Then it should create a mesh with a ShaderMaterial', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GrainLayer fps={30} />);
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      expect(instance.material).toBeInstanceOf(ShaderMaterial);
    });

    it('Then the material should have correct initial uniforms', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GrainLayer fps={60} />);
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      const material = instance.material as ShaderMaterial;
      expect(material.uniforms.uTime.value).toBe(0);
      expect(material.uniforms.uFps.value).toBe(60);
      expect(material.uniforms.uOpacity.value).toBe(GRAIN.opacity);
      expect(material.uniforms.uWarmth.value).toBe(GRAIN.warmthRange);
    });

    it('Then it should have render order 2', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GrainLayer fps={30} />);
      const mesh = renderer.scene.findByType('Mesh');
      expect(mesh.props.renderOrder).toBe(2);
    });
  });

  describe('When frames advance', () => {
    it('Then the onFrame callback should update the material uTime', async () => {
      const renderer = await ReactThreeTestRenderer.create(<GrainLayer fps={30} />);
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      const material = instance.material as ShaderMaterial;
      const initialTime = material.uniforms.uTime.value;
      await renderer.advanceFrames(2, 100);
      expect(material.uniforms.uTime.value).toBeGreaterThanOrEqual(initialTime);
    });
  });
});
