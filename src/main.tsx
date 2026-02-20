import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadUmami } from '@lib/analytics';

loadUmami();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Hello World</h1>
  </StrictMode>
);
