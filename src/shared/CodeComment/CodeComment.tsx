import { FC, useEffect, useRef, useState } from 'react';
import './CodeComment.css';

interface CodeCommentProps {
  text: string;
}

const CodeComment: FC<CodeCommentProps> = ({ text }) => {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hiddenRef = useRef<HTMLDivElement | null>(null);

  const updateLines = () => {
    if (!hiddenRef.current || !containerRef.current) {
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const words = text.split(' ');
    let currentLine = '';
    let tempLines: string[] = [];
    words.forEach((word) => {
      hiddenRef.current!.innerText = currentLine + word + ' ';
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

  useEffect(() => {
    const { current } = containerRef;
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
    <div className="code-comment" ref={containerRef}>
      {lines.map((line, index) => (
        <div key={index} className="code-comment-line">
          <span className="code-comment-prefix">&#47;&#47; </span>
          <span>{line}</span>
        </div>
      ))}
      <div className="code-comment-hidden" ref={hiddenRef}></div>
    </div>
  );
};

export default CodeComment;
