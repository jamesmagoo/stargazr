import { NDKUser } from '@nostr-dev-kit/ndk';
import * as React from 'react';
import { ReactNode, createContext, useContext, useState } from 'react';

type UserContextProps = {
  user: NDKUser | undefined;
  logout: () => void;
  setUser: (user: NDKUser | undefined) => void
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

type UserProviderProps = {
  children: ReactNode; 
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<NDKUser | undefined>(undefined);

  const logout = () => {
    setUser(undefined);
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};