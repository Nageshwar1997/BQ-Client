import { useMutation } from '@tanstack/react-query';
import { GFormApi } from '../Api/G-Form.api';
import { QUERY_KEYS } from '@/Constants';
import { oldToaster } from '@/Utils/Common.util';

export class GFormService extends GFormApi {
  public ContactUs = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.g_form.contact_us,
      mutationFn: this.contact_us,
      onSuccess: ({ message }) => oldToaster('success', message),
      onError: ({ message }) => oldToaster('error', message),
    });
  };

  public JobApplication = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.g_form.job_application,
      mutationFn: this.job_application,
      onSuccess: ({ message }) => oldToaster('success', message),
      onError: ({ message }) => oldToaster('error', message),
    });
  };
}
