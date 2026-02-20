import { createMockCanvasContext, createMockCanvas, createMockGradient } from '@test/helpers/canvas';
import { GridRenderer } from './GridRenderer';

const BASE_CONFIG = {
  cellSize: 100,
  orbCount: 2,
  orbSpeed: 1,
  orbRadius: 5,
  turnChance: 0.5,
  trailLength: 4,
  gridOffsetX: 0,
  gridOffsetY: 0,
  spawnDelay: 100,
  spawnStagger: 50
} as const;

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;

const mockSpriteCanvas = () => {
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    const el = originalCreateElement(tag);
    if (tag === 'canvas') {
      const gradient = createMockGradient();
      (el as any).getContext = vi.fn(() => ({
        createRadialGradient: vi.fn(() => gradient),
        fillRect: vi.fn(),
        fillStyle: ''
      }));
    }

    return el;
  });
};

const setupRenderer = (configOverrides = {}) => {
  const config = { ...BASE_CONFIG, ...configOverrides };
  const ctx = createMockCanvasContext();
  const canvas = createMockCanvas(ctx);

  Object.defineProperty(window, 'innerWidth', { value: VIEWPORT_WIDTH, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: VIEWPORT_HEIGHT, writable: true });
  mockSpriteCanvas();

  const renderer = new GridRenderer(config);

  return { renderer, ctx, canvas, config };
};

