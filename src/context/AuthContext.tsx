"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserData, checkUserExists } from "@/lib/firebase/auth";
import { UserData } from "@/types/index";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  isAuthenticated: false,
  isNewUser: false,
  setIsNewUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Check if user exists in Firestore
        const exists = await checkUserExists(currentUser.uid);
        setIsNewUser(!exists);

        if (exists) {
          // Get user data from Firestore
          const result = await getUserData(currentUser.uid);
          if (result.success) {
            if (result.data) {
              setUserData(result.data);
            }
          }
        }
      } else {
        setUserData(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    isLoading,
    isAuthenticated: !!user,
    isNewUser,
    setIsNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
