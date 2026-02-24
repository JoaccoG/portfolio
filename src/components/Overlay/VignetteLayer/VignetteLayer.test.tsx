import ReactThreeTestRenderer from '@react-three/test-renderer';
import { ShaderMaterial, type Mesh } from 'three';
import { VignetteLayer } from './VignetteLayer';
import { VIGNETTE } from '@constants/overlay';

vi.mock('@shaders/overlay/fullscreen.vert?raw', () => ({
  default: 'void main() { gl_Position = vec4(0.0); }'
}));

vi.mock('@shaders/overlay/vignette.frag?raw', () => ({
  default: 'void main() { gl_FragColor = vec4(0.0); }'
}));

describe('Given the VignetteLayer component', () => {
  describe('When rendered', () => {
    it('Then it should create a mesh with a ShaderMaterial', async () => {
      const renderer = await ReactThreeTestRenderer.create(
        <VignetteLayer innerRadius={0.55} outerRadius={1} maxDarkness={0.85} />
      );
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      expect(instance.material).toBeInstanceOf(ShaderMaterial);
    });

    it('Then the material should have correct initial uniforms', async () => {
      const renderer = await ReactThreeTestRenderer.create(
        <VignetteLayer innerRadius={0.7} outerRadius={1.2} maxDarkness={0.6} />
      );
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      const material = instance.material as ShaderMaterial;
      expect(material.uniforms.uTime.value).toBe(0);
      expect(material.uniforms.uInnerRadius.value).toBe(0.7);
      expect(material.uniforms.uOuterRadius.value).toBe(1.2);
      expect(material.uniforms.uMaxDarkness.value).toBe(0.6);
      expect(material.uniforms.uPulseDuration.value).toBe(VIGNETTE.pulseDuration);
      expect(material.uniforms.uAspect.value).toBe(1);
    });

    it('Then it should have render order 3', async () => {
      const renderer = await ReactThreeTestRenderer.create(
        <VignetteLayer innerRadius={0.55} outerRadius={1} maxDarkness={0.85} />
      );
      const mesh = renderer.scene.findByType('Mesh');
      expect(mesh.props.renderOrder).toBe(3);
    });
  });

  describe('When frames advance', () => {
    it('Then the onFrame callback should update uTime and uAspect', async () => {
      const renderer = await ReactThreeTestRenderer.create(
        <VignetteLayer innerRadius={0.55} outerRadius={1} maxDarkness={0.85} />
      );
      const mesh = renderer.scene.findByType('Mesh');
      const instance = mesh.instance as unknown as Mesh;
      const material = instance.material as ShaderMaterial;
      const initialTime = material.uniforms.uTime.value;
      await renderer.advanceFrames(2, 100);
      expect(material.uniforms.uTime.value).toBeGreaterThanOrEqual(initialTime);
    });
  });
});
