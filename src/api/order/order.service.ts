import { useMutation } from "@tanstack/react-query";
import { create_order, verify_payment } from "./order.api";

export const useCreateOrder = () => {
  return useMutation({ mutationFn: create_order });
};

export const useVerifyPayment = () => {
  return useMutation({ mutationFn: verify_payment });
};
