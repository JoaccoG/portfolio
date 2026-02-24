import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { useThree } from '@react-three/fiber';

import { GRID } from '@constants/overlay';

interface GridLayerProps {
  cellSize: number;
}

export const GridLayer = ({ cellSize }: GridLayerProps) => {
  const { size } = useThree();

  const geometry = useMemo(() => {
    const overflow = GRID.overflow;
    const w = size.width + overflow * 2;
    const h = size.height + overflow * 2;

    const halfW = size.width / 2;
    const halfH = size.height / 2;

    const left = -halfW - overflow;
    const right = halfW + overflow;
    const top = halfH + overflow;
    const bottom = -halfH - overflow;

    const offsetX = ((w / 2) % cellSize) - cellSize / 2;
    const offsetY = ((h / 2) % cellSize) - cellSize / 2;

    const points: number[] = [];

    for (let x = left + offsetX; x <= right; x += cellSize) points.push(x, bottom, 0, x, top, 0);
    for (let y = bottom + offsetY; y <= top; y += cellSize) points.push(left, y, 0, right, y, 0);

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(points, 3));

    return geo;
  }, [size.width, size.height, cellSize]);

  return (
    <lineSegments geometry={geometry} renderOrder={0}>
      <lineBasicMaterial color="#ffffff" transparent opacity={GRID.lineOpacity} depthTest={false} />
    </lineSegments>
  );
};
