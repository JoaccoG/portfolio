const LCG_MULTIPLIER = 9301;
const LCG_INCREMENT = 49297;
const LCG_MODULUS = 233280;

export const createLcgRandom = (): (() => number) => {
  let seed = (Date.now() * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;

  return () => {
    seed = (seed * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;

    return seed / LCG_MODULUS;
  };
};
