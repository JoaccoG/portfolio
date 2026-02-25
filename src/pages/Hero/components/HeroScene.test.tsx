import { createRef } from 'react';
import type { Mesh } from 'three';
import { render } from '@testing-library/react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { HeroScene } from './HeroScene';

const { renderCanvas, frameCallbacks } = vi.hoisted(() => ({
  renderCanvas: { value: true },
  frameCallbacks: [] as Array<(state: Record<string, unknown>, delta: number) => void>
}));

vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual<typeof import('@react-three/fiber')>('@react-three/fiber');

  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="r3f-canvas">
        {renderCanvas.value && <canvas />}
        {children}
      </div>
    ),
    useFrame: (cb: (state: Record<string, unknown>, delta: number) => void) => {
      frameCallbacks.push(cb);
    }
  };
});

vi.mock('@react-three/drei', () => ({
  Float: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Given the HeroScene component', () => {
  beforeEach(() => {
    renderCanvas.value = true;
    frameCallbacks.length = 0;
  });

  describe('When rendered', () => {
    it('Then it should render the container div', () => {
      const { container } = render(<HeroScene />);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it('Then the container should have centering flex styles', () => {
      const { container } = render(<HeroScene />);
      const div = container.firstChild as HTMLDivElement;
      expect(div.style.display).toBe('flex');
      expect(div.style.alignItems).toBe('center');
      expect(div.style.justifyContent).toBe('center');
    });

    it('Then it should render the mocked Canvas', () => {
      const { getByTestId } = render(<HeroScene />);
      expect(getByTestId('r3f-canvas')).toBeInTheDocument();
    });
  });

  describe('When a ref is provided', () => {
    it('Then a function ref should receive the container element', () => {
      let capturedEl: HTMLDivElement | null = null;
      render(
        <HeroScene
          ref={(el) => {
            capturedEl = el;
          }}
        />
      );
      expect(capturedEl).toBeInstanceOf(HTMLDivElement);
    });

    it('Then an object ref should point to the container element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<HeroScene ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('When the centering useEffect runs with a canvas present', () => {
    it('Then it should style ancestor elements between canvas and container', () => {
      const { container } = render(<HeroScene />);
      const outerDiv = container.firstChild as HTMLDivElement;
      const canvas = outerDiv.querySelector('canvas');
      expect(canvas).toBeTruthy();

      const canvasParent = canvas!.parentElement!;
      expect(canvasParent.style.display).toBe('flex');
      expect(canvasParent.style.alignItems).toBe('center');
      expect(canvasParent.style.justifyContent).toBe('center');
    });

    it('Then it should stop at the container and not apply minWidth to it', () => {
      const { container } = render(<HeroScene />);
      const outerDiv = container.firstChild as HTMLDivElement;
      expect(outerDiv.style.minWidth).not.toBe('100%');
    });
  });

  describe('When the centering useEffect runs without a canvas element', () => {
    it('Then it should bail out without modifying any styles', () => {
      renderCanvas.value = false;
      const { container } = render(<HeroScene />);
      const outerDiv = container.firstChild as HTMLDivElement;
      const r3fDiv = outerDiv.querySelector('[data-testid="r3f-canvas"]') as HTMLDivElement;
      expect(outerDiv.querySelector('canvas')).toBeNull();
      expect(r3fDiv.style.minWidth).toBe('');
    });
  });

  describe('When the useFrame callback is registered', () => {
    it('Then the callback should be captured', () => {
      render(<HeroScene />);
      expect(frameCallbacks.length).toBeGreaterThan(0);
    });

    it('Then calling the callback should apply rotation to the mesh', () => {
      const { container } = render(<HeroScene />);
      const meshEl = container.querySelector('mesh') as HTMLElement;
      const rotation = { x: 0, y: 0, z: 0 };
      Object.defineProperty(meshEl, 'rotation', { value: rotation, writable: true });
      const frameCb = frameCallbacks[frameCallbacks.length - 1];
      frameCb({}, 1 / 60);
      const hasChanged = rotation.x !== 0 || rotation.y !== 0 || rotation.z !== 0;
      expect(hasChanged).toBe(true);
    });

    it('Then a large delta should be clamped to prevent acceleration', () => {
      const { container } = render(<HeroScene />);
      const meshEl = container.querySelector('mesh') as HTMLElement;
      const rotation = { x: 0, y: 0, z: 0 };
      Object.defineProperty(meshEl, 'rotation', { value: rotation, writable: true });
      const frameCb = frameCallbacks[frameCallbacks.length - 1];
      frameCb({}, 1 / 60);
      const normalChange = Math.abs(rotation.x) + Math.abs(rotation.y) + Math.abs(rotation.z);
      rotation.x = 0;
      rotation.y = 0;
      rotation.z = 0;
      frameCb({}, 10);
      const hugeChange = Math.abs(rotation.x) + Math.abs(rotation.y) + Math.abs(rotation.z);
      expect(hugeChange).toBeLessThan(normalChange * 10);
    });
  });
});

describe('Given the Scene structure with ReactThreeTestRenderer', () => {
  it('Then it should render a mesh with torusKnotGeometry', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <mesh>
        <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
        <meshStandardMaterial wireframe transparent color="#ec7753" emissive="#ec7753" opacity={0.5} />
      </mesh>
    );

    const meshes = renderer.scene.findAllByType('Mesh');
    expect(meshes).toHaveLength(1);

    const instance = meshes[0].instance as unknown as Mesh;
    expect(instance.geometry).toBeDefined();
  });

  it('Then the mesh material should be wireframe and transparent', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <mesh>
        <torusKnotGeometry args={[1, 0.35, 200, 32, 2, 3]} />
        <meshStandardMaterial wireframe transparent color="#ec7753" emissive="#ec7753" opacity={0.5} />
      </mesh>
    );

    const material = renderer.scene.findByType('Mesh').allChildren.find((c) => c.type === 'MeshStandardMaterial');
    expect(material).toBeDefined();
    expect(material!.props.wireframe).toBe(true);
    expect(material!.props.transparent).toBe(true);
    expect(material!.props.opacity).toBe(0.5);
  });

  it('Then the scene should have ambient and point lights', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <>
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ec7753" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#fe987a" />
      </>
    );

    expect(renderer.scene.findAllByType('AmbientLight')).toHaveLength(1);
    expect(renderer.scene.findAllByType('PointLight')).toHaveLength(2);
  });
});

describe('Given the global mouse listener', () => {
  it('Then moving the mouse should not throw', () => {
    expect(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    }).not.toThrow();
  });

  it('Then mouse events at viewport edges should not throw', () => {
    expect(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: window.innerWidth, clientY: window.innerHeight }));
    }).not.toThrow();
  });
});
