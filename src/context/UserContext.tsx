import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";

type User = {
  npub: string;
  signer: any;
} | undefined;

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
  user: User;
  profile : NDKUserProfile
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
    const [user, setUser] = useState<any>(undefined);
    const [profile, setProfile] = useState<NDKUserProfile>(undefined);
    const { loginWithNip07, signer, getProfile } = useNDK();
  
    const login = async () => {
      console.log(`user provider logging in...`)
      let user = await loginWithNip07();
      setUser(user);
      if(user !== undefined){
        let profile = await getProfile(user.npub); 
        setProfile(profile)
        console.log(profile)
      }
    };
  
    const logout = () => {
      setUser(undefined);
      setProfile(undefined);
    };
  
    return <UserContext.Provider value={{ user, login, logout, profile }}>{children}</UserContext.Provider>;
  };
