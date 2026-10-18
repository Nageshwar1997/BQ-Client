import { Breadcrumb } from '@beautinique/frontend-components/breadcrumb';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import { type TCategoryNode } from '@/utils/category.util';
import { buildCategoryProductsPath, toAbsolutePath } from '@/utils/common.util';

interface IListingBreadcrumb {
  /** The categories from the main one down to the one the page is of. */
  trail: TCategoryNode[];
  /**
   * The page is not a category but something in it (a product): its name is the last step, and every category of the
   * trail is a link.
   */
  current?: string;
}

/**
 * Home / Products / Face / Face Makeup / Foundation (/ Velvet Matte Lipstick) - the shared breadcrumb, with the paths of
 * this app and its router.
 */
const ListingBreadcrumb = ({ trail, current }: IListingBreadcrumb) => {
  const navigate = useNavigate();

  const items = [
    { label: 'Home', href: toAbsolutePath(ROUTES.HOME) },
    { label: 'Products', href: toAbsolutePath(ROUTES.PRODUCTS.BASE) },
    ...trail.map((category, index) => ({
      label: category.name,
      href: buildCategoryProductsPath(...trail.slice(0, index + 1).map((item) => item.slug)),
    })),
    ...(current ? [{ label: current }] : []),
  ];

  return (
    <Breadcrumb
      items={items}
      onNavigate={(href) => {
        void navigate(href);
      }}
      className="text-silver-jet text-xs"
    />
  );
};

export default ListingBreadcrumb;
