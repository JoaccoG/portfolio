import { createRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('Given the StatusBadge component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('When rendered', () => {
    it('Then it should display the status text', () => {
      render(<StatusBadge />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('Then it should display the separator', () => {
      render(<StatusBadge />);
      expect(screen.getByText('|')).toBeInTheDocument();
    });

    it('Then it should display the formatted time as HH:MM', () => {
      vi.setSystemTime(new Date(2026, 1, 23, 9, 5));
      render(<StatusBadge />);
      expect(screen.getByText('09:05')).toBeInTheDocument();
    });

    it('Then it should zero-pad single-digit hours and minutes', () => {
      vi.setSystemTime(new Date(2026, 0, 1, 3, 7));
      render(<StatusBadge />);
      expect(screen.getByText('03:07')).toBeInTheDocument();
    });

    it('Then it should display double-digit hours and minutes without extra padding', () => {
      vi.setSystemTime(new Date(2026, 0, 1, 14, 30));
      render(<StatusBadge />);
      expect(screen.getByText('14:30')).toBeInTheDocument();
    });
  });

  describe('When a ref is provided', () => {
    it('Then the ref should point to the outer container div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<StatusBadge ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toContain('Available');
    });
  });

  describe('When the clock interval fires', () => {
    it('Then it should update the displayed time', () => {
      vi.setSystemTime(new Date(2026, 1, 23, 10, 0));
      render(<StatusBadge />);
      expect(screen.getByText('10:00')).toBeInTheDocument();

      vi.setSystemTime(new Date(2026, 1, 23, 10, 1));
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByText('10:01')).toBeInTheDocument();
    });

    it('Then it should clear the interval on unmount', () => {
      const clearSpy = vi.spyOn(globalThis, 'clearInterval');
      const { unmount } = render(<StatusBadge />);
      unmount();
      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });
  });
});
