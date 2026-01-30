import { useEffect, useRef } from 'react';
import type { TClassName } from '../../types';

interface QuillContentProps extends TClassName {
  content: string;
}

const QuillContent = ({ content, className = '' }: QuillContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element && content) {
      element.innerHTML = content;
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`quill-content w-full max-w-none cursor-default ${className} `}
    />
  );
};

export default QuillContent;
