import { render, screen, waitFor } from '@testing-library/react';
import CodeComment from './CodeComment';

describe('Given a Code Comment component', () => {
  describe('When it is rendered', () => {
    test('Then the text from props should be in the document', async () => {
      render(<CodeComment text="This is a test text" />);
      await waitFor(() => {
        expect(screen.getByText(/this is a test text/i)).toBeInTheDocument();
      });
    });
  });
});
