"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

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
  const [user, setUser] = useState<UserResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BACKEND_ENABLED !== "true") return;

    fetch("/api/user", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: UserResponse) => {
        setUser(data);
      });
  }, []);

  const value = {
    user: user,
    loggedIn: user != null,
    signOut: () => {
      router.push("/auth/logout");
    },
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
