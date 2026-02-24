import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';

interface FullscreenQuadProps {
  material: ShaderMaterial;
  renderOrder: number;
  onFrame?: (state: { elapsedTime: number; width: number; height: number }) => void;
}

export const FullscreenQuad = ({ material, renderOrder, onFrame }: FullscreenQuadProps) => {
  const { size } = useThree();
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (!materialRef.current || !onFrame) return;
    onFrame({
      elapsedTime: state.clock.elapsedTime,
      width: state.size.width,
      height: state.size.height
    });
  });

  return (
    <mesh renderOrder={renderOrder}>
      <planeGeometry args={[size.width, size.height]} />
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
};
