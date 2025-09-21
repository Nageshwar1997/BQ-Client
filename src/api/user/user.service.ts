import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get_user_details } from "./user.api";
import { getUserToken } from "../../utils";

export const useGetUserDetails = () => {
  const token = getUserToken();

  return useQuery({
    queryKey: ["get_user_details", !!token],
    queryFn: get_user_details,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
};
