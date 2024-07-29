"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as database from "@/storage/database/database";
import { DailyTaskListDB } from "@/storage/database/database";
import { useAuth } from "@/auth/AuthProvider";

export type DBStatus = DailyTaskListDB | "initial" | "loggedOut";

const DatabaseContext = createContext<{
  db: DBStatus;
}>({ db: "initial" });

type DatabaseProviderProps = {
  children: ReactNode;
};

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [db, setDb] = useState<DBStatus>("initial");
  const { loggedIn } = useAuth();

  const getData = async () => {
    console.time("getData");
    const db = await database.get();
    setDb(db);
    console.timeEnd("getData");
  };

  useEffect(() => {
    if (!loggedIn) {
      setDb("loggedOut");
    } else {
      void getData();
    }
  }, [loggedIn]);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
