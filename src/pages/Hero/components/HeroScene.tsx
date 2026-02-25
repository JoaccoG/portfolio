import { useRef, useEffect, forwardRef } from 'react';
import { Vector2, Vector3, type Mesh } from 'three';
import { Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';

const AUTO_SPEED = 0.25; // base rotation speed for the idle drift
const DIRECTION_CHANGE_RATE = 0.05; // how quickly the drift direction randomizes
const MOUSE_INFLUENCE = 1; // how strongly the mouse tilts the knot
const MOUSE_SMOOTHING = 90; // hpw fast the knot catches up to the mouse
const MAX_DELTA = 1 / 30;

const globalMouse = new Vector2(0, 0);
if (typeof globalThis.window !== 'undefined')
  globalThis.addEventListener('mousemove', (e: MouseEvent) => {
    globalMouse.set((e.clientX / globalThis.innerWidth) * 2 - 1, -(e.clientY / globalThis.innerHeight) * 2 + 1);
  });

export const HeroScene = forwardRef<HTMLDivElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const setRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = container.querySelector('canvas');
    if (!canvas) return;

    let el: HTMLElement | null = canvas;
    while (el && el !== container) {
      el.style.minWidth = '100%';
      el.style.minHeight = '100%';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.overflow = 'visible';
      el = el.parentElement;
    }
  });

  return (
    <div ref={setRef} style={canvasContainerStyle}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}>
        <Scene />
      </Canvas>
    </div>
  );
});

const TorusKnotMesh = () => {
  const meshRef = useRef<Mesh>(null);
  const velocity = useRef(new Vector3(0.5, 0.3, 0.2));
  const driftTarget = useRef(new Vector3(0.5, 0.3, 0.2));
  const smoothMouse = useRef(new Vector2(0, 0));

  useFrame((_, rawDelta) => {
    if (!meshRef.current) return;

    const delta = Math.min(rawDelta, MAX_DELTA);

    driftTarget.current.x += (Math.random() - 0.5) * DIRECTION_CHANGE_RATE * delta;
    driftTarget.current.y += (Math.random() - 0.5) * DIRECTION_CHANGE_RATE * delta;
    driftTarget.current.z += (Math.random() - 0.5) * DIRECTION_CHANGE_RATE * delta;
    driftTarget.current.normalize().multiplyScalar(AUTO_SPEED);

    velocity.current.lerp(driftTarget.current, delta * 0.5);

    meshRef.current.rotation.x += velocity.current.x * delta;
    meshRef.current.rotation.y += velocity.current.y * delta;
    meshRef.current.rotation.z += velocity.current.z * delta;

    smoothMouse.current.lerp(globalMouse, delta * MOUSE_SMOOTHING);

    const targetTiltX = -smoothMouse.current.y * MOUSE_INFLUENCE;
    const targetTiltY = smoothMouse.current.x * MOUSE_INFLUENCE;

    meshRef.current.rotation.x += (targetTiltX - (meshRef.current.rotation.x % (Math.PI * 2))) * delta * 0.5;
    meshRef.current.rotation.y += (targetTiltY - (meshRef.current.rotation.y % (Math.PI * 2))) * delta * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
      <meshStandardMaterial
        wireframe
        transparent
        color="#ec7753"
        emissive="#ec7753"
        opacity={0.5}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.25} />
    <pointLight position={[5, 5, 5]} intensity={1} color="#ec7753" />
    <pointLight position={[-5, -3, 3]} intensity={0.5} color="#fe987a" />
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
      <group scale={1.8}>
        <TorusKnotMesh />
      </group>
    </Float>
  </>
);

const canvasContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0
};
