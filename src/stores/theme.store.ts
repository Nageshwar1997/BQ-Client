import { createThemeStore } from '@beautinique/frontend-stores';

// The type of the theme (dark | light) is the stores package's: no type of its own here.
const useThemeStore = createThemeStore();

export default useThemeStore;
