import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadUmami } from '@lib/analytics';
import { Example } from './Example';

loadUmami();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Hello World</h1>
    <Example />
  </StrictMode>
);
