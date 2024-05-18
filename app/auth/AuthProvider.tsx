"use client";
import React from "react";

type UserResponse = {
  data: {
    user: User | null;
  };
};

type User = {};
export const AuthContext = React.createContext<null | {
  user: User | null;
  loggedIn: boolean;
  signOut: () => void;
}>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const user = null;
  // todo
  const value = {
    user: user,
    loggedIn: user != null,
    signOut: () =>
      window.location.replace(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/logout`,
      ),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
