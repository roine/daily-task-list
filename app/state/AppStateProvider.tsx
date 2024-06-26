"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { State, Todo, TodoListState } from "@/state/state";
import { Actions, getActions, reducer } from "@/state/reducer";
import { useAuth } from "@/auth/AuthProvider";
import {
  isBeforeThisMonth,
  isBeforeThisWeek,
  isBeforeThisYear,
  isBeforeToday,
} from "@/helper/date";
import { BrowserStorage, useLocalStorageSync } from "@/storage/localstorage";
import { useVisibility } from "@/VisibilityProvider";
import { noop } from "@/helper/function";
import { resetTodos, useResetTodoRoutines } from "@/state/stateResetter";

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

export const useFilter = (
  {
    onFilterChange,
  }:
    | {
        onFilterChange: (filter: string | null, filteredTodos: Todo[]) => void;
      }
    | undefined = { onFilterChange: noop },
) => {
  const [state, actions] = useAppState();

  const oldFilter = useRef(state.todoLists[0].filterBy);

  // Notify parent that the filter changed, make sure to run only on filter change
  useEffect(() => {
    if (oldFilter.current !== state.todoLists[0].filterBy) {
      onFilterChange(
        state.todoLists[0].filterBy,
        hookValues.getFilteredTodos(),
      );
      oldFilter.current = state.todoLists[0].filterBy;
    }
  }, [state.todoLists[0].filterBy]);

  const hookValues = {
    setFilter: (filter: string) => {
      actions.setFilter(filter);
    },
    clearFilter: () => {
      actions.clearFilter();
    },
    getFilter: () => {
      return state.todoLists[0].filterBy;
    },
    getFilteredTodos: () => {
      const { filterBy } = state.todoLists[0];
      if (filterBy === null) {
        return state.todoLists[0].todos;
      }

      return state.todoLists[0].todos.filter((todo) => {
        return todo.tags.includes(filterBy);
      });
    },
  };

  return hookValues;
};
