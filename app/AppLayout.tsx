"use client";

import React, { ReactNode } from "react";
import { ThemeSwitcher, useTheme } from "@/ThemeProvider";
import { Alert } from "@/ui/Alert";
import { useAppState } from "@/state/AppStateProvider";
import { useThemeSwitcherShortcut } from "@/hook/useThemeSwitcherShortcut";
import Navbar from "@/ui/Navbar";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [state] = useAppState();
  useThemeSwitcherShortcut();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative mx-auto flex w-full max-w-4xl grow flex-col px-0 pb-6 pt-0">
        {state.todoLists[0]?.globalError != null && (
          <Alert className="mb-4" variant="error">
            {state.todoLists[0].globalError}
          </Alert>
        )}
        {children}
      </main>
    </div>
  );
};
