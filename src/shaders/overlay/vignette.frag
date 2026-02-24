uniform float uTime;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uMaxDarkness;
uniform float uPulseDuration;
uniform float uAspect;
varying vec2 vUv;

void main() {
  vec2 center = vUv - 0.5;
  center.x *= uAspect;
  float dist = length(center) / (uAspect * 0.5);

  float vignette = smoothstep(uInnerRadius, uOuterRadius, dist);

  float t = mod(uTime, uPulseDuration) / uPulseDuration;

  float pulse;
  if (t < 0.3) {
    pulse = mix(0.6, 1.0, smoothstep(0.0, 0.3, t));
  } else if (t < 0.6) {
    pulse = mix(1.0, 0.4, smoothstep(0.3, 0.6, t));
  } else if (t < 0.8) {
    pulse = mix(0.4, 0.8, smoothstep(0.6, 0.8, t));
  } else {
    pulse = mix(0.8, 0.6, smoothstep(0.8, 1.0, t));
  }

  float alpha = vignette * uMaxDarkness * pulse;

  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
