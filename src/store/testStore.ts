import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import type { RootState } from './store';

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      counter: counterReducer
    },
    preloadedState: preloadedState as RootState
  });
}

export type TestStore = ReturnType<typeof createTestStore>;
export type TestDispatch = TestStore['dispatch'];
