import { render, screen } from '@testing-library/react';
import CodeComment from './CodeComment';

const renderWithWidth = (component: React.ReactElement, width: number) => {
  return render(<div style={{ width }}>{component}</div>);
};

describe('Given a CodeComment component', () => {
  describe('When its rendered with a text from props', () => {
    const text = 'This is a mocked text to test CodeComment component.';
    test('Then it should show the text in the screen with its prefix', async () => {
      renderWithWidth(<CodeComment text={text} />, 400);

      const codeCommentContainer = screen.getByTestId('code-comment-container');
      expect(codeCommentContainer).toBeInTheDocument();

      const codeCommentLines = await screen.findAllByTestId(
        'code-comment-line'
      );
      expect(codeCommentLines.length).toBeGreaterThan(0);

      const combinedText = codeCommentLines
        .map((line) => line.textContent)
        .join(' ')
        .replace(/\/\/ /g, '');
      expect(combinedText).toBe(text);
    });

    test('Then it should adjust the screen linebreaks according to the container width', async () => {
      renderWithWidth(<CodeComment text={text} />, 500);
      const lines1 = await screen.findAllByTestId('code-comment-line');

      renderWithWidth(<CodeComment text={text} />, 50);
      const lines2 = await screen.findAllByTestId('code-comment-line');

      expect(lines1.length).toBeLessThan(lines2.length);
    });
  });
});
