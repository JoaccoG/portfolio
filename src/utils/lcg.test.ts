import { createLcgRandom } from './lcg';

describe('Given a LCG random number generator', () => {
  describe('When the returned generator is called multiple times', () => {
    it('Then it should produce different values each call', () => {
      const random = createLcgRandom();
      const values = Array.from({ length: 10 }, () => random());
      const unique = new Set(values);

      expect(unique.size).toBe(values.length);
    });

    it('Then all values should be between 0 (inclusive) and 1 (exclusive)', () => {
      const random = createLcgRandom();
      const values = Array.from({ length: 100 }, () => random());

      values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      });
    });
  });

  describe('When Date.now() returns the same value', () => {
    it('Then two instances should produce identical sequences', () => {
      vi.spyOn(Date, 'now').mockReturnValue(1000);
      const randomA = createLcgRandom();
      const randomB = createLcgRandom();

      vi.restoreAllMocks();

      const seqA = Array.from({ length: 10 }, () => randomA());
      const seqB = Array.from({ length: 10 }, () => randomB());

      expect(seqA).toEqual(seqB);
    });
  });

  describe('When two instances are created at different times', () => {
    it('Then they should not share state', () => {
      vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(2000);

      const randomA = createLcgRandom();
      const randomB = createLcgRandom();

      vi.restoreAllMocks();

      const seqA = Array.from({ length: 5 }, () => randomA());
      const seqB = Array.from({ length: 5 }, () => randomB());

      expect(seqA).not.toEqual(seqB);
    });
  });
});
