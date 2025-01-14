import type { IParticlesProps } from '@tsparticles/react/dist/IParticlesProps';

export const options: IParticlesProps['options'] = {
  fpsLimit: 240,
  detectRetina: true,
  background: { image: 'linear-gradient(135deg, rgba(4,6,10,1) 0%, rgba(23,34,44,1) 100%)' },
  particles: {
    color: { value: '#556e86' },
    opacity: { value: 0.6 },
    shape: { type: 'circle' },
    size: { value: { min: 0, max: 0 } },
    number: { value: 60, density: { enable: true, width: 600, height: 600 } },
    links: { color: '#556e86', distance: 100, enable: true, opacity: 1, width: 0.4 },
    move: { enable: true, speed: 4, random: true, direction: 'none', outModes: { default: 'bounce' } }
  },
  interactivity: {
    events: {
      onClick: { enable: true, mode: ['push', 'trail'] },
      onHover: { enable: true, mode: 'repulse' },
      resize: { enable: true, delay: 0.5 }
    },
    modes: {
      push: { quantity: 1 },
      remove: { quantity: 1 },
      pause: { quantity: 5 },
      repulse: { distance: 100, duration: 1 },
      attract: { distance: 200, duration: 1 },
      grab: { distance: 100, links: { opacity: 1 } },
      connect: { distance: 80, links: { opacity: 0.5 } },
      bubble: { distance: 100, duration: 2, size: 5, opacity: 0.8 },
      light: { area: { gradient: { start: { value: '#556e86' }, stop: { value: '#000000' } }, radius: 1000 } },
      trail: { quantity: 1, delay: 0.2, particles: { color: '#556e86', shape: 'circle', width: 0.2, opacity: 0.8 } }
    }
  }
};
