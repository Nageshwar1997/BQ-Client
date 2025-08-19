import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";

export const useAuthCheck = () => {
  const { setUser, user } = useUserStore();
  const { data, isLoading, isError } = useGetUserDetails();

  useEffect(() => {
    try {
      if (getUserToken() && !user && data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.log("Error in auth check:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user]);

  return { isLoading, isError, data };
};
