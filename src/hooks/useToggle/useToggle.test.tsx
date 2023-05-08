import { act, renderHook } from '@testing-library/react';
import useToggle from './useToggle';

describe('Given a useToggle custom hook', () => {
  test('When invoked, then it returns the initial value and a function to toggle it', () => {
    const { result } = renderHook(() => useToggle(false));
    const [value, toggleValue] = result.current;

    expect(value).toBe(false);
    expect(typeof toggleValue).toBe('function');
  });

  test('When used, then it toggles the value correctly', () => {
    const { result } = renderHook(() => useToggle(false));
    const [, toggleValue] = result.current;

    act(() => {
      toggleValue();
    });

    const [value] = result.current;
    expect(value).toBe(true);
  });
});
