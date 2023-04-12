import { render, screen } from '@testing-library/react';
import WIP from './WIP';

describe('Given a WIP page', () => {
  describe('When it is rendered', () => {
    test('Then it should match the snapshot', () => {
      render(<WIP />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /joaquín godoy/i
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        /full stack developer/i
      );
      expect(screen.getByText(/githubProfile/i)).toBeInTheDocument();
    });
  });
});
