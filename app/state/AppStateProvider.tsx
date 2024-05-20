"use client";
import React, { useEffect, useMemo, useReducer } from "react";
import { initialState, State, TodoListState } from "@/state/state";
import { Action, Actions, getActions, reducer } from "@/state/reducer";
import { useAuth } from "@/auth/AuthProvider";
import {
  isBeforeThisMonth,
  isBeforeThisWeek,
  isBeforeThisYear,
  isBeforeToday,
  isToday,
} from "@/helper/date";
import { BrowserStorage, useLocalStorageSync } from "@/storage/localstorage";
import { useVisibility } from "@/VisibilityProvider";

/**
 * The application state is kept in sync with the localstorage.
 */

export const AppStateContext =
  // @ts-ignore
  React.createContext<[State, Actions]>(null);

type AppStateProviderProps = {
  children: React.ReactNode;
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const newState = useMemo(() => {
    // Get the state from localStorage
    const localStore = BrowserStorage.getState();

    // Reset all the todos that need reset based on their repeat frequency
    const newState = resetTodos(localStore);

    // Store updated todos in the state
    BrowserStorage.setState(newState);

    return newState;
  }, []);

  // Initialise our app state with the updated local store
  const [state, dispatch] = useReducer(reducer, newState);

  const { loggedIn } = useAuth();
  const actions = useMemo(() => getActions(dispatch, loggedIn), [loggedIn]);

  // Synchronise storage and in-memory on state change or storage change
  useLocalStorageSync(state, {
    onStorageChange: (stateFromLocalStorage: State) =>
      actions.resetState(stateFromLocalStorage),
  });

  // Reset the todos when some routines are executed
  useResetTodoRoutines(state, {
    onNeedStateChange: (newState) => {
      BrowserStorage.setState(newState);
      actions.resetState(newState);
    },
  });

  return (
    <AppStateContext.Provider value={[state, actions]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): [State, Actions] => {
  return React.useContext(AppStateContext);
};

/**
 * Check the todo completed date and reset them if necessary
 */
export const resetTodos = (state: State): State => {
  if (state.lastReset && !isBeforeToday(state.lastReset)) {
    return state;
  }

  const newTodoLists: TodoListState[] = state.todoLists.map((todoListState) => {
    const newTodos = todoListState.todos.map((todo) => {
      if (todo.completedDate == null) {
        return todo;
      }

      if (todo.frequency === "Daily" && isBeforeToday(todo.completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Weekly" && isBeforeThisWeek(todo.completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (
        todo.frequency === "Monthly" &&
        isBeforeThisMonth(todo.completedDate)
      ) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Yearly" && isBeforeThisYear(todo.completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Once" && isBeforeToday(todo.completedDate)) {
        return { ...todo, completedDate: null };
      }

      return todo;
    });

    return { ...todoListState, todos: newTodos };
  });

  return { todoLists: newTodoLists, lastReset: new Date() };
};

const useResetTodoRoutines = (
  state: State,
  { onNeedStateChange }: { onNeedStateChange: (state: State) => void },
) => {
  const { visible } = useVisibility();

  // call resetTodos when window becomes visible
  useEffect(() => {
    if (visible) {
      const newState = resetTodos(state);
      if (newState !== state) {
        onNeedStateChange(newState);
      }
    }
  }, [visible]);
};
