import gsap from 'gsap';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

let currentBreakpoint = 'base';
let gsapBeforeMount = false;

vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({ fromTo: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })),
    set: vi.fn()
  }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return {
    useGSAP: (cb: () => void) => {
      if (gsapBeforeMount) cb();
      useEffect(() => cb(), []);
    }
  };
});

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: currentBreakpoint,
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));

vi.mock('./components/StatusBadge', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    StatusBadge: forwardRef<HTMLDivElement>((_props, ref) => (
      <div ref={ref} data-testid="status-badge">
        StatusBadge
      </div>
    ))
  };
});

vi.mock('./components/HeroScene', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    HeroScene: forwardRef<HTMLDivElement>((_props, ref) => (
      <div ref={ref} data-testid="hero-scene">
        HeroScene
      </div>
    ))
  };
});

describe('Given the Hero page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentBreakpoint = 'base';
    gsapBeforeMount = false;
  });

  describe('When rendered at base breakpoint', () => {
    it('Then it should render a section with id "hero"', () => {
      render(<Hero />);
      expect(document.getElementById('hero')).toBeInTheDocument();
    });

    it('Then it should render the StatusBadge', () => {
      render(<Hero />);
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });

    it('Then it should render the HeroScene', () => {
      render(<Hero />);
      expect(screen.getByTestId('hero-scene')).toBeInTheDocument();
    });

    it('Then it should render the title', () => {
      render(<Hero />);
      expect(screen.getByText('Joaquin Godoy')).toBeInTheDocument();
    });

    it('Then it should render the subtitle', () => {
      render(<Hero />);
      expect(screen.getByText('I turn coffee and messy ideas into real working products')).toBeInTheDocument();
    });

    it('Then it should NOT render traits on mobile', () => {
      render(<Hero />);
      expect(screen.queryByText('User-Focused')).not.toBeInTheDocument();
    });
  });

  describe('When rendered at sm (desktop) breakpoint', () => {
    beforeEach(() => {
      currentBreakpoint = 'sm';
    });

    it('Then it should render all traits', () => {
      render(<Hero />);
      expect(screen.getByText('User-Focused')).toBeInTheDocument();
      expect(screen.getByText('Practical')).toBeInTheDocument();
      expect(screen.getByText('Analytical')).toBeInTheDocument();
      expect(screen.getByText('Quality-Oriented')).toBeInTheDocument();
    });
  });

  describe('When rendered at md breakpoint', () => {
    it('Then it should also render traits', () => {
      currentBreakpoint = 'md';
      render(<Hero />);
      expect(screen.getByText('Practical')).toBeInTheDocument();
    });
  });

  describe('When rendered at lg breakpoint', () => {
    it('Then it should also render traits', () => {
      currentBreakpoint = 'lg';
      render(<Hero />);
      expect(screen.getByText('Analytical')).toBeInTheDocument();
    });
  });

  describe('When rendered at xl breakpoint', () => {
    it('Then it should also render traits', () => {
      currentBreakpoint = 'xl';
      render(<Hero />);
      expect(screen.getByText('Quality-Oriented')).toBeInTheDocument();
    });
  });

  describe('When useGSAP fires', () => {
    it('Then it should create a GSAP timeline', () => {
      render(<Hero />);
      expect(gsap.timeline).toHaveBeenCalled();
    });

    it('Then the timeline should animate badge, scene, title, and subtitle', () => {
      render(<Hero />);
      const timeline = vi.mocked(gsap.timeline).mock.results[0].value;
      expect(timeline.fromTo).toHaveBeenCalledTimes(4);
    });

    it('Then the timeline should also animate traits at desktop breakpoint', () => {
      currentBreakpoint = 'sm';
      render(<Hero />);
      const timeline = vi.mocked(gsap.timeline).mock.results[0].value;
      expect(timeline.fromTo).toHaveBeenCalledTimes(5);
    });
  });

  describe('When useGSAP fires before mount', () => {
    it('Then it should bail out safely when sectionRef is null', () => {
      gsapBeforeMount = true;
      render(<Hero />);
      gsapBeforeMount = false;
      expect(screen.getByText('Joaquin Godoy')).toBeInTheDocument();
    });
  });
});
