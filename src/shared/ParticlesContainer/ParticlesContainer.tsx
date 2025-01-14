'use client';
import { type FC, useState, useEffect } from 'react';
import type { Engine } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { options } from './options';

interface ParticlesComponentProps {
  id: string;
}
const ParticlesComponent: FC<ParticlesComponentProps> = ({ id }) => {
  const [init, setInit] = useState<boolean>(false);

  useEffect((): void => {
    const initializeParticles = async (): Promise<void> => {
      await initParticlesEngine(async (engine: Engine): Promise<void> => await loadSlim(engine));
      setInit(true);
    };

    initializeParticles();
  }, []);

  return init && <Particles id={id} options={options} />;
};

export default ParticlesComponent;
