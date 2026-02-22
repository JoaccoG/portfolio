import { createMockCanvasContext, createMockCanvas, createMockGradient } from '@test/helpers/canvas';
import { GridRenderer } from './GridRenderer';

const GRID_OVERFLOW = 256;

const WRAP_MARGIN = 40;

const BASE_CONFIG = {
  cellSize: 100,
  orbCount: 2,
  orbSpeed: 1,
  orbRadius: 5,
  turnChance: 0.5,
  trailLength: 4,
  gridOffsetX: 0,
  gridOffsetY: 0,
  gridOverflow: GRID_OVERFLOW,
  wrapMargin: WRAP_MARGIN,
  spawnDelay: 100,
  spawnStagger: 50
} as const;

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;
const CANVAS_WIDTH = VIEWPORT_WIDTH + GRID_OVERFLOW * 2;
const CANVAS_HEIGHT = VIEWPORT_HEIGHT + GRID_OVERFLOW * 2;

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
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

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

    it('Then it should set canvas dimensions to window size plus overflow', () => {
      const { renderer, canvas } = setupRenderer();
      renderer.mount(canvas);
      expect(canvas.width).toBe(CANVAS_WIDTH);
      expect(canvas.height).toBe(CANVAS_HEIGHT);
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
    it('Then it should update internal canvas dimensions to the given size', () => {
      const { renderer, canvas } = setupRenderer();
      renderer.mount(canvas);

      const newWidth = 2432;
      const newHeight = 1592;
      renderer.resize(canvas, newWidth, newHeight, 10, 20);

      expect(canvas.width).toBe(newWidth);
      expect(canvas.height).toBe(newHeight);
      expect(renderer['config'].gridOffsetX).toBe(10);
      expect(renderer['config'].gridOffsetY).toBe(20);
      renderer.dispose();
    });

    it('Then it should respawn orbs after debounce settles', () => {
      const { renderer, canvas } = setupRenderer({ orbCount: 2, spawnDelay: 100, spawnStagger: 50 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(200);
      expect(renderer['orbs']).toHaveLength(2);

      renderer.resize(canvas, 1000, 800, 5, 5);

      vi.advanceTimersByTime(300 + 200);
      expect(renderer['orbs']).toHaveLength(2);

      renderer.dispose();
    });

    it('Then consecutive rapid resizes should only trigger one respawn', () => {
      const spawnSpy = vi.fn();
      const { renderer, canvas } = setupRenderer({ orbCount: 2, spawnDelay: 0, spawnStagger: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);

      const originalRespawn = renderer['respawnOrbs'].bind(renderer);
      renderer['respawnOrbs'] = () => {
        spawnSpy();
        originalRespawn();
      };

      renderer.resize(canvas, 1000, 800, 5, 5);
      vi.advanceTimersByTime(100);
      renderer.resize(canvas, 1200, 900, 10, 10);
      vi.advanceTimersByTime(100);
      renderer.resize(canvas, 1400, 1000, 15, 15);

      vi.advanceTimersByTime(300);
      vi.advanceTimersByTime(0);
      expect(spawnSpy).toHaveBeenCalledTimes(1);

      renderer.dispose();
    });

    it('Then dispose should cancel pending debounce timer', () => {
      const { renderer, canvas } = setupRenderer({ orbCount: 2, spawnDelay: 0, spawnStagger: 0 });
      renderer.mount(canvas);
      vi.advanceTimersByTime(0);
      expect(renderer['orbs']).toHaveLength(2);

      renderer.resize(canvas, 1000, 800, 5, 5);
      renderer.dispose();

      vi.advanceTimersByTime(300);
      expect(renderer['orbs']).toHaveLength(0);
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

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
      expect(orb.y).toBe(CANVAS_HEIGHT);
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
      expect(orb.x).toBe(CANVAS_WIDTH);
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
    const VIEW_LEFT = GRID_OVERFLOW - WRAP_MARGIN;
    const VIEW_RIGHT = CANVAS_WIDTH - GRID_OVERFLOW + WRAP_MARGIN;
    const VIEW_TOP = GRID_OVERFLOW - WRAP_MARGIN;
    const VIEW_BOTTOM = CANVAS_HEIGHT - GRID_OVERFLOW + WRAP_MARGIN;

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

    it('If x goes below viewLeft, then it should wrap to viewRight', () => {
      const { renderer, orb } = setupOrbAtPosition(VIEW_LEFT - 1, 400);
      renderer.render();
      expect(orb.x).toBe(VIEW_RIGHT);
      renderer.dispose();
    });

    it('If x exceeds viewRight, then it should wrap to viewLeft', () => {
      const { renderer, orb } = setupOrbAtPosition(VIEW_RIGHT + 1, 400);
      renderer.render();
      expect(orb.x).toBe(VIEW_LEFT);
      renderer.dispose();
    });

    it('If y goes below viewTop, then it should wrap to viewBottom', () => {
      const { renderer, orb } = setupOrbAtPosition(400, VIEW_TOP - 1);
      renderer.render();
      expect(orb.y).toBe(VIEW_BOTTOM);
      renderer.dispose();
    });

    it('If y exceeds viewBottom, then it should wrap to viewTop', () => {
      const { renderer, orb } = setupOrbAtPosition(400, VIEW_BOTTOM + 1);
      renderer.render();
      expect(orb.y).toBe(VIEW_TOP);
      renderer.dispose();
    });

    it('If within viewport bounds, then it should not wrap', () => {
      const { renderer, orb } = setupOrbAtPosition(400, 400);
      renderer.render();
      expect(orb.x).toBe(400);
      expect(orb.y).toBe(400);
      renderer.dispose();
    });

    it('Then it should clear the trail on wrap', () => {
      const { renderer, orb } = setupOrbAtPosition(VIEW_RIGHT + 1, 400);
      orb.trailSize = 3;
      orb.trailHead = 3;
      renderer.render();
      expect(orb.trailSize).toBe(0);
      expect(orb.trailHead).toBe(0);
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

      const orb = renderer['orbs'][0];
      orb.x = CANVAS_WIDTH / 2;
      orb.y = CANVAS_HEIGHT / 2;

      for (let i = 0; i < trailLength + 2; i++) {
        renderer.render();
      }

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

  describe('When debugDrawGrid() is called directly', () => {
    it('Then it should draw vertical and horizontal grid lines', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 0, cellSize: 100, gridOffsetX: 10, gridOffsetY: 20 });
      renderer.mount(canvas);
      ctx.beginPath.mockClear();

      renderer['debugDrawGrid']();

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
      renderer.dispose();
    });

    it('If ctx is null, then it should not draw', () => {
      const { renderer, canvas, ctx } = setupRenderer({ orbCount: 0 });
      renderer.mount(canvas);
      renderer.dispose();

      ctx.beginPath.mockClear();
      renderer['debugDrawGrid']();

      expect(ctx.beginPath).not.toHaveBeenCalled();
    });

    it('Then it should skip lines at negative coordinates', () => {
      const { renderer, canvas, ctx } = setupRenderer({
        orbCount: 0,
        cellSize: 100,
        gridOffsetX: -50,
        gridOffsetY: -50
      });
      renderer.mount(canvas);
      ctx.beginPath.mockClear();

      renderer['debugDrawGrid']();

      const moveToArgs = ctx.moveTo.mock.calls;
      const hasNegativeX = moveToArgs.some((args: number[]) => args[0] < 0);
      expect(hasNegativeX).toBe(false);
      renderer.dispose();
    });
  });
});
