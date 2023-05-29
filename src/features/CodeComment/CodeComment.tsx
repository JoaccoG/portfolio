import { FC, useEffect, useRef, useState } from 'react';
import { CodeCommentContainer } from './CodeComment.styled';

interface CodeCommentProps {
  text: string;
}

const CodeComment: FC<CodeCommentProps> = ({ text }) => {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hiddenRef = useRef<HTMLDivElement | null>(null);

  /* Due to how Jest environment (jsom) works, I was unable to test some of the component's functionality */
  /* Cypress tests were made to test the missing covered lines */
  /* istanbul ignore next */
  useEffect(() => {
    const { current } = containerRef;

    const updateLines = () => {
      if (!hiddenRef.current || !current) {
        return;
      }
      const containerWidth = current.clientWidth;
      const words = text.split(' ');
      let currentLine = '';
      let tempLines: string[] = [];
      words.forEach((word) => {
        hiddenRef.current!.innerText = '// ' + currentLine + word + ' ';

        if (hiddenRef.current!.clientWidth <= containerWidth) {
          currentLine += word + ' ';
        } else {
          tempLines.push(currentLine.trim());
          currentLine = word + ' ';
        }
      });
      tempLines.push(currentLine.trim());
      setLines(tempLines);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateLines();
    });

    if (current) {
      resizeObserver.observe(current);
    }

    updateLines();

    return () => {
      if (current) {
        resizeObserver.unobserve(current);
      }
    };
  }, [text]);

  return (
    <CodeCommentContainer
      ref={containerRef}
      data-testid="code-comment-container"
    >
      {lines.map((line, index) => {
        const key = `${index}-${line}`;
        return (
          <div
            key={key}
            className="code-comment-line"
            data-testid="code-comment-line"
          >
            <span className="code-comment-prefix">&#47;&#47; </span>
            <span>{line}</span>
          </div>
        );
      })}
      <div className="code-comment-hidden" ref={hiddenRef}></div>
    </CodeCommentContainer>
  );
};

export default CodeComment;
