import { screen, waitFor } from '@testing-library/react';
import { renderWithMemoryRouter } from '@utils/tests';
import { Particles } from '@components/Particles/Particles';

describe('Given a "Particles" component', () => {
  vi.mock('@tsparticles/react', () => ({
    initParticlesEngine: vi.fn(() => Promise.resolve()),
    default: () => <div id="particlesComponent" />
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('When loading is finished', () => {
    test('Then it should render the particles component', async () => {
      renderWithMemoryRouter(<Particles />);
      await waitFor(() => expect(screen.getByRole('generic')).toBeInTheDocument());
    });
  });

  describe('When "initParticlesEngine" fails', () => {
    test('Then it should log an error', async () => {
      const error = new Error('Test Error');
      const tsparticles = await import('@tsparticles/react');
      vi.mocked(tsparticles.initParticlesEngine).mockImplementationOnce(async () => Promise.reject(error));
      renderWithMemoryRouter(<Particles />);
      await waitFor(() => expect(console.error).toHaveBeenCalledWith('Failed to initialize particles:', error));
    });
  });
});
