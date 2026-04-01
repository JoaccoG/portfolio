import { render, screen } from '@testing-library/react';
import { ScrollHint } from './ScrollHint';

const { mockKill, mockTo } = vi.hoisted(() => {
  const mockKill = vi.fn();
  const mockTo = vi.fn((_target: unknown, _vars: Record<string, unknown>) => ({ kill: mockKill }));

  return { mockTo, mockKill };
});

vi.mock('gsap', () => ({
  default: { to: mockTo }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return { useGSAP: (cb: () => void) => useEffect(() => cb(), []) };
});

describe('Given the ScrollHint component', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('When rendered', () => {
    it('Then it should render the "Scroll" label', () => {
      render(<ScrollHint isVisible={false} />);
      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });

    it('Then it should render the arrow icon', () => {
      render(<ScrollHint isVisible={false} />);
      expect(screen.getByTestId('svg-icon-arrowDown')).toBeInTheDocument();
    });

    it('Then it should start the bounce animation on the arrow', () => {
      render(<ScrollHint isVisible={false} />);
      const bounceCall = mockTo.mock.calls.find(([, opts]) => opts?.yoyo === true);
      expect(bounceCall).toBeDefined();
      expect(bounceCall![1]).toMatchObject({ y: 7, duration: 0.7, repeat: -1 });
    });

    it('Then it should call gsap.to for the initial visibility transition', () => {
      render(<ScrollHint isVisible={false} />);
      const visCall = mockTo.mock.calls.find(([, opts]) => opts?.overwrite === true);
      expect(visCall).toBeDefined();
      expect(visCall![1]).toMatchObject({ opacity: 0, overwrite: true });
    });
  });

  describe('When isVisible is false on first render', () => {
    it('Then gsap.to should animate to opacity 0 with 250ms duration', () => {
      render(<ScrollHint isVisible={false} />);
      const visCall = mockTo.mock.calls.find(([, opts]) => opts?.overwrite === true);
      expect(visCall![1]).toMatchObject({ opacity: 0, duration: 0.25 });
    });
  });

  describe('When isVisible becomes true (appearing)', () => {
    it('Then it should call gsap.to with opacity 1 and 250ms duration', () => {
      const { rerender } = render(<ScrollHint isVisible={false} />);
      mockTo.mockClear();
      rerender(<ScrollHint isVisible={true} />);
      const visCall = mockTo.mock.calls.find(([, opts]) => opts?.overwrite === true);
      expect(visCall![1]).toMatchObject({ opacity: 1, duration: 0.25, overwrite: true });
    });
  });

  describe('When isVisible goes from true to false (hiding)', () => {
    it('Then it should call gsap.to with opacity 0 and 100ms duration', () => {
      const { rerender } = render(<ScrollHint isVisible={true} />);
      mockTo.mockClear();
      rerender(<ScrollHint isVisible={false} />);
      const visCall = mockTo.mock.calls.find(([, opts]) => opts?.overwrite === true);
      expect(visCall![1]).toMatchObject({ opacity: 0, duration: 0.1, overwrite: true });
    });
  });

  describe('When the component unmounts', () => {
    it('Then it should kill the active visibility tween', () => {
      const { unmount } = render(<ScrollHint isVisible={false} />);
      unmount();
      expect(mockKill).toHaveBeenCalled();
    });
  });
});
