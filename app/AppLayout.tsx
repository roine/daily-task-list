"use client";

import React, { ReactNode } from "react";
import { ThemeSwitcher, useTheme } from "@/ThemeProvider";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme, changeTheme } = useTheme();
  return (
    <div data-theme={theme} className="w-screen h-screen">
      {/*  maybe a sidebar */}
      <main className="mx-auto max-w-4xl pt-16  px-4 lg:px-0">
        {children}
        <div className="absolute right-4 top-4 hidden lg:block">
          <ThemeSwitcher />
        </div>
      </main>
    </div>
  );
};

// const MainWrapper = styled.div`
//   background-color: #ebedf4;
//   background-image: linear-gradient(
//     220deg,
//     hsla(0, 0%, 100%, 0.8),
//     hsla(0, 0%, 100%, 0)
//   );
//   height: 100vh;
//   width: 100vw;
// `;
//
// const Main = styled.main`
//   max-width: var(--dt-main-width);
//   margin: 0 auto;
// `;
