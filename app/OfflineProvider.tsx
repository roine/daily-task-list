"use client";
/**
 *  React Provider that listens to offline and online and update the provider value accordingly, it should use event listener in useffect
 */

import React, { createContext, useContext, useEffect, useState } from "react";

type OfflineProviderProps = {
  children: React.ReactNode;
};

export const OfflineContext = createContext<{ offline: boolean }>({
  offline: false,
});

export const OfflineProvider = ({ children }: OfflineProviderProps) => {
  const [offline, setOffline] = useState<boolean>(!window.navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ offline }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  return useContext(OfflineContext);
};
