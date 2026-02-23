attribute float size;
attribute vec3 color;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = color;
  vAlpha = size > 0.0 ? 1.0 : 0.0;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * 2.0;
  gl_Position = projectionMatrix * mvPosition;
}
