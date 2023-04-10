import { render } from '@testing-library/react';
import App from './App';

describe('Given an app component', () => {
  describe('When true', () => {
    test('Then true', () => {
      render(<App />);
      expect(true).toBe(true);
    });
  });
});
