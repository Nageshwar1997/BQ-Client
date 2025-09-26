import { useQuery } from "@tanstack/react-query";
import { get_user_addresses } from "./address.api";

export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["get_user_details"],
    queryFn: get_user_addresses,
    retry: false,
    enabled: true,
  });
};
