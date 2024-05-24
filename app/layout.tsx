import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import React, { ReactNode, Suspense } from "react";
import { AppLayout } from "@/AppLayout";
import "./globals.css";
import { ThemeProvider } from "@/ThemeProvider";
import { AppStateProvider } from "@/state/AppStateProvider";
import classNames from "classnames";
import { AuthProvider } from "@/auth/AuthProvider";
import { OfflineProvider } from "@/OfflineProvider";
import { VisibilityProvider } from "@/VisibilityProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Daily task list",
  description:
    "A todo list that resets every cycle. No accounts, no installations required.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          roboto.className,
          "min-w-screen flex min-h-screen flex-col",
        )}
      >
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <OfflineProvider>
              <VisibilityProvider>
                <AuthProvider>
                  <AppStateProvider>
                    <AppLayout>{children}</AppLayout>
                  </AppStateProvider>
                </AuthProvider>
              </VisibilityProvider>
            </OfflineProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
