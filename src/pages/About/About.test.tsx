import { render, screen } from '@testing-library/react';
import { ABOUT } from '@constants/content';
import { About } from './About';

vi.mock('gsap', () => ({
  default: {
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({ fromTo: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })),
    matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() }))
  }
}));

const mockShowHint = vi.hoisted(() => ({ current: false }));

vi.mock('./hooks/useScrollHint', () => ({
  useScrollHint: () => ({ showHint: mockShowHint.current })
}));

vi.mock('./components/ScrollHint', () => ({
  ScrollHint: ({ isVisible }: { isVisible: boolean }) => <div data-testid="scroll-hint" data-visible={isVisible} />
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return { useGSAP: (cb: () => void) => useEffect(() => cb(), []) };
});

const mockBreakpoint = vi.hoisted(() => ({ current: 'base' }));

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: mockBreakpoint.current,
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));

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

vi.mock('./components/AboutChapter', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    AboutChapter: forwardRef<HTMLDivElement, { number: string; title: string }>(({ number, title }, ref) => (
      <div ref={ref} data-testid={`chapter-${number}`}>
        {title}
      </div>
    ))
  };
});

describe('Given the About page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBreakpoint.current = 'base';
    mockShowHint.current = false;
  });

  describe('When rendered', () => {
    it('Then it should render a section with id "about"', () => {
      render(<About />);
      expect(document.getElementById('about')).toBeInTheDocument();
    });

    it('Then it should render the title "ABOUT ME"', () => {
      render(<About />);
      expect(screen.getByText(ABOUT.title)).toBeInTheDocument();
    });

    it('Then it should render all chapters from ABOUT_CHAPTERS', () => {
      render(<About />);
      ABOUT.chapters.forEach((chapter) => {
        expect(screen.getByTestId(`chapter-${chapter.number}`)).toBeInTheDocument();
        expect(screen.getByText(chapter.title)).toBeInTheDocument();
      });
    });

    it('Then the last chapter ref should be assigned to the last chapter element', () => {
      render(<About />);
      const lastChapter = screen.getByTestId(`chapter-${ABOUT.chapters[ABOUT.chapters.length - 1].number}`);
      expect(lastChapter).toBeInTheDocument();
    });

    it('Then it should render the resume dropdown button', () => {
      render(<About />);
      expect(screen.getByText(ABOUT.buttonLabel)).toBeInTheDocument();
    });
  });

  describe('When rendered at a desktop breakpoint with showHint true', () => {
    it('Then ScrollHint should receive isVisible true', () => {
      mockBreakpoint.current = 'md';
      mockShowHint.current = true;
      render(<About />);
      const hint = screen.getByTestId('scroll-hint');
      expect(hint).toHaveAttribute('data-visible', 'true');
    });
  });

  describe('When rendered at a desktop breakpoint with showHint false', () => {
    it('Then ScrollHint should receive isVisible false', () => {
      mockBreakpoint.current = 'lg';
      mockShowHint.current = false;
      render(<About />);
      const hint = screen.getByTestId('scroll-hint');
      expect(hint).toHaveAttribute('data-visible', 'false');
    });
  });

  describe('When rendered at a mobile breakpoint with showHint true', () => {
    it('Then ScrollHint should receive isVisible false', () => {
      mockBreakpoint.current = 'base';
      mockShowHint.current = true;
      render(<About />);
      const hint = screen.getByTestId('scroll-hint');
      expect(hint).toHaveAttribute('data-visible', 'false');
    });
  });
});
