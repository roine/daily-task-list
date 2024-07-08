"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RemoteData } from "@/helper/remoteData";
import { Maybe } from "@/helper/maybe";

type User = {};

export const AuthContext = React.createContext<
  Maybe.Model<{
    user: Maybe.Model<User>;
    loggedIn: boolean;
    signOut: () => void;
  }>
>(Maybe.nothing);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [remoteUser, setRemoteUser] = useState<
    RemoteData.Model<string, Maybe.Model<User>>
  >(RemoteData.initial);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((data: User) => {
        setRemoteUser(
          RemoteData.success(
            remoteUser == null ? Maybe.nothing : Maybe.just(data),
          ),
        );
      })
      .catch((e) => {
        console.log(e);
        setRemoteUser(RemoteData.failure(e.message));
      });
  }, []);

  if (RemoteData.isPending(remoteUser) || RemoteData.isInitial(remoteUser)) {
    return null;
  }

  const user = RemoteData.isSuccess(remoteUser)
    ? remoteUser.value
    : Maybe.nothing;

  const value = {
    user,
    loggedIn: Maybe.isJust(user),
    signOut: () => {
      router.push("/auth/logout");
    },
  };

  return (
    <AuthContext.Provider value={Maybe.just(value)}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (Maybe.isNothing(context)) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return Maybe.fromJust(context);
};
