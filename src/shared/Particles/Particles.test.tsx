import { render, screen, waitFor } from '@testing-library/react';
import Particles from './Particles';
import { getParticlesNumber } from '../../utils';

vi.mock('../../utils', () => ({
  getParticlesNumber: vi.fn(() => 80)
}));

vi.mock('@tsparticles/react', () => ({
  initParticlesEngine: vi.fn(() => Promise.resolve()),
  default: () => <div data-testid="particlesComponent" />
}));

describe('Given a "Particles" component', (): void => {
  beforeAll((): void => {
    vi.spyOn(console, 'error').mockImplementation((): void => {});
  });
  afterEach((): void => {
    vi.clearAllMocks();
  });
  afterAll((): void => {
    vi.restoreAllMocks();
  });

  describe('When it renders', (): void => {
    test('Then it should call "getParticlesNumber"', async (): Promise<void> => {
      render(<Particles />);
      expect(getParticlesNumber).toHaveBeenCalled();
    });
  });

  describe('When loading is finished', (): void => {
    test('Then it should render the particles component', async (): Promise<void> => {
      render(<Particles />);
      await waitFor((): void => expect(screen.getByTestId('particlesComponent')).toBeInTheDocument());
    });
  });

  describe('When loading fails', (): void => {
    test('Then it should update the particles count', async (): Promise<void> => {
      render(<Particles />);
      vi.mocked(getParticlesNumber).mockReturnValueOnce(100);
      window.innerWidth = 1920;
      window.innerHeight = 1080;
      window.dispatchEvent(new Event('resize'));
      await waitFor((): void => expect(getParticlesNumber).toHaveBeenCalledTimes(1));
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
