import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { App } from '@/App.tsx';
import { Particles } from '@components/Particles/Particles';
import '@styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={createSystem(defaultConfig)}>
        <App />
        <Particles />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
