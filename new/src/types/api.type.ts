import type { AUTH_PROVIDERS, ROLES } from '@/constants/api.constant';
import type { TRegister } from './schema.type';

export type TFieldErrors = Record<string, string[]>;

export interface IId {
  _id: string;
}

export interface ITimeStamp {
  createdAt: string;
  updatedAt: string;
}

export type TAuthProvider = (typeof AUTH_PROVIDERS)[number];

export type TRole = (typeof ROLES)[number];

export interface IUser
  extends Omit<TRegister, 'confirmPassword' | 'password' | 'remember'>, IId, ITimeStamp {
  providers: TAuthProvider[];
  role: TRole;
}
