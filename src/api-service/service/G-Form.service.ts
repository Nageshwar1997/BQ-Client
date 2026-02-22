import { useMutation } from '@tanstack/react-query';
import { GFormApi } from '../api';
import { QUERY_KEYS } from '@/constants';
import { toaster } from '@/utils';

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
