import { CategoryApi } from './ProductApi';
import { AuthApi, UserApi } from './UserApi';

/* ===================== USER SERVICE API ===================== */
export const authApi = new AuthApi();
export const userApi = new UserApi();

/* ===================== PRODUCT SERVICE API ===================== */
export const categoryApi = new CategoryApi();
