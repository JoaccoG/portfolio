import { useState, useEffect } from 'react';
import ParticlesComponent, { initParticlesEngine, type IParticlesProps } from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { getParticlesNumber } from '../../utils';

const Particles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [particlesNumber, setParticlesNumber] = useState<number>(80);

  useEffect((): void => {
    setParticlesNumber(getParticlesNumber());

    const initializeParticles = async (): Promise<void> =>
      await initParticlesEngine(async (engine: Engine): Promise<void> => await loadSlim(engine));

    setIsLoading(false);
    initializeParticles();
  }, []);

  const particlesOptions: IParticlesProps['options'] = {
    fpsLimit: 240,
    detectRetina: true,
    background: { image: 'linear-gradient(325deg, #090807 75%, #0f0808 85%, #1f1010 100%)' },
    particles: {
      opacity: { value: 0.8 },
      shape: { type: 'circle' },
      color: { value: '#f2ebe3' },
      size: { value: { min: 0.1, max: 1 } },
      shadow: { enable: true, color: '#f2ebe3', blur: 4 },
      links: { enable: false, color: '#f2ebe3', distance: 100, opacity: 1, width: 0.5 },
      number: { value: particlesNumber, density: { enable: true, width: 1000, height: 1000 } },
      move: { enable: true, speed: 4, random: true, direction: 'none', outModes: { default: 'bounce' } }
    },
    interactivity: {
      smooth: { enable: true, speed: 0.5 },
      events: {
        resize: { enable: true, delay: 0.3 },
        onHover: { enable: true, mode: ['repulse', 'attract', 'grab'] },
        onClick: { enable: true, mode: ['repulse', 'attract', 'grab'] }
      },
      modes: {
        repulse: { distance: 55, duration: 1 },
        attract: { distance: 120, duration: 1 },
        grab: { distance: 100, links: { opacity: 1 } }
      }
    }
  };

  return <>{!isLoading && <ParticlesComponent id={'particlesComponent'} options={particlesOptions} />}</>;
};

export default Particles;
