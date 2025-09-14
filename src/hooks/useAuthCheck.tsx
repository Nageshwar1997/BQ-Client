import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";
import usePathParams from "./usePathParams";

export const useAuthCheck = () => {
  const { setUser, isAuthenticated, user } = useUserStore();
  const { data, isLoading, isError } = useGetUserDetails();
  const { navigate } = usePathParams();

  useEffect(() => {
    try {
      if (getUserToken() && !isAuthenticated && !user && data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error in auth check:", error);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user]);

  return { isLoading, isError, data };
};
