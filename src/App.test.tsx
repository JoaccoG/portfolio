import { render, screen } from '@testing-library/react';
import { App } from './App';

vi.mock('gsap', () => ({
  default: {
    set: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({ fromTo: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })),
    matchMedia: vi.fn(() => ({ add: vi.fn() }))
  }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return { useGSAP: (cb: () => void) => useEffect(() => cb(), []) };
});

vi.mock('@hooks/useSmoothScroll', () => ({
  useSmoothScroll: () => ({ scrollTo: vi.fn() })
}));

vi.mock('@components/Overlay/Overlay', () => ({
  Overlay: () => <div data-testid="overlay" />
}));

vi.mock('@components/Header/Header', () => ({
  Header: () => <header data-testid="header" />
}));

vi.mock('@pages/Hero/Hero', () => ({
  Hero: () => <div data-testid="hero" />
}));

vi.mock('@pages/About/About', () => ({
  About: () => <div data-testid="about" />
}));

describe('Given the App component', () => {
  describe('When rendered', () => {
    it('Then it should render the Overlay', () => {
      render(<App />);
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('Then it should render the Header', () => {
      render(<App />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('Then it should render the Hero section', () => {
      render(<App />);
      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    it('Then it should render the About section', () => {
      render(<App />);
      expect(screen.getByTestId('about')).toBeInTheDocument();
    });

    it('Then it should render Hero and About inside a main element', () => {
      render(<App />);
      const main = screen.getByRole('main');
      expect(main).toContainElement(screen.getByTestId('hero'));
      expect(main).toContainElement(screen.getByTestId('about'));
    });
  });
});
