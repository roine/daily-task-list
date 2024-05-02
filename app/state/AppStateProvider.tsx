"use client";
import React, { useReducer } from "react";
import { initialState, State } from "@/state/state";
import { getActions, reducer } from "@/state/reducer";

export const AppStateContext =
  // @ts-ignore
  React.createContext<[State, ReturnType<typeof getActions>]>(null);

type AppStateProviderProps = {
  children: React.ReactNode;
};
export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppStateContext.Provider value={[state, getActions(dispatch)]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): [State, ReturnType<typeof getActions>] => {
  return React.useContext(AppStateContext);
};
