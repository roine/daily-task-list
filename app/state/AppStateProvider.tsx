"use client";
import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { State } from "@/state/state";
import { Actions, getActions, getReducer } from "@/state/reducer";
import { useAuth } from "@/auth/AuthProvider";
import { BrowserStorage } from "@/storage/localstorage";
import { useResetTodoRoutines } from "@/state/stateResetter";
import { useDatabase } from "@/storage/database/DatabaseProvider";
import {
  DailyTaskListDB,
  getLatestStateFromDB,
} from "@/storage/database/database";
import { remoteTagsStream$ } from "@/storage/database/collections/tags";
import { remoteListsStream$ } from "@/storage/database/collections/todo_lists";

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
  const { db } = useDatabase();
  const { loggedIn } = useAuth();

  const [state, dispatch] = useReducer(
    getReducer(db),
    BrowserStorage.getState({ useSandbox: !loggedIn }),
  );

  const actions = useMemo(() => getActions(dispatch, loggedIn), [db, loggedIn]);

  // Reset the todos when some routines are executed and on mount
  useResetTodoRoutines(state, {
    onNeedStateChange: (newState) => {
      console.log("routine ran");
      actions.resetState(newState);
    },
  });

  /**
   * On boot, assign the database changes to the state, also
   * subscribe to database changes and update the state accordingly.¬
   */
  useEffect(() => {
    const setStateFromDB = async (db: DailyTaskListDB) => {
      const newState = await getLatestStateFromDB(db);
      actions.resetState(newState);
    };

    if (db !== "initial" && db !== "loggedOut") {
      void setStateFromDB(db);
      db.$.subscribe(async (changes) => {
        console.log("Received changes from the remote", { changes });
        void setStateFromDB(db);
      });
    }

    remoteListsStream$.subscribe((changes) => {
      console.log("listening to the custom stream", changes);
    });
  }, [db]);

  return (
    <AppStateContext.Provider value={[state, actions]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): [State, Actions] => {
  return React.useContext(AppStateContext);
};
