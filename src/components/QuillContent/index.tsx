import { useEffect, useRef } from "react";
import { ClassName } from "../../types";

interface QuillContentProps extends ClassName {
  content: string;
}

const QuillContent = ({ content, className = "" }: QuillContentProps) => {
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
      className={`
            w-full
            prose
            sm:prose-sm
            md:prose-md
            lg:prose-lg
            xl:prose-xl
            2xl:prose-2xl
            max-w-none
            cursor-default
            custom-prose

            prose-headings:text-primary
            prose-headings:font-semibold
            prose-headings:!my-3

            prose-p:text-secondary
            prose-p:!my-2
            prose-p:leading-relaxed

            prose-a:text-transparent
            prose-a:bg-clip-text
            prose-a:bg-accent-duo

            prose-strong:text-primary
            prose-em:text-secondary

            prose-ul:list-disc
            prose-ul:list-inside
            prose-ol:list-decimal
            prose-ol:list-inside
            prose-li:text-tertiary
            prose-li:my-1

            prose-img:rounded-lg
            prose-img:w-full
            prose-img:h-full
            prose-img:object-contain
            prose-img:shadow-md

            prose-blockquote:border-l-4
            prose-blockquote:border-primary-30
            prose-blockquote:bg-primary-10
            prose-blockquote:pl-4
            prose-blockquote:italic
            prose-blockquote:text-secondary

            prose-code:bg-primary-10
            prose-code:px-1
            prose-code:py-0.5
            prose-code:rounded
            prose-code:text-sm
            prose-code:font-mono
            prose-code:text-primary-inverted

            prose-pre:bg-primary-inverted
            prose-pre:text-primary
            prose-pre:p-4
            prose-pre:rounded-lg
            prose-pre:overflow-x-auto

            prose-table:table-auto
            prose-table:border-collapse
            prose-th:border-b
            prose-th:border-primary-30
            prose-th:px-2
            prose-th:py-1
            prose-td:border-b
            prose-td:border-primary-30
            prose-td:px-2
            prose-td:py-1

            ${className}
          `}
    />
  );
};

export default QuillContent;
