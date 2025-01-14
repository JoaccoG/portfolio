'use client';
import type { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, incrementByAmount, decrementByAmount, reset } from '@/features/counter/counterSlice';

const Counter = () => {
  const counter = useAppSelector((state: RootState): number => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section aria-labelledby="counter-section">
      <h1 id="counter-section">Counter: {counter}</h1>
      <article>
        <div>
          <button onClick={(): object => dispatch(increment())} aria-label="Increment counter">
            Increment
          </button>

          <button onClick={(): object => dispatch(decrement())} aria-label="Decrement counter">
            Decrement
          </button>

          <button onClick={(): object => dispatch(incrementByAmount(5))} aria-label="Increment counter by 5">
            Increment by 5
          </button>

          <button onClick={(): object => dispatch(decrementByAmount(5))} aria-label="Decrement counter by 5">
            Decrement by 5
          </button>

          <button onClick={(): object => dispatch(reset())} aria-label="Reset counter">
            Reset
          </button>
        </div>
      </article>
    </section>
  );
};

export default Counter;
