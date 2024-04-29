"use client";

import React, { ReactNode } from "react";
import { ThemeSwitcher, useTheme } from "@/ThemeProvider";
import { Alert } from "@/Alert";
import { useAppState } from "@/state/AppStateProvider";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [state] = useAppState();
  console.log(state);
  return (
    <div className="w-screen h-screen">
      {/*  maybe a sidebar */}
      <main className="relative mx-auto max-w-4xl pt-16  px-4 lg:px-0">
        <div className=" absolute right-0 top-6 hidden lg:block">
          <ThemeSwitcher />
        </div>
        {state.globalError && (
          <Alert className="mb-4" variant="error">
            {state.globalError}
          </Alert>
        )}

        {children}
      </main>
    </div>
  );
};