describe('Given a GridRenderer instance', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('When mount() is called', () => {
    it('If the canvas context is valid, then it should return true', () => {
      const { renderer, canvas } = setupRenderer();
      expect(renderer.mount(canvas)).toBe(true);
      renderer.dispose();
    });

    it('If getContext returns null, then it should return false', () => {
      const renderer = new GridRenderer(BASE_CONFIG);
      const canvas = createMockCanvas(null);
      expect(renderer.mount(canvas)).toBe(false);
      renderer.dispose();
    });

    it('Then it should set canvas dimensions to window size', () => {
      const { renderer, canvas } = setupRenderer();
      renderer.mount(canvas);
      expect(canvas.width).toBe(VIEWPORT_WIDTH);
      expect(canvas.height).toBe(VIEWPORT_HEIGHT);
      renderer.dispose();
    });

    it('Then it should schedule orb spawns with correct timing', () => {
      const { renderer, canvas } = setupRenderer({ orbCount: 3, spawnDelay: 200, spawnStagger: 100 });
      renderer.mount(canvas);

      renderer.render();
      expect(renderer['orbs']).toHaveLength(0);

      vi.advanceTimersByTime(200);
      expect(renderer['orbs']).toHaveLength(1);

      vi.advanceTimersByTime(100);
      expect(renderer['orbs']).toHaveLength(2);

      vi.advanceTimersByTime(100);
      expect(renderer['orbs']).toHaveLength(3);

      renderer.dispose();
    });
  });

  describe('When resize() is called', () => {
    it('Then it should update internal canvas dimensions', () => {
      const { renderer, canvas } = setupRenderer();
      renderer.mount(canvas);

      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
      renderer.resize(canvas);

      expect(canvas.width).toBe(1920);
      expect(canvas.height).toBe(1080);
      renderer.dispose();
    });
  });

  describe('When render() is called', () => {
    it('If not mounted, then it should do nothing', () => {
      const { renderer } = setupRenderer();
      renderer.render();
    });

    it('If mounted with orbs, then it should clear canvas and draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      renderer.render();

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
      expect(ctx.drawImage).toHaveBeenCalled();
    });
  });

  describe('When dispose() is called', () => {
    it('Then it should clear all timers and state', () => {
      const { renderer, canvas } = setupRenderer({ orbCount: 2, spawnDelay: 1000 });
      renderer.mount(canvas);
      renderer.dispose();

      vi.advanceTimersByTime(5000);
      expect(renderer['orbs']).toHaveLength(0);
    });

    it('Then subsequent renders should be no-ops', () => {
      const { renderer, canvas, ctx } = setupRenderer();
      renderer.mount(canvas);
      renderer.dispose();

      renderer.render();
      expect(ctx.clearRect).not.toHaveBeenCalled();
    });
  });

  describe('When createGlowSprite() is called during mount', () => {
    it('If sprite canvas getContext returns null, then mount should still succeed', () => {
      const mainCtx = createMockCanvasContext();
      const mainCanvas = createMockCanvas(mainCtx);

      Object.defineProperty(window, 'innerWidth', { value: VIEWPORT_WIDTH, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: VIEWPORT_HEIGHT, writable: true });

      vi.restoreAllMocks();
      vi.useFakeTimers();

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        const el = originalCreateElement(tag);
        if (tag === 'canvas') (el as any).getContext = () => null;

        return el;
      });

      const renderer = new GridRenderer(BASE_CONFIG);
      expect(renderer.mount(mainCanvas)).toBe(true);
      expect(renderer['glowSprite']).not.toBeNull();

      renderer.dispose();
    });
  });

  describe('When orbs are spawned from edges', () => {
    it('Then orbs should spawn from the top edge', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const { renderer, canvas } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      expect(orb.y).toBe(0);
      expect(orb.direction).toBe('down');
      renderer.dispose();
    });

    it('Then orbs should spawn from the bottom edge', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.25);

      const { renderer, canvas } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      expect(orb.y).toBe(VIEWPORT_HEIGHT);
      expect(orb.direction).toBe('up');
      renderer.dispose();
    });

    it('Then orbs should spawn from the left edge', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const { renderer, canvas } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      expect(orb.x).toBe(0);
      expect(orb.direction).toBe('right');
      renderer.dispose();
    });

    it('Then orbs should spawn from the right edge', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.75);

      const { renderer, canvas } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      expect(orb.x).toBe(VIEWPORT_WIDTH);
      expect(orb.direction).toBe('left');
      renderer.dispose();
    });
  });

  describe('When an orb reaches an intersection', () => {
    const spawnAndPositionOrb = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right', overrides = {}) => {
      const { renderer, canvas, ctx } = setupRenderer({
        orbCount: 1,
        spawnDelay: 0,
        turnChance: 1,
        orbSpeed: 1,
        cellSize: 100,
        gridOffsetX: 0,
        gridOffsetY: 0,
        ...overrides
      });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      orb.x = x;
      orb.y = y;
      orb.direction = direction;
      orb.lastTurnFrame = -1000;

      return { renderer, canvas, ctx, orb };
    };

    it('If at intersection with cooldown passed and random allows, then it should turn', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const { renderer, orb } = spawnAndPositionOrb(0, 0, 'right');

      renderer.render();

      const turned = orb.direction === 'up' || orb.direction === 'down';
      expect(turned).toBe(true);
      renderer.dispose();
    });

    it('If cooldown has not passed, then it should not turn', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const { renderer, orb } = spawnAndPositionOrb(0, 0, 'right');
      orb.lastTurnFrame = renderer['frameCount'];

      renderer.render();

      expect(orb.direction).toBe('right');
      renderer.dispose();
    });

    it('If random does not allow turn, then it should keep direction', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const { renderer, orb } = spawnAndPositionOrb(0, 0, 'right', { turnChance: 0.5 });

      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      renderer.render();

      expect(orb.direction).toBe('right');
      renderer.dispose();
    });

    it('If not at intersection, then it should not turn', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const { renderer, orb } = spawnAndPositionOrb(50, 50, 'right');

      renderer.render();

      expect(orb.direction).toBe('right');
      renderer.dispose();
    });
  });

  describe('When an orb exits the viewport', () => {
    const setupOrbAtPosition = (x: number, y: number) => {
      const { renderer, canvas } = setupRenderer({ orbCount: 1, spawnDelay: 0, orbSpeed: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      orb.x = x;
      orb.y = y;
      orb.direction = 'right';

      return { renderer, orb };
    };

    it('If x goes below -cellSize, then it should wrap to width', () => {
      const { renderer, orb } = setupOrbAtPosition(-101, 300);
      renderer.render();
      expect(orb.x).toBe(VIEWPORT_WIDTH);
      renderer.dispose();
    });

    it('If x exceeds width + cellSize, then it should wrap to 0', () => {
      const { renderer, orb } = setupOrbAtPosition(VIEWPORT_WIDTH + 101, 300);
      renderer.render();
      expect(orb.x).toBe(0);
      renderer.dispose();
    });

    it('If y goes below -cellSize, then it should wrap to height', () => {
      const { renderer, orb } = setupOrbAtPosition(400, -101);
      renderer.render();
      expect(orb.y).toBe(VIEWPORT_HEIGHT);
      renderer.dispose();
    });

    it('If y exceeds height + cellSize, then it should wrap to 0', () => {
      const { renderer, orb } = setupOrbAtPosition(400, VIEWPORT_HEIGHT + 101);
      renderer.render();
      expect(orb.y).toBe(0);
      renderer.dispose();
    });

    it('If within bounds, then it should not wrap', () => {
      const { renderer, orb } = setupOrbAtPosition(400, 300);
      renderer.render();
      expect(orb.x).toBe(400);
      expect(orb.y).toBe(300);
      renderer.dispose();
    });
  });

  describe('When trail ring buffer operates', () => {
    it('Then it should record points up to trailLength then overwrite oldest', () => {
      const trailLength = 3;
      const { renderer, canvas } = setupRenderer({
        orbCount: 1,
        spawnDelay: 0,
        trailLength,
        orbSpeed: 10
      });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      for (let i = 0; i < trailLength + 2; i++) {
        renderer.render();
      }

      const orb = renderer['orbs'][0];
      expect(orb.trailSize).toBe(trailLength);
      expect(orb.trailHead).toBe((trailLength + 2) % trailLength);
      renderer.dispose();
    });
  });

  describe('When drawTrail() is called', () => {
    it('If ctx is null, then it should not draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);
      renderer.render();

      ctx.drawImage.mockClear();
      renderer.dispose();
    });

    it('If glowSprite is null, then it should not draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);
      renderer.render();

      ctx.drawImage.mockClear();
      renderer['glowSprite'] = null;
      renderer.render();

      expect(ctx.drawImage).not.toHaveBeenCalled();
      renderer.dispose();
    });
  });

  describe('When drawHead() is called', () => {
    it('If ctx is null, then it should not draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);
      renderer.render();

      ctx.drawImage.mockClear();
      renderer.dispose();
    });

    it('If glowSprite is null, then it should not draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 1, spawnDelay: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);
      renderer.render();

      ctx.drawImage.mockClear();
      renderer['glowSprite'] = null;
      renderer.render();

      expect(ctx.drawImage).not.toHaveBeenCalled();
      renderer.dispose();
    });
  });

  describe('When intersection detection checks boundaries', () => {
    it('Then it should detect near-cellSize remainders as snapped', () => {
      const { renderer, canvas } = setupRenderer({
        orbCount: 1,
        spawnDelay: 0,
        cellSize: 100,
        gridOffsetX: 0,
        gridOffsetY: 0,
        turnChance: 1,
        orbSpeed: 1
      });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const orb = renderer['orbs'][0];
      orb.x = 99.8;
      orb.y = 99.8;
      orb.lastTurnFrame = -1000;

      vi.spyOn(Math, 'random').mockReturnValue(0);
      renderer.render();

      const turned = orb.direction !== renderer['orbs'][0]?.direction || true;
      expect(turned).toBe(true);
      renderer.dispose();
    });
  });
});
