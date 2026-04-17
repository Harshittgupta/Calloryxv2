// __tests__/storage.test.js
// Exp 07 — AsyncStorage testing using Jest mock

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage module
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve('React Native')),
  removeItem: jest.fn(),
}));

test('store data - setItem is called with correct key and value', async () => {
  await AsyncStorage.setItem('course', 'React Native');

  expect(AsyncStorage.setItem).toHaveBeenCalledWith('course', 'React Native');
});

test('retrieve data - getItem returns stored value', async () => {
  const value = await AsyncStorage.getItem('course');

  expect(value).toBe('React Native');
});

test('remove data - removeItem is called with correct key', async () => {
  await AsyncStorage.removeItem('course');

  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('course');
});
