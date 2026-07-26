import type { IPageWrapper } from '@/types/component.type';

import { Navbar } from '../navbar';

const PageWrapper = ({
  children,
  className = '',
  containerClassName = '',
  navbar: _,
}: IPageWrapper) => {
  return (
    <div className={`[&>*:not(:first-child)]:p-4 ${containerClassName}`}>
      <Navbar />
      <div className={`p-4 ${className}`}>{children}</div>
    </div>
  );
};

export default PageWrapper;
