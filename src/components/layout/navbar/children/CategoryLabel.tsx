import { Link } from 'react-router-dom';
import type { TCategoryBaseL, TClassName } from '../../../../types';

export const CategoryLabel = ({
  label,
  path = '',
  className = '',
}: Pick<TCategoryBaseL, 'path' | 'label'> & TClassName) => (
  <p
    className={`text-battleship-davys-gray-invert mt-3 line-clamp-1 px-3 text-left text-sm leading-5 font-semibold tracking-wide uppercase md:mt-0 ${
      path ? 'cursor-pointer' : 'cursor-default'
    } ${className}`}
  >
    {path ? <Link to={path}>{label}</Link> : label}
  </p>
);
