import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";

export const useAuthCheck = () => {
  const { setUser, isAuthenticated, user } = useUserStore();
  const { data, isLoading, isError } = useGetUserDetails(
    !!getUserToken() && !user && !isAuthenticated
  );

  useEffect(() => {
    if (data?.user && !user) {
      setUser(data.user);
    }
  }, [data?.user, user, setUser]);

  return { isLoading, isError, data };
};
