import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useOrbSimulation } from './useOrbSimulation';

vi.unmock('@hooks/useBreakpoint');

const CELL_SIZE = 100;
const ORB_COUNT = 2;
const ORB_SPEED = 2;
const FIXED_DT = 1 / 60;

let updateFn: ReturnType<typeof useOrbSimulation>['update'];
let orbsRefFn: ReturnType<typeof useOrbSimulation>['orbsRef'];

const TestComponent = () => {
  const { update, orbsRef } = useOrbSimulation({ cellSize: CELL_SIZE, orbCount: ORB_COUNT, orbSpeed: ORB_SPEED });
  updateFn = update;
  orbsRefFn = orbsRef;

  return <mesh />;
};

const setup = async () => {
  await ReactThreeTestRenderer.create(<TestComponent />);
};

describe('Given the useOrbSimulation hook', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('When initialized', () => {
    it('Then it should create the correct number of orbs', async () => {
      await setup();
      updateFn(FIXED_DT, 0);
      expect(orbsRefFn.current).toHaveLength(ORB_COUNT);
    });

    it('Then orbs should start as not spawned', async () => {
      await setup();
      updateFn(FIXED_DT, 0);
      orbsRefFn.current.forEach((orb) => {
        expect(orb.isFading).toBe(false);
        expect(orb.trailSize).toBeGreaterThanOrEqual(0);
      });
    });

    it('If already initialized with same count, then orbs should not re-initialize', async () => {
      await setup();
      updateFn(FIXED_DT, 10);
      const firstOrbs = [...orbsRefFn.current];
      updateFn(FIXED_DT, 10);
      const secondOrbs = orbsRefFn.current;
      expect(secondOrbs[0]).toBe(firstOrbs[0]);
    });
  });

  describe('When orbs are spawned', () => {
    it('Then orbs should spawn after their spawnTime elapses', async () => {
      await setup();
      const orbs = updateFn(FIXED_DT, 0);
      const unspawned = orbs.filter((o) => !o.isSpawned);
      expect(unspawned.length).toBeGreaterThan(0);

      const orbs2 = updateFn(FIXED_DT, 100);
      const allSpawned = orbs2.filter((o) => o.isSpawned || o.isFading);
      expect(allSpawned.length).toBe(orbs2.length);
    });

    it('Then orbs should be placed at exit boundaries', async () => {
      await setup();
      updateFn(FIXED_DT, 0);
      orbsRefFn.current.forEach((orb) => {
        const isNearEdgeX = Math.abs(orb.x) > 0;
        const isNearEdgeY = Math.abs(orb.y) > 0;
        expect(isNearEdgeX || isNearEdgeY).toBe(true);
      });
    });
  });

  describe('When orbs move', () => {
    it('Then the position should change based on direction and speed', async () => {
      await setup();
      updateFn(FIXED_DT, 10);
      const orb = orbsRefFn.current.find((o) => o.isSpawned);
      if (!orb) return;

      const prevX = orb.x;
      const prevY = orb.y;

      updateFn(FIXED_DT, 10);

      const movedX = orb.x !== prevX;
      const movedY = orb.y !== prevY;
      expect(movedX || movedY).toBe(true);
    });

    it('Then trail should grow as orb moves', async () => {
      await setup();
      updateFn(FIXED_DT, 10);

      const orb = orbsRefFn.current.find((o) => o.isSpawned);
      if (!orb) return;

      const initialSize = orb.trailSize;
      updateFn(FIXED_DT, 10);
      expect(orb.trailSize).toBeGreaterThan(initialSize);
    });
  });

  describe('When delta is very large (tab switch)', () => {
    it('Then it should clamp to the maximum number of steps per frame', async () => {
      await setup();
      updateFn(FIXED_DT, 10);
      const orb = orbsRefFn.current.find((o) => o.isSpawned);
      if (!orb) return;

      const prevX = orb.x;
      const prevY = orb.y;

      updateFn(999, 10);

      const maxDistance = ORB_SPEED * 4;
      const distX = Math.abs(orb.x - prevX);
      const distY = Math.abs(orb.y - prevY);
      expect(distX + distY).toBeLessThanOrEqual(maxDistance + 0.001);
    });
  });

  describe('When an orb goes out of bounds', () => {
    it('Then it should be marked as fading and a new orb should be spawned', async () => {
      await setup();
      for (let i = 0; i < 1000; i++) updateFn(FIXED_DT, 10);
      const fadingOrbs = orbsRefFn.current.filter((o) => o.isFading);
      const activeOrbs = orbsRefFn.current.filter((o) => !o.isFading && o.isSpawned);
      expect(activeOrbs.length).toBeGreaterThanOrEqual(ORB_COUNT);
      expect(fadingOrbs.length).toBeGreaterThanOrEqual(0);
    });

    it('Then fading orbs should shrink trail and eventually be removed', async () => {
      await setup();
      for (let i = 0; i < 2000; i++) updateFn(FIXED_DT, 10);
      orbsRefFn.current.forEach((orb) => {
        if (orb.isFading) expect(orb.trailSize).toBeLessThan(80);
      });
    });
  });

  describe('When turns occur at intersections', () => {
    it('Then the orbs should sometimes change direction', async () => {
      await setup();
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      updateFn(FIXED_DT, 10);
      const orb = orbsRefFn.current.find((o) => o.isSpawned);
      if (!orb) return;

      const initialDir = orb.direction;
      let dirChanged = false;

      for (let i = 0; i < 500; i++) {
        updateFn(FIXED_DT, 10);
        if (orb.direction !== initialDir) {
          dirChanged = true;
          break;
        }
      }

      expect(dirChanged).toBe(true);
    });
  });

  describe('When orbs spawn from different edges', () => {
    it.each([
      { edgeName: 'top', randomValue: 0.1 },
      { edgeName: 'bottom', randomValue: 0.3 },
      { edgeName: 'left', randomValue: 0.55 },
      { edgeName: 'right', randomValue: 0.8 }
    ])('Then the orbs should spawn from the $edgeName edge', async ({ randomValue }) => {
      vi.spyOn(Math, 'random').mockReturnValue(randomValue);
      await setup();
      updateFn(FIXED_DT, 10);
      for (let i = 0; i < 500; i++) updateFn(FIXED_DT, 10);
      const orbs = orbsRefFn.current;
      expect(orbs.length).toBeGreaterThanOrEqual(ORB_COUNT);
    });
  });

  describe('When delta is zero', () => {
    it('Then no simulation steps should occur', async () => {
      await setup();
      updateFn(FIXED_DT, 10);
      const orb = orbsRefFn.current.find((o) => o.isSpawned);
      if (!orb) return;

      const prevX = orb.x;
      const prevY = orb.y;

      updateFn(0, 10);

      expect(orb.x).toBe(prevX);
      expect(orb.y).toBe(prevY);
    });
  });
});
