import type { TToast } from '@beautinique/frontend-components';
import { createToastStore } from '@beautinique/frontend-stores';

/*
 * The one toast store of the app: the `toaster` (utils/toaster.ts) adds to it and the
 * `ToastContainer` (App.tsx) draws it, so both are given this very store.
 */
const useToastStore = createToastStore<TToast>();

export default useToastStore;
