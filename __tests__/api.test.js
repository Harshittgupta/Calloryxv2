// __tests__/api.test.js
// Exp 07 — API mock testing using Jest's global.fetch mock

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Harshit', id: 1 }),
  })
);

test('mock API call returns expected data', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const data = await response.json();

  expect(data.name).toBe('Harshit');
});

test('fetch is called with correct URL', async () => {
  await fetch('https://jsonplaceholder.typicode.com/users/1');

  expect(global.fetch).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/users/1'
  );
});
