import { createContext, useContext } from 'react';

export type UserPlan = 'free' | 'pro' | 'business' | 'fast' | 'turbo' | 'ultra';

export type User = {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  plan: UserPlan;
};

// Mock logged-in user — swap this out with real auth data when available
export const MOCK_USER: User = {
  firstName: 'User',
  plan: 'fast', // "fast" | "turbo" | "ultra"
};

type UserContextValue = {
  user: User;
};

const UserContext = createContext<UserContextValue>({ user: MOCK_USER });

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
