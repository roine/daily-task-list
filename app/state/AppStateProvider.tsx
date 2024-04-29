"use client";
import React, { useReducer } from "react";
import { initialState, State } from "@/state/state";
import { todoReducer, getActions } from "@/state/reducer";

export const AppStateContext =
  React.createContext<[State, ReturnType<typeof getActions>]>(null);

type AppStateProviderProps = {
  children: React.ReactNode;
};
export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <AppStateContext.Provider value={[state, getActions(dispatch)]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): [State, ReturnType<typeof getActions>] => {
  const context = React.useContext(AppStateContext);

  return context;
};
