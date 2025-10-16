import { useMutation } from "@tanstack/react-query";
import { create_order, verify_payment } from "./order.api";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: create_order,
    onSuccess: (data) => {},
    onError: (error: unknown) => {},
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verify_payment,
    onSuccess: (data) => {},
    onError: (error: unknown) => {},
  });
};
