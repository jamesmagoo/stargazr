import { createContext, useContext, useState, ReactNode } from 'react';
import * as React from 'react'
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKUser, NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { toast } from 'react-toastify';

type UserContextProps = {
  user: NDKUser | undefined;
  logout: () => void;
  login: () => void;
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
  const [user, setUser] = useState<NDKUser | undefined>(undefined);

  const {ndk} = useNDK()
  const login = async () => {
    console.log(`user provider logging in...`)
    let newUser: NDKUser | undefined
    try {
        const nip07signer = new NDKNip07Signer();
        nip07signer.user().then(async (user) => {
            if (!!user.npub) {
                newUser = ndk?.getUser({ npub: `${user.npub}` })
                console.log(newUser)
                await newUser?.fetchProfile()
                setUser(newUser)
                const message = newUser?.profile ? `Welcome ${newUser.profile.displayName}` : 'Welcome';
                toast.success(message)
                setUser(newUser)
            }
        }).catch((err) => {
            console.log("Problem logging in: ", err)
        })
    } catch (err) {
        console.log(err)
    }
};


  const logout = () => {
    setUser(undefined);
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};