import { useMutation } from '@tanstack/react-query';
import { GFormApi } from '../API';
import { QUERY_KEYS } from '@/Constants';
import { toaster } from '@/Utils';

export class GFormService extends GFormApi {
  public ContactUs = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.g_form.contact_us,
      mutationFn: this.contact_us,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };

  public JobApplication = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.g_form.job_application,
      mutationFn: this.job_application,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
}
