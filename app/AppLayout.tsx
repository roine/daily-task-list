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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="relative mx-auto max-w-4xl w-full pt-0 pb-6 px-3 lg:px-0 flex flex-col grow">
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
