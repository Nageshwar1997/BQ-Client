import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ErrorBoundary from "../error/ErrorBoundary";
import AuthModal from "../../components/modal/children/AuthModal";

const Main = () => {
  return (
    <ErrorBoundary>
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Main;
