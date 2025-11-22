import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";

const Account = () => {
  return (
    <div className="flex w-full min-h-[calc(100dvh-64px)] lg:min-h-[calc(100dvh-100px)] h-full">
      <Sidebar />
      <main className="flex-1 bg-secondary-inverted">
        <Outlet />
      </main>
    </div>
  );
};

export default Account;
