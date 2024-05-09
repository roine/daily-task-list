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
  user: UserResponse | null;
};

export const AuthProvider = ({ children, user }: AuthProviderProps) => {
  const value = {
    user: user,
    loggedIn: user != null,
    signOut: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, { method: "POST" }),
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
