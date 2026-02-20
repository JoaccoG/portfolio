import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Example } from './Example';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Hello World</h1>
    <Example />
  </StrictMode>
);
