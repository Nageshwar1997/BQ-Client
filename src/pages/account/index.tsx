import Sidebar from "../../components/sidebar";

const Account = () => {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <main className="min-h-[1000px]">Main Body</main>
    </div>
  );
};

export default Account;
