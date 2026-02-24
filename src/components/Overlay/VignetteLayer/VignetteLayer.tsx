import { useMemo } from 'react';
import { ShaderMaterial } from 'three';
import { VIGNETTE } from '@constants/overlay';
import fullscreenVert from '@shaders/overlay/fullscreen.vert?raw';
import vignetteFrag from '@shaders/overlay/vignette.frag?raw';
import { FullscreenQuad } from '../FullscreenQuad';

interface VignetteLayerProps {
  innerRadius: number;
  outerRadius: number;
  maxDarkness: number;
}

export const VignetteLayer = ({ innerRadius, outerRadius, maxDarkness }: VignetteLayerProps) => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uInnerRadius: { value: innerRadius },
          uOuterRadius: { value: outerRadius },
          uMaxDarkness: { value: maxDarkness },
          uPulseDuration: { value: VIGNETTE.pulseDuration },
          uAspect: { value: 1 }
        },
        vertexShader: fullscreenVert,
        fragmentShader: vignetteFrag,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }),
    [innerRadius, outerRadius, maxDarkness]
  );

  const onFrame = useMemo(
    () => (state: { elapsedTime: number; width: number; height: number }) => {
      material.uniforms.uTime.value = state.elapsedTime;
      material.uniforms.uAspect.value = state.width / state.height;
    },
    [material]
  );

  return <FullscreenQuad material={material} renderOrder={3} onFrame={onFrame} />;
};
