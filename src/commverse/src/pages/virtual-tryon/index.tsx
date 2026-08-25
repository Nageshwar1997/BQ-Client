import { Icon } from '@iconify/react';
import { loaderScreenData } from '../../data';
import { Link, useLocation } from 'react-router';
import { useGetCategories } from '../../services/category-service';
import type { TCategory, TTryOn } from '../../types';
import { SUPPORTED_TRYON_CATEGORIES } from '../../constants';
import Loader from '../../components/Loader';
import { nanoid } from 'nanoid';
import TopHeader from '../../components/TopHeader';

type TAllTryOn = TTryOn | 'Fashion';

const SUBCATEGORY_IMAGES: Record<TAllTryOn, string> = {
  Blush: '/assets/images/try-on/cover/blush.png',
  Eyebrow: '/assets/images/try-on/cover/eyebrow.png',
  Eyeliner: '/assets/images/try-on/cover/eyeliner.png',
  Eyeshadow: '/assets/images/try-on/cover/eyeshadow.png',
  Foundation: '/assets/images/try-on/cover/foundation.png',
  Kajal: '/assets/images/try-on/cover/kajal.png',
  Lipstick: '/assets/images/try-on/cover/lipstick.png',
  Haircare: '/assets/images/try-on/cover/haircare.png',
  Others: '/assets/images/try-on/cover/others.png',
  Fashion: '/assets/images/try-on/cover/fashion.png',
};

const ALL_SUPPORTED_TRYON_CATEGORIES: TAllTryOn[] = [
  ...SUPPORTED_TRYON_CATEGORIES,
  'Fashion',
];

const VirtualTryOn = () => {
  const categoriesQuery = useGetCategories();
  const location = useLocation();

  const category =
    categoriesQuery?.data?.find(
      (item: TCategory) => item.name === 'Cosmetics'
    ) ?? {};

  const subcategories: TCategory['subcategories'] =
    category?.subcategories || [];
  const loaderConfig = loaderScreenData.find(
    (item) => item.variant === 'virtual-try-on'
  );

  const allTryOns = [
    { _id: nanoid(), name: 'Fashion', route: 'fashion' },
    ...subcategories.map((item) => ({
      ...item,
      route: `${category?._id}/${item.name}`,
    })),
  ];

  const { title, icon, className } = loaderConfig || {};

  if (categoriesQuery.isPending) {
    return <Loader section="virtual-try-on" />;
  }

  return (
    <div className={`flex h-full w-full flex-col ${className}`}>
      <TopHeader />

      <div className="font-metropolis flex w-full grow flex-col items-center gap-3 p-12 text-center">
        <div className="flex items-center gap-2">
          {typeof icon === 'string' ? (
            <Icon icon={icon} className="size-9" />
          ) : (
            icon
          )}
          {title && (
            <h2 className="text-[32px] leading-12 font-medium">{title}</h2>
          )}
        </div>
        <p className="text-neutral-gray-900 leading-4.75 font-medium">
          {!Object.keys(category).length || subcategories.length === 0
            ? 'No Categories Found'
            : 'Select a Category to begin'}
        </p>
        <div className="mt-12 flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-8">
          {allTryOns?.map((cat) => {
            const name: TAllTryOn = cat.name as TAllTryOn;
            if (!ALL_SUPPORTED_TRYON_CATEGORIES.includes(name)) return null;

            return (
              <Link
                to={{ pathname: cat.route, search: location.search }}
                key={cat._id}
                className="border-neutral-gray-200 bg-neutral-gray-100 h-33.75 w-67.5 rounded-xl border bg-cover bg-top-right bg-no-repeat px-4 py-3"
                style={{
                  backgroundImage: `url(${SUBCATEGORY_IMAGES[name]})`,
                }}
              >
                <p className="text-left text-base/6 text-black">{name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
