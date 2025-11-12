import { useMutation } from "@tanstack/react-query";
import {
  send_contact_request_and_mail,
  send_job_application_request_and_mail,
} from "./G-form.api";
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

export const useSendJobApplicationRequestAndMail = () => {
  return useMutation({
    mutationFn: send_job_application_request_and_mail,
    onSuccess: () =>
      toastSuccessMessage(
        "Application sent successfully, Our team will get back to you shortly."
      ),
    onError: (error) => toastErrorMessage(error),
  });
};
