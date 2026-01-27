import { customHooks } from '../../../../hooks';
import type { IFooterOptionList } from '../../../../types';

export const FooterOptionList = ({ isFirst = false, title, options }: IFooterOptionList) => {
  const requireAuth = customHooks.RequireAuth();
  const { navigate } = customHooks.PathParams();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function
    if (isPrivateRoute && !requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };

  return (
    <div className={`space-y-2 text-sm lg:text-base ${isFirst ? 'col-span-3 sm:col-span-1' : ''}`}>
      <p
        className={`text-platinum-black-invert font-medium uppercase ${
          isFirst ? 'hidden sm:block' : ''
        }`}
      >
        {title}
      </p>
      <div className={`grid grid-cols-1 ${isFirst ? 'grid-cols-2 sm:grid-cols-1' : ''} gap-2`}>
        {options.map((link, i) => (
          <button
            key={i}
            onClick={() => handleNavigate(link.path, link.private)}
            className="cursor-pointer text-nowrap"
          >
            {link.title}
          </button>
        ))}
      </div>
    </div>
  );
};
