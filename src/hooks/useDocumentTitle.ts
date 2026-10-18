import { useEffect } from 'react';

/**
 * Puts a title on the tab while the page is shown, and gives the old one back when it goes. Nothing happens while
 * there is no title (the page is still loading): the tab keeps the title it has.
 */
export const useDocumentTitle = (title: string | undefined) => {
  useEffect(() => {
    if (!title) return;

    const previous = document.title;

    document.title = title;

    return () => {
      document.title = previous;
    };
  }, [title]);
};
