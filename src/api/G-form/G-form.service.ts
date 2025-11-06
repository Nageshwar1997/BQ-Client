import { useMutation } from "@tanstack/react-query";
import { send_contact_request_and_mail } from "./g-form.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useSendContactRequestAndMail = () => {
  return useMutation({
    mutationFn: send_contact_request_and_mail,
    onSuccess: () =>
      toastSuccessMessage(
        "Email sent successfully, Our team will get back to you shortly."
      ),
    onError: (error) => toastErrorMessage(error),
  });
};
