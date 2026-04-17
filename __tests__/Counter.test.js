// __tests__/Counter.test.js
// Exp 07 — UI component test using React Native Testing Library

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Counter from '../components/Counter';

test('counter starts at 0', () => {
  const { getByTestId } = render(<Counter />);
  expect(getByTestId('count').props.children[1]).toBe(0);
});

test('button click updates state - increments count to 1', () => {
  const { getByText, getByTestId } = render(<Counter />);

  fireEvent.press(getByText('Increment'));

  expect(getByTestId('count').props.children[1]).toBe(1);
});

test('multiple increments work correctly', () => {
  const { getByText, getByTestId } = render(<Counter />);

  fireEvent.press(getByText('Increment'));
  fireEvent.press(getByText('Increment'));
  fireEvent.press(getByText('Increment'));

  expect(getByTestId('count').props.children[1]).toBe(3);
});
