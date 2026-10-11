import { createThemeStore } from '@beautinique/frontend-stores';

import type { TTheme } from '@/types/store.type';

const useThemeStore = createThemeStore<TTheme>();

export default useThemeStore;
