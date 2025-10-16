import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

export const renderWithMemoryRouter = (
  ui: ReactElement,
  { initialEntries = ['/'] }: { initialEntries?: string[] } = {}
): RenderResult => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ChakraProvider value={createSystem(defaultConfig)}>{ui}</ChakraProvider>
    </MemoryRouter>
  );
};
