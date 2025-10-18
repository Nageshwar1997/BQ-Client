import { useMutation } from "@tanstack/react-query";
import { cancel_payment, create_order, verify_payment } from "./order.api";

export const useCreateOrder = () => {
  return useMutation({ mutationFn: create_order });
};

export const useVerifyPayment = () => {
  return useMutation({ mutationFn: verify_payment });
};

export const useCancelPayment = () => {
  return useMutation({ mutationFn: cancel_payment });
};
