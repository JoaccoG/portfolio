import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './contexts/theme/provider.tsx';
import App from './App.tsx';
import Particles from './shared/Particles/Particles.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Particles />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
