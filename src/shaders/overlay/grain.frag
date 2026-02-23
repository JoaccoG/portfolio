uniform float uTime;
uniform float uFps;
uniform float uOpacity;
uniform float uWarmth;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float quantizedTime = floor(uTime * uFps) / uFps;
  float noise = hash(vUv * 512.0 + quantizedTime * 100.0);
  float warmShift = (hash(vUv * 256.0 + quantizedTime * 73.0) - 0.5) * uWarmth;

  vec3 grainColor = vec3(noise + warmShift, noise, noise - warmShift);

  gl_FragColor = vec4(grainColor, uOpacity);
}
