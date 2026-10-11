import { createUserStore } from '@beautinique/frontend-stores';

import { resetAuthLogoutState } from '@/classes/ApiRequest';
import { USER_KEY } from '@/constants/common.constants';
import type { IUser } from '@/types/api.type';
import { decryptData, encryptData } from '@/utils/crypto.util';

// The user is kept encrypted in localStorage; setting one starts a new session of the api client.
const useUserStore = createUserStore<IUser>({
  storageKey: USER_KEY,
  encode: encryptData,
  decode: (stored) => decryptData<IUser>(stored),
  onSet: resetAuthLogoutState,
});

export default useUserStore;
