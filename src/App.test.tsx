import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

test('default test', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(true).toBe(true);
});
