import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import React, { ReactNode, Suspense } from "react";
import { AppLayout } from "@/AppLayout";
import "./globals.css";
import { ThemeProvider } from "@/ThemeProvider";
import { AppStateProvider } from "@/state/AppStateProvider";
import classNames from "classnames";
import { AuthProvider } from "@/auth/AuthProvider";
import { cookies } from "next/headers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Daily task list",
  description:
    "A todo list that resets everyday. No accounts, no installations required.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let user = null;
  try {
    user = await fetch(`${process.env.API_SERVER_URL}/api/user`, {
      headers: {
        Cookie: cookies(),
      },
    }).then((r) => r.json());
  } catch {}

  return (
    <html lang="en">
      <body
        className={classNames(
          roboto.className,
          "flex flex-col min-h-screen min-w-screen",
        )}
      >
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider user={user}>
              <AppStateProvider>
                <AppLayout>{children}</AppLayout>
              </AppStateProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
