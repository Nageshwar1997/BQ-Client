import { createToaster } from '@beautinique/frontend-stores';

import useToastStore from '@/stores/toast.store';

// The toaster (and the helper for toasts that follow a request) of the toast store of the app. It
// works from anywhere: components, hooks, services.
export const { toaster, withProgressToast } = createToaster(useToastStore);
