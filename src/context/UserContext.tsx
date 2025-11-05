// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from 'react';
// import type { User } from '../interface/interface';

// interface UserContextType {
//   user: User;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context.user;
// };

// interface UserProviderProps {
//   children: ReactNode;
// }

// const defaultUser: User = {
//   _id: '690654db5ceef4469c1f1bee',
//   name: 'Dan',
//   profileUrl: 'https://i.pravatar.cc/100?img=7',
// };

// export const UserProvider = ({ children }: UserProviderProps) => {
//   const [user, setUser] = useState<User>(defaultUser);

//   return (
//     <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
//   );
// };

import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../interface/interface";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
  _id: "690654db5ceef4469c1f1bee",
  name: "Dan",
  profileUrl: "https://i.pravatar.cc/100?img=7",
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
