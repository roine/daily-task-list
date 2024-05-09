"use client";
import React, { useReducer } from "react";
import { initialState, State } from "@/state/state";
import { Action, getActions, reducer } from "@/state/reducer";
import { useAuth } from "@/auth/AuthProvider";

export const AppStateContext =
  // @ts-ignore
  React.createContext<[State, ReturnType<typeof getActions>]>(null);

type AppStateProviderProps = {
  children: React.ReactNode;
};
export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loggedIn } = useAuth();

  return (
    <AppStateContext.Provider value={[state, getActions(dispatch, loggedIn)]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): [State, ReturnType<typeof getActions>] => {
  return React.useContext(AppStateContext);
};
