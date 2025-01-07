import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/store/testStore';
import type { RootState } from '@/store/store';

export const renderWithProvider = (
  ui: React.ReactElement,
  { preloadedState, options }: { preloadedState?: Partial<RootState>; options?: object } = {}
) => {
  const store = createTestStore(preloadedState as RootState);

  return render(<Provider store={store}>{ui}</Provider>, options);
};
