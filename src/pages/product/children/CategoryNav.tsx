import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import type { TCategoryHierarchy } from '@/types/api.type';
import { type TCategoryNode } from '@/utils/category.util';
import { resolveCategoryPath, toAbsolutePath } from '@/utils/common.util';

interface ICategoryNav {
  categories: TCategoryHierarchy[];
  /** The categories from the main one down to the one the page is of; empty on the page of all products. */
  trail: TCategoryNode[];
}

const LINK =
  'focus-visible:outline-blue-crayola-c block rounded-md py-1 text-sm outline-offset-2 transition-colors duration-200 hover:text-blue-crayola-c';

/**
 * The tree of categories as links: the main ones, and under the one that is open its sub categories, and
 * under the one that is open there the final ones. Choosing one is going to its page, which starts with
 * no filters (what was filtered in another category rarely makes sense here).
 */
const CategoryNav = ({ categories, trail }: ICategoryNav) => {
  const allProducts = toAbsolutePath(ROUTES.PRODUCTS.BASE);

  const renderLevel = (nodes: TCategoryNode[], parents: TCategoryNode[]) => (
    <ul className={parents.length > 0 ? 'border-primary/10 mt-1 ml-1 border-l pl-3' : ''}>
      {nodes.map((node) => {
        const chain = [...parents, node];
        const isOpen = trail[parents.length]?.slug === node.slug && trail.length > parents.length;
        const isCurrent = isOpen && trail.length === chain.length;
        const path = resolveCategoryPath(node.path, ...chain.map((item) => item.slug));

        return (
          <li key={node._id}>
            {path ? (
              <Link
                to={path}
                aria-current={isCurrent ? 'page' : undefined}
                className={`${LINK} ${isOpen ? 'font-semibold' : 'text-tertiary'} ${
                  isCurrent ? 'text-blue-crayola-c' : ''
                }`}
              >
                {node.name}
              </Link>
            ) : (
              <span className={`${LINK} text-tertiary cursor-default`}>{node.name}</span>
            )}
            {isOpen && !!node.subcategories?.length && renderLevel(node.subcategories, chain)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav aria-label="Categories">
      <Link
        to={allProducts}
        aria-current={trail.length === 0 ? 'page' : undefined}
        className={`${LINK} ${trail.length === 0 ? 'text-blue-crayola-c font-semibold' : 'text-tertiary'}`}
      >
        All products
      </Link>
      {renderLevel(categories, [])}
    </nav>
  );
};

export default CategoryNav;
