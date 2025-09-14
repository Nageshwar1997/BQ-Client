import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";

export const useAuthCheck = () => {
  const { setUser, user } = useUserStore();
  const token = getUserToken();

  const { data, isLoading, isError } = useGetUserDetails(!!token && !user);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data?.user, setUser]);

  return {
    isLoading,
    isError,
    isAuthenticated: !!data?.user,
  };
};
