import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

const { callGsapSync } = vi.hoisted(() => ({ callGsapSync: { value: false } }));

vi.mock('gsap', () => ({
  default: { fromTo: vi.fn() }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return {
    useGSAP: (cb: () => void) => {
      if (callGsapSync.value) {
        cb();

        return;
      }

      useEffect(() => cb(), []);
    }
  };
});

vi.mock('@components/Section/Section', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    Section: forwardRef<HTMLElement, { children: React.ReactNode; id?: string }>(({ children, id }, ref) => (
      <section ref={ref} id={id}>
        {children}
      </section>
    ))
  };
});

vi.mock('@components/Title/Title', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    Title: forwardRef<HTMLHeadingElement, { children: React.ReactNode }>(({ children }, ref) => (
      <h2 ref={ref}>{children}</h2>
    ))
  };
});

vi.mock('@components/Tape/Tape', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    Tape: forwardRef<HTMLDivElement>((_props, ref) => <div ref={ref} data-testid="tape" />)
  };
});

vi.mock('@components/SpotlightText/SpotlightText', () => ({
  SpotlightText: ({ lines }: { lines: readonly string[] }) => (
    <div data-testid="spotlight">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}));

describe('Given the Projects page', () => {
  beforeEach(() => {
    callGsapSync.value = false;
    vi.clearAllMocks();
  });

  describe('When rendered', () => {
    it('Then it should render a section with id "projects"', () => {
      render(<Projects />);
      expect(document.getElementById('projects')).toBeInTheDocument();
    });

    it('Then it should render the title "PROJECTS"', () => {
      render(<Projects />);
      expect(screen.getByText('PROJECTS')).toBeInTheDocument();
    });

    it('Then it should render the SpotlightText component', () => {
      render(<Projects />);
      expect(screen.getByTestId('spotlight')).toBeInTheDocument();
    });

    it('Then it should render a Tape component', () => {
      render(<Projects />);
      expect(screen.getByTestId('tape')).toBeInTheDocument();
    });

    it('Then it should render the project categories inside the spotlight', () => {
      render(<Projects />);
      expect(screen.getByText('APIs')).toBeInTheDocument();
      expect(screen.getByText('LLMs')).toBeInTheDocument();
      expect(screen.getByText('Open Source')).toBeInTheDocument();
    });
  });

  describe('When useGSAP callback runs before refs are set', () => {
    it('Then it should bail out safely without calling gsap', async () => {
      const gsap = await import('gsap');
      callGsapSync.value = true;

      expect(() => render(<Projects />)).not.toThrow();
      expect(gsap.default.fromTo).not.toHaveBeenCalled();
    });
  });
});
