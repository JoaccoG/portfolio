import { useMemo } from 'react';
import { ShaderMaterial } from 'three';
import { GRAIN } from '@constants/overlay';
import fullscreenVert from '@shaders/overlay/fullscreen.vert?raw';
import grainFrag from '@shaders/overlay/grain.frag?raw';
import { FullscreenQuad } from '../FullscreenQuad';

interface GrainLayerProps {
  fps: number;
}

export const GrainLayer = ({ fps }: GrainLayerProps) => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uFps: { value: fps },
          uOpacity: { value: GRAIN.opacity },
          uWarmth: { value: GRAIN.warmthRange }
        },
        vertexShader: fullscreenVert,
        fragmentShader: grainFrag,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    [fps]
  );

  const onFrame = useMemo(
    () => (state: { elapsedTime: number }) => (material.uniforms.uTime.value = state.elapsedTime),
    [material]
  );

  return <FullscreenQuad material={material} renderOrder={2} onFrame={onFrame} />;
};
