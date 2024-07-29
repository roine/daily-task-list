import type { Metadata, Viewport } from "next";
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
import { DatabaseProvider } from "@/storage/database/DatabaseProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Daily Task List",
  description:
    "A todo list that resets every cycle. No accounts, no installations required.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          "min-w-screen min-h-dvh flex flex-col",
        )}
      >
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <OfflineProvider>
              <VisibilityProvider>
                <AuthProvider>
                  <DatabaseProvider>
                    <AppStateProvider>
                      <AppLayout>{children}</AppLayout>
                    </AppStateProvider>
                  </DatabaseProvider>
                </AuthProvider>
              </VisibilityProvider>
            </OfflineProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
