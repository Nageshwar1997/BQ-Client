import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-dvh w-dvw">
      <Sidebar />
      <main className="ml-16 size-full flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
