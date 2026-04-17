// __tests__/hook.test.js
// Exp 07 — Custom hook testing using renderHook from React Native Testing Library

import { renderHook, act } from '@testing-library/react-native';
import useCounter from '../hooks/useCounter';

test('hook initialises count at 0', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);
});

test('custom hook increments count', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test('custom hook decrements count', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
    result.current.increment();
    result.current.decrement();
  });

  expect(result.current.count).toBe(1);
});

test('custom hook resets count to 0', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
    result.current.increment();
    result.current.reset();
  });

  expect(result.current.count).toBe(0);
});
