import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get_user_details } from "./user.api";

export const useGetUserDetails = () => {
  return useQuery({
    queryKey: ["get_user_details"],
    queryFn: get_user_details,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: keepPreviousData,
  });
};
