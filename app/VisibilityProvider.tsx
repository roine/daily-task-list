"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type VisibilityProviderProps = {
  children: React.ReactNode;
};

export const VisibilityContext = createContext<{ visible: boolean }>({
  visible: false,
});

export const VisibilityProvider = ({ children }: VisibilityProviderProps) => {
  const [visible, setVisible] = useState<boolean>(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => setVisible(!document.hidden);

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <VisibilityContext.Provider value={{ visible }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => {
  return useContext(VisibilityContext);
};
