import { useRef, useMemo } from 'react';
import { BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { useOrbSimulation } from '@hooks/useOrbSimulation';
import { ORBS } from '@constants/overlay';
import orbVert from '@shaders/overlay/orb.vert?raw';
import orbFrag from '@shaders/overlay/orb.frag?raw';

const BUFFER_MULTIPLIER = 2;
const MAX_POINTS_PER_ORB = ORBS.trailLength + 1;
const { trailLength, radius, trailMaxAlpha, trailMinSizeRatio, trailSizeRange, headAlpha } = ORBS;

interface OrbSystemProps {
  cellSize: number;
  orbCount: number;
  orbSpeed: number;
}

export const OrbSystem = ({ cellSize, orbCount, orbSpeed }: OrbSystemProps) => {
  const { update } = useOrbSimulation({ cellSize, orbCount, orbSpeed });

  const maxPoints = orbCount * BUFFER_MULTIPLIER * MAX_POINTS_PER_ORB;

  const { positions, colors, sizes, geometry } = useMemo(() => {
    const pos = new Float32Array(maxPoints * 3);
    const col = new Float32Array(maxPoints * 3);
    const siz = new Float32Array(maxPoints);

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('color', new BufferAttribute(col, 3));
    geo.setAttribute('size', new BufferAttribute(siz, 1));
    geo.setDrawRange(0, 0);

    return { positions: pos, colors: col, sizes: siz, geometry: geo };
  }, [maxPoints]);

  const headColor = useMemo(() => new Color(ORBS.headColor), []);
  const trailColor = useMemo(() => new Color(ORBS.trailColor), []);

  const materialRef = useRef<ShaderMaterial>(null);
  const elapsedRef = useRef(0);

  const shaderMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {},
        vertexShader: orbVert,
        fragmentShader: orbFrag,
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false
      }),
    []
  );

  useFrame((state, delta) => {
    elapsedRef.current = state.clock.elapsedTime;
    const orbs = update(delta, elapsedRef.current);

    const trailColorR = trailColor.r;
    const trailColorG = trailColor.g;
    const trailColorB = trailColor.b;
    const headColorR = headColor.r;
    const headColorG = headColor.g;
    const headColorB = headColor.b;
    const dR = headColorR - trailColorR;
    const dG = headColorG - trailColorG;
    const dB = headColorB - trailColorB;

    let pointIndex = 0;

    for (const orb of orbs) {
      if (!orb.isSpawned && !orb.isFading) continue;

      const { trail, trailHead, trailSize, isFading } = orb;

      for (let i = 0; i < trailSize; i++) {
        const bufIdx = (trailHead - trailSize + i + trailLength) % trailLength;
        const progress = trailSize > 1 ? i / (trailSize - 1) : 1;
        const alpha = progress * trailMaxAlpha;
        const pointRadius = radius * (trailMinSizeRatio + trailSizeRange * progress);

        const pi3 = pointIndex * 3;
        positions[pi3] = trail[bufIdx * 2];
        positions[pi3 + 1] = trail[bufIdx * 2 + 1];
        positions[pi3 + 2] = 0;

        colors[pi3] = (trailColorR + dR * progress) * alpha;
        colors[pi3 + 1] = (trailColorG + dG * progress) * alpha;
        colors[pi3 + 2] = (trailColorB + dB * progress) * alpha;

        sizes[pointIndex] = pointRadius;
        pointIndex++;
      }

      if (!isFading) {
        const hi3 = pointIndex * 3;
        positions[hi3] = orb.x;
        positions[hi3 + 1] = orb.y;
        positions[hi3 + 2] = 0;

        colors[hi3] = headColorR * headAlpha;
        colors[hi3 + 1] = headColorG * headAlpha;
        colors[hi3 + 2] = headColorB * headAlpha;

        sizes[pointIndex] = radius;
        pointIndex++;
      }
    }

    for (let i = pointIndex; i < maxPoints; i++) {
      sizes[i] = 0;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.setDrawRange(0, pointIndex);
  });

  return <points geometry={geometry} material={shaderMaterial} renderOrder={1} ref={materialRef as never} />;
};
