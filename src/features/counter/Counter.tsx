'use client';
import type { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, incrementByAmount, decrementByAmount, reset } from '@/features/counter/counterSlice';
import styled from 'styled-components';

const WrapperToTestThemeToggle = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
`;

const Counter = () => {
  const counter = useAppSelector((state: RootState): number => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section aria-labelledby="counter-section">
      <header>
        <h1 id="counter-section">Counter: {counter}</h1>
      </header>

      <article>
        <WrapperToTestThemeToggle>
          <button onClick={() => dispatch(increment())} aria-label="Increment counter">
            Increment
          </button>

          <button onClick={() => dispatch(decrement())} aria-label="Decrement counter">
            Decrement
          </button>

          <button onClick={() => dispatch(incrementByAmount(5))} aria-label="Increment counter by 5">
            Increment by 5
          </button>

          <button onClick={() => dispatch(decrementByAmount(5))} aria-label="Decrement counter by 5">
            Decrement by 5
          </button>

          <button onClick={() => dispatch(reset())} aria-label="Reset counter">
            Reset
          </button>
        </WrapperToTestThemeToggle>
      </article>
    </section>
  );
};

export default Counter;
