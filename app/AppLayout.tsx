"use client";

import React, { ReactNode } from "react";
import { ThemeSwitcher, useTheme } from "@/ThemeProvider";
import { Alert } from "@/Alert";
import { useAppState } from "@/state/AppStateProvider";
import { useThemeSwitcherShortcut } from "@/hook/useThemeSwitcherShortcut";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [state] = useAppState();
  useThemeSwitcherShortcut();

  return (
    <div>
      <main className="relative mx-auto max-w-4xl py-4 lg:py-10  px-4 lg:px-0 flex flex-col w-screen h-screen">
        <ThemeSwitcher className="absolute right-0 top-6 hidden lg:block" />
        {state.globalError != null && (
          <Alert className="mb-4" variant="error">
            {state.globalError}
          </Alert>
        )}
        {children}
      </main>
    </div>
  );
};
