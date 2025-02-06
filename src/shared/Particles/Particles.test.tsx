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
  afterEach((): void => {
    vi.clearAllMocks();
  });

  test('When it renders, then it should call "getParticlesNumber"', async (): Promise<void> => {
    render(<Particles />);
    expect(getParticlesNumber).toHaveBeenCalled();
  });

  test('When loading is finished, then it should render the particles component', async (): Promise<void> => {
    render(<Particles />);
    await waitFor((): void => expect(screen.getByTestId('particlesComponent')).toBeInTheDocument());
  });

  test('When resizing the window, then it should update the particles count', async (): Promise<void> => {
    render(<Particles />);
    vi.mocked(getParticlesNumber).mockReturnValueOnce(100);
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    window.dispatchEvent(new Event('resize'));
    await waitFor((): void => expect(getParticlesNumber).toHaveBeenCalledTimes(1));
  });
});
