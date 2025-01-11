import { screen, waitFor } from '@testing-library/react';
import Home from './page';

describe('Given a Home page', (): void => {
  describe('When it is rendered', (): void => {
    test('Then it should be in the document', async (): Promise<void> => {
      const customState = { counter: { value: 5 } };
      renderWithProvider(<Home />, { preloadedState: customState });

      await waitFor((): void => {
        expect(screen.getAllByRole('heading', { level: 1 })[0]).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 1 })[1]).toHaveTextContent('Counter: 5');
      });
    });
  });
});
