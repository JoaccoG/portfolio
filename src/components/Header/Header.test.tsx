import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import gsap from 'gsap';
import { Header } from './Header';

let callGsapBeforeMount = false;
let currentBreakpoint = 'base';
let renderUnderlinePath = true;

vi.mock('gsap', () => ({
  default: { timeline: vi.fn(() => ({ fromTo: vi.fn().mockReturnThis(), to: vi.fn().mockReturnThis() })), set: vi.fn() }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return {
    useGSAP: (cb: () => void) => {
      if (callGsapBeforeMount) cb();
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

vi.mock('@components/icons/BlogUnderline', async () => {
  const { createSvgIconMock } = await vi.importActual<typeof import('@test/helpers/svg')>('@test/helpers/svg');

  return {
    BlogUnderline: createSvgIconMock({ testId: 'blog-underline', renderPath: () => renderUnderlinePath })
  };
});

describe('Given the Header component', () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    currentBreakpoint = 'base';
  });

  describe('When useGSAP fires before mount', () => {
    it('Then it should bail out safely when headerRef is null', () => {
      callGsapBeforeMount = true;
      render(<Header scrollTo={scrollTo} />);
      callGsapBeforeMount = false;
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('When the underline SVG has no path element', () => {
    it('Then it should skip the underline animation', () => {
      renderUnderlinePath = false;
      render(<Header scrollTo={scrollTo} />);
      renderUnderlinePath = true;
      expect(gsap.set).not.toHaveBeenCalled();
    });
  });

  describe('When rendered at base breakpoint', () => {
    it('Then it should render all nav links and the blog link', () => {
      render(<Header scrollTo={scrollTo} />);
      expect(screen.getByText('ABOUT')).toBeInTheDocument();
      expect(screen.getByText('WORK')).toBeInTheDocument();
      expect(screen.getByText('CONTACT')).toBeInTheDocument();
      expect(screen.getByText('BLOG')).toBeInTheDocument();
    });

    it('Then the header position should be relative', () => {
      render(<Header scrollTo={scrollTo} />);
      const header = screen.getByRole('banner');
      expect(header.style.position).toBe('relative');
    });

    it('Then the nav links container should be hidden', () => {
      render(<Header scrollTo={scrollTo} />);
      const aboutLink = screen.getByText('ABOUT');
      expect(aboutLink.parentElement!.style.display).toBe('none');
    });

    it('Then the blog underline SVG should be rendered', () => {
      render(<Header scrollTo={scrollTo} />);
      expect(screen.getByTestId('blog-underline')).toBeInTheDocument();
    });

    it('Then it should NOT create a scroll-triggered timeline', () => {
      render(<Header scrollTo={scrollTo} />);
      const timelineCalls = vi.mocked(gsap.timeline).mock.calls;
      const hasScrollTrigger = timelineCalls.some(
        (call) => call[0] && 'scrollTrigger' in (call[0] as Record<string, unknown>)
      );
      expect(hasScrollTrigger).toBe(false);
    });
  });

  describe('When rendered at sm breakpoint', () => {
    beforeEach(() => {
      currentBreakpoint = 'sm';
    });

    it('Then the header position should be fixed', () => {
      render(<Header scrollTo={scrollTo} />);
      const header = screen.getByRole('banner');
      expect(header.style.position).toBe('fixed');
    });

    it('Then the nav links container should be visible', () => {
      render(<Header scrollTo={scrollTo} />);
      const aboutLink = screen.getByText('ABOUT');
      expect(aboutLink.parentElement!.style.display).toBe('flex');
    });

    it('Then it should create a scroll-triggered timeline', () => {
      render(<Header scrollTo={scrollTo} />);
      const timelineCalls = vi.mocked(gsap.timeline).mock.calls;
      const hasScrollTrigger = timelineCalls.some(
        (call) => call[0] && 'scrollTrigger' in (call[0] as Record<string, unknown>)
      );
      expect(hasScrollTrigger).toBe(true);
    });
  });

  describe('When a hash nav link is clicked', () => {
    it('Then it should call scrollTo with the section name', async () => {
      const user = userEvent.setup();
      render(<Header scrollTo={scrollTo} />);
      await user.click(screen.getByText('ABOUT'));
      expect(scrollTo).toHaveBeenCalledWith('about');
    });
  });

  describe('When the blog link is clicked', () => {
    it('Then it should not call scrollTo since it is a path href', async () => {
      const user = userEvent.setup();
      render(<Header scrollTo={scrollTo} />);
      await user.click(screen.getByText('BLOG'));
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('When a nav link is hovered', () => {
    it('Then the link color should change to primary on hover and back on leave', async () => {
      const user = userEvent.setup();
      render(<Header scrollTo={scrollTo} />);
      const link = screen.getByText('ABOUT').closest('a')!;

      expect(link.style.color).toBe('var(--color-white)');
      await user.hover(link);
      expect(link.style.color).toBe('var(--color-primary)');
      await user.unhover(link);
      expect(link.style.color).toBe('var(--color-white)');
    });

    it('Then the blog underline color should change on hover', async () => {
      const user = userEvent.setup();
      render(<Header scrollTo={scrollTo} />);
      const blogLink = screen.getByText('BLOG').closest('a')!;
      const underline = screen.getByTestId('blog-underline');

      await user.hover(blogLink);
      expect(underline.style.color).toBe('var(--color-primary)');
      await user.unhover(blogLink);
      expect(underline.style.color).toBe('var(--color-white)');
    });
  });
});
