import { Outlet } from 'react-router-dom';

import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

// Minimal admin shell — sits inside the main Layout (Navbar/Footer + auth-refresh hooks), so it
// only needs to add the admin-specific heading/nav. Grows into a proper sidebar once more admin
// sections exist beyond seller applications.
const AdminLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <GradientText type="accent" text="Admin" className="text-xl font-semibold sm:text-2xl" />

      <nav className="border-primary/10 flex gap-4 border-b pb-3 text-sm">
        <GradientText
          type="silver"
          text="Seller Applications"
          path={`/${ROUTES.ADMIN.BASE}/${ROUTES.ADMIN.SELLER_APPLICATIONS.BASE}`}
          className="font-medium"
        />
      </nav>

      <Outlet />
    </div>
  );
};

export default AdminLayout;
