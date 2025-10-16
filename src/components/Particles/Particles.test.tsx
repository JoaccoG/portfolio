import { render, screen, waitFor } from '@testing-library/react';
import { Particles } from '@components/Particles/Particles';

vi.mock('@tsparticles/react', () => ({
  initParticlesEngine: vi.fn(() => Promise.resolve()),
  default: () => <div data-testid="particlesComponent" />
}));

describe('Given a "Particles" component', (): void => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

  describe('When loading is finished', (): void => {
    test('Then it should render the particles component', async (): Promise<void> => {
      render(<Particles />);
      await waitFor((): void => expect(screen.getByTestId('particlesComponent')).toBeInTheDocument());
    });
  });

  describe('When "initParticlesEngine" fails', (): void => {
    test('Then it should log an error', async (): Promise<void> => {
      const error = new Error('Test Error');
      const tsparticles = await import('@tsparticles/react');
      vi.mocked(tsparticles.initParticlesEngine).mockImplementationOnce(async (): Promise<never> => {
        throw error;
      });
      render(<Particles />);
      await waitFor((): void => expect(console.error).toHaveBeenCalledWith('Failed to initialize particles:', error));
    });
  });
});
