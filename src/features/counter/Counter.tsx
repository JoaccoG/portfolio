'use client';

import type { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  reset
} from '@/features/counter/counterSlice';

const Counter = () => {
  const counterValue = useAppSelector(
    (state: RootState): number => state.counter.value
  );
  const dispatch = useAppDispatch();

  return (
    <section aria-labelledby="counter-section">
      <header>
        <h1 id="counter-section">Counter: {counterValue}</h1>
      </header>

      <article>
        <p>Use the buttons below to control the counter value:</p>
        <div>
          <button
            onClick={() => dispatch(increment())}
            aria-label="Increment counter">
            Increment
          </button>

          <button
            onClick={() => dispatch(decrement())}
            aria-label="Decrement counter">
            Decrement
          </button>

          <button
            onClick={() => dispatch(incrementByAmount(5))}
            aria-label="Increment counter by 5">
            Increment by 5
          </button>

          <button
            onClick={() => dispatch(decrementByAmount(5))}
            aria-label="Decrement counter by 5">
            Decrement by 5
          </button>

          <button onClick={() => dispatch(reset())} aria-label="Reset counter">
            Reset
          </button>
        </div>
      </article>
    </section>
  );
};

export default Counter;
