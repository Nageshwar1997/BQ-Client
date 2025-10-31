import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import AuthModal from "../../components/modal/children/AuthModal";
import useCartStore from "../../store/cart.store";
import { useUserCart } from "../../hooks/useUserCart";
import { useUserStore } from "../../store/user.store";

const Main = () => {
  const { isAuthenticated } = useUserStore();
  const { setCart } = useCartStore();
  const { cart } = useUserCart();

  useEffect(() => {
    if (isAuthenticated) {
      setCart(cart ?? null);
    }
  }, [cart, isAuthenticated, setCart]);
  return (
    <Fragment>
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Main;
