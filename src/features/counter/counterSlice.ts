import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const ensureNonNegative = (value: number): number => Math.max(value, 0);

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state): void => {
      state.value += 1;
    },
    decrement: (state): void => {
      state.value = ensureNonNegative(state.value - 1);
    },
    incrementByAmount: (state, action: PayloadAction<number>): void => {
      state.value += action.payload;
    },
    decrementByAmount: (state, action: PayloadAction<number>): void => {
      state.value = ensureNonNegative(state.value - action.payload);
    },
    reset: (state): void => {
      state.value = initialState.value;
    }
  }
});

export const {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  reset
} = counterSlice.actions;

export default counterSlice.reducer;
