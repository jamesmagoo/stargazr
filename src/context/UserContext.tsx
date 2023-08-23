import { createContext, useContext, useState, ReactNode } from 'react';
import * as React from 'react'
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKSubscriptionOptions, NDKUser } from '@nostr-dev-kit/ndk';

type NDKUserProfile = {
  name?: string;
  displayName?: string;
  image?: string;
  banner?: string;
  bio?: string;
  nip05?: string;
  lud06?: string;
  lud16?: string;
  about?: string;
  zapService?: string;
} | undefined;

type UserContextProps = {
  user: NDKUser;
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

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { loginWithNip07, getUser } = useNDK();
    const [user, setUser] = useState<any>(undefined);
  
    const login = async () => {
      console.log(`user provider logging in...`)
      let loginAttempt = await loginWithNip07();
      let user ;
      if(loginAttempt !== undefined){
        user = getUser(loginAttempt?.npub); 
        console.log(`User: ${user.npub}`)
      }
      try{
        let options : NDKSubscriptionOptions = {
          closeOnEose : true, 
          groupable:true}
        await user?.fetchProfile(options)
      } catch(err) {
        console.error("Problem fetching profile...",err)
  
      }
      setUser(user)
    };
  
    const logout = () => {
      setUser(undefined);
    };
  
    return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
  };