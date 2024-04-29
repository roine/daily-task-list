import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import React, { ReactNode } from "react";
import { AppLayout } from "@/AppLayout";
import "./globals.css";
import { ThemeProvider } from "@/ThemeProvider";
import cls from "classnames";
import { AppStateProvider } from "@/state/AppStateProvider";
import classNames from "classnames";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Daily task list",
  description:
    "A todo list that resets everyday. No accounts, no installations required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(roboto.className, "w-full h-full")}>
        <ThemeProvider>
          <AppStateProvider>
            <AppLayout>{children}</AppLayout>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
