import type { Engine } from '@tsparticles/engine';
import type { IParticlesProps } from '@tsparticles/react';
import { useState, useEffect } from 'react';
import ParticlesComponent, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { PARTICLES_CONFIG } from '@constants/particles';

export const Particles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [amountOfParticles, setAmountOfParticles] = useState<number>(80);

  useEffect((): VoidFunction => {
    setAmountOfParticles(PARTICLES_CONFIG.getAmountOfParticles());
    const initializeParticles = async (): Promise<void> => {
      try {
        await initParticlesEngine(async (engine: Engine): Promise<void> => await loadSlim(engine));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize particles:', error);
      }
    };

    initializeParticles();

    return (): void => setIsLoading(true);
  }, []);

  const particlesOptions: IParticlesProps['options'] = {
    fpsLimit: 240,
    detectRetina: true,
    background: { image: 'radial-gradient(ellipse 80% 80% at 50% -25%, #2b1717, #090807)' },
    particles: {
      opacity: { value: 0.8 },
      shape: { type: 'circle' },
      color: { value: '#f2ebe3' },
      size: { value: { min: 0.1, max: 1 } },
      shadow: { enable: false, color: '#f2ebe3', blur: 4 },
      links: { enable: false, color: '#f2ebe3', distance: 100, opacity: 1, width: 0.5 },
      number: { value: amountOfParticles, density: { enable: true, width: 800, height: 800 } },
      move: { enable: true, speed: 3, random: true, direction: 'none', outModes: { default: 'bounce' } }
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
        grab: { distance: 80, links: { opacity: 1 } }
      }
    }
  };

  if (isLoading) return null;

  return <ParticlesComponent id="particlesComponent" options={particlesOptions} />;
};
