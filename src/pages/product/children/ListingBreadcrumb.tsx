import { Icon } from '@iconify/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import { type TCategoryNode } from '@/utils/category.util';
import { buildCategoryProductsPath, toAbsolutePath } from '@/utils/common.util';

interface IListingBreadcrumb {
  /** The categories from the main one down to the one the page is of. */
  trail: TCategoryNode[];
}

const LINK =
  'hover:text-primary focus-visible:outline-blue-crayola-c rounded-sm outline-offset-2 transition-colors duration-200';

/** Home / Products / Face / Face Makeup / Foundation - the last one is the page itself, and is not a link. */
const ListingBreadcrumb = ({ trail }: IListingBreadcrumb) => {
  const crumbs = [
    { label: 'Home', to: toAbsolutePath(ROUTES.HOME) },
    { label: 'Products', to: toAbsolutePath(ROUTES.PRODUCTS.BASE) },
    ...trail.map((category, index) => ({
      label: category.name,
      to: buildCategoryProductsPath(...trail.slice(0, index + 1).map((item) => item.slug)),
    })),
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-silver-jet flex flex-wrap items-center gap-1.5 text-xs">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.label}>
              <li>
                {isLast || !crumb.to ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-primary font-medium"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.to} className={LINK}>
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <Icon icon="solar:alt-arrow-right-linear" className="size-3" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default ListingBreadcrumb;
