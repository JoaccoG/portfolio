import type { CSSProperties } from 'react';

interface VignetteLayerProps {
  style: CSSProperties;
}

export const VignetteLayer = ({ style }: VignetteLayerProps) => <div style={style} />;
