// src/hooks/useAuthCheck.ts
import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";
import { useNavigate } from "react-router-dom";

export const useAuthCheck = () => {
  const { setUser, isAuthenticated, user } = useUserStore();
  const { data, isLoading, isError } = useGetUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (getUserToken() && !isAuthenticated && !user && data?.user) {
        setUser(data.user);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user]);

  return { isLoading, isError, data };
};
