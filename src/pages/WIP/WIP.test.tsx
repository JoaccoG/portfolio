import { render } from '@testing-library/react';
import WIP from './WIP';

describe('Given a WIP page', () => {
  describe('When it is rendered', () => {
    test('Then it should match the snapshot', () => {
      const view = render(<WIP />);
      expect(view).toMatchSnapshot();
    });
  });
});
