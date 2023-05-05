import styled from 'styled-components';

export const CodeCommentContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  .code-comment-line {
    word-wrap: break-word;
    white-space: pre-wrap;
    span {
      color: var(--color-secondary-gray);
      font-size: var(---font-size-xs);
      font-weight: 300;
    }
  }
  .code-comment-hidden {
    visibility: hidden;
    word-wrap: break-word;
    white-space: nowrap;
    position: absolute;
    left: 0;
    top: 0;
    color: var(--color-secondary-gray);
    font-size: var(---font-size-xs);
    font-weight: 300;
  }

  @media screen and (min-width: 768px) {
    .code-comment-line {
      span {
        font-size: var(--font-size-s);
      }
    }
    .code-comment-hidden {
      font-size: var(--font-size-s);
    }
  }

  @media screen and (min-width: 1024px) {
    .code-comment-line {
      span {
        font-size: var(--font-size-m);
      }
    }
    .code-comment-hidden {
      font-size: var(--font-size-m);
    }
  }
`;
