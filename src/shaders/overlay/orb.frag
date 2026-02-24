varying vec3 vColor;
varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  gl_FragColor = vec4(vColor * glow, glow * vAlpha);
}
