import { useRef } from 'react';
import { render, act } from '@testing-library/react';
import { useMousePosition } from './useMousePosition';

interface TestHarnessProps {
  onPosition: (pos: { x: number; y: number }) => void;
}

const TestHarness = ({ onPosition }: TestHarnessProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useMousePosition(ref);
  onPosition(pos);

  return <div ref={ref} data-testid="target" />;
};

describe('Given the useMousePosition hook', () => {
  let rafCbs: FrameRequestCallback[];
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    rafCbs = [];
    rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCbs.push(cb);

      return rafCbs.length;
    });
    cancelRafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });

  describe('When mounted', () => {
    it('Then it should return the initial position (0, 0)', () => {
      let latest = { x: -1, y: -1 };
      render(<TestHarness onPosition={(p) => (latest = p)} />);
      expect(latest).toEqual({ x: 0, y: 0 });
    });

    it('Then it should register a mousemove listener on globalThis', () => {
      const addSpy = vi.spyOn(globalThis, 'addEventListener');
      render(<TestHarness onPosition={() => {}} />);
      expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      addSpy.mockRestore();
    });
  });

  describe('When a mousemove event fires', () => {
    it('Then it should update position relative to the container', () => {
      let latest = { x: 0, y: 0 };
      const { getByTestId } = render(<TestHarness onPosition={(p) => (latest = p)} />);
      const target = getByTestId('target');

      target.getBoundingClientRect = vi.fn(() => ({
        width: 400,
        height: 300,
        top: 50,
        left: 100,
        bottom: 350,
        right: 500,
        x: 100,
        y: 50,
        toJSON: () => {}
      }));

      act(() => {
        globalThis.dispatchEvent(new MouseEvent('mousemove', { clientX: 250, clientY: 150 }));
      });

      act(() => {
        const cb = rafCbs.shift();
        if (cb) cb(0);
      });

      expect(latest).toEqual({ x: 150, y: 100 });
    });

    it('Then it should cancel the previous rAF before scheduling a new one', () => {
      render(<TestHarness onPosition={() => {}} />);

      act(() => {
        globalThis.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
      });

      act(() => {
        globalThis.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
      });

      expect(cancelRafSpy).toHaveBeenCalled();
    });

    it('Then it should bail out if the container ref is null', () => {
      const NullRefHarness = () => {
        const ref = useRef<HTMLDivElement>(null);
        useMousePosition(ref);

        return null;
      };

      render(<NullRefHarness />);

      act(() => {
        globalThis.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
      });

      act(() => {
        const cb = rafCbs.shift();
        if (cb) cb(0);
      });
    });
  });

  describe('When enabled is false', () => {
    it('Then it should NOT register a mousemove listener', () => {
      const addSpy = vi.spyOn(globalThis, 'addEventListener');

      const DisabledHarness = () => {
        const ref = useRef<HTMLDivElement>(null);
        useMousePosition(ref, false);

        return <div ref={ref} />;
      };

      render(<DisabledHarness />);
      expect(addSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
      addSpy.mockRestore();
    });
  });

  describe('When unmounted', () => {
    it('Then it should remove the mousemove listener and cancel pending rAF', () => {
      const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
      const { unmount } = render(<TestHarness onPosition={() => {}} />);
      unmount();

      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(cancelRafSpy).toHaveBeenCalled();
      removeSpy.mockRestore();
    });
  });
});
