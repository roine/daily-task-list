"use client";
import React, { useReducer } from "react";
import { initialState, State } from "@/state/state";
import { todoReducer, getTodoActions } from "@/state/reducer/todoReducer";
import { getActions, reducer } from "@/state/reducer";

export const AppStateContext =
  React.createContext<[State, ReturnType<typeof getTodoActions>]>(null);

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

export const useAppState = (): [State, ReturnType<typeof getTodoActions>] => {
  const context = React.useContext(AppStateContext);

  return context;
};
