import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadUmami } from '@lib/analytics';
import '@style/globals.css';

loadUmami();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1 style={{ color: 'var(--color-primary)' }}>Hello World</h1>
  </StrictMode>
);
