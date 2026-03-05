import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Tape } from './Tape';

describe('Given the Tape component', () => {
  describe('When rendered with defaults', () => {
    it('Then it should render the default text repeated 30 times', () => {
      render(<Tape />);
      const items = screen.getAllByText('COMING SOON');
      expect(items).toHaveLength(30);
    });

    it('Then it should use the right direction animation by default', () => {
      render(<Tape />);
      const track = screen.getAllByText('COMING SOON')[0].parentElement!.parentElement!;
      expect(track.style.animation).toContain('tapeMarqueeRight');
    });

    it('Then it should apply default rotation of 0deg', () => {
      render(<Tape />);
      const wrapper = screen.getAllByText('COMING SOON')[0].closest('div')!.parentElement!;
      expect(wrapper.style.transform).toBe('rotate(0deg)');
    });
  });

  describe('When rendered with custom text and repetitions', () => {
    it('Then it should render the custom text the specified number of times', () => {
      render(<Tape text="HELLO" repetitions={5} />);
      const items = screen.getAllByText('HELLO');
      expect(items).toHaveLength(5);
    });
  });

  describe('When direction is left', () => {
    it('Then it should use the left animation', () => {
      render(<Tape direction="left" />);
      const track = screen.getAllByText('COMING SOON')[0].parentElement!.parentElement!;
      expect(track.style.animation).toContain('tapeMarqueeLeft');
    });
  });

  describe('When speed is a plain number', () => {
    it('Then it should use that number as duration in seconds', () => {
      render(<Tape speed={25} />);
      const track = screen.getAllByText('COMING SOON')[0].parentElement!.parentElement!;
      expect(track.style.animation).toContain('25s');
    });
  });

  describe('When speed is a responsive value', () => {
    it('Then it should resolve to the fallback at base breakpoint', () => {
      render(<Tape speed={{ base: 40, md: 60 }} />);
      const track = screen.getAllByText('COMING SOON')[0].parentElement!.parentElement!;
      expect(track.style.animation).toMatch(/\d+s/);
    });
  });

  describe('When angle is a plain number', () => {
    it('Then it should use that number as rotation in degrees', () => {
      render(<Tape angle={-3} />);
      const wrapper = screen.getAllByText('COMING SOON')[0].closest('div')!.parentElement!;
      expect(wrapper.style.transform).toBe('rotate(-3deg)');
    });
  });

  describe('When angle is a responsive value', () => {
    it('Then it should resolve the angle', () => {
      render(<Tape angle={{ base: 5, md: 10 }} />);
      const wrapper = screen.getAllByText('COMING SOON')[0].closest('div')!.parentElement!;
      expect(wrapper.style.transform).toMatch(/rotate\(-?\d+deg\)/);
    });
  });

  describe('When a ref is passed', () => {
    it('Then it should forward the ref to the root div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Tape ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
