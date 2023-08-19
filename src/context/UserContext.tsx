import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";

type User = {
  npub: string;
  signer: any;
} | undefined;

type UserContextProps = {
  user: User;
  login: () => Promise<void>;
  logout: () => void;
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
    children: ReactNode; // Defines the 'children' prop
  };

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => { // Use the 'UserProviderProps' type here
    const [user, setUser] = useState<User>(undefined);
    const { loginWithNip07, signer } = useNDK();
  
    const login = async () => {
      console.log(`user provider logging in...`)
      const user = await loginWithNip07();
      setUser(user);
    };
  
    const logout = () => {
      setUser(undefined);
    };
  
    return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
  };
