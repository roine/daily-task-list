import { ThemeSwitcher } from "@/ThemeProvider";
import React from "react";
import { useAuth } from "@/auth/AuthProvider";
import classNames from "classnames";
import { useOffline } from "@/OfflineProvider";
import { HamburgerIcon } from "@/icons/Hamburger";

export default function Navbar() {
  const { loggedIn, signOut } = useAuth();
  const { offline } = useOffline();

  return (
    <div className="z-10 hidden bg-base-100 drop-shadow-sm lg:block print:hidden">
      <div className="navbar mx-auto max-w-4xl px-0 py-0">
        <div className="flex-1">
          <span
            title={offline ? "Offline" : "Online"}
            className={classNames(
              "badge badge-primary badge-xs -ml-8 mr-2 hidden lg:block",
              offline ? "badge-error" : "badge-success",
            )}
          />
          <div className="navbar-start z-10">
            <div className="drop dropdown -ml-1">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
              >
                <HamburgerIcon />
              </div>
              <ul className="menu dropdown-content menu-sm  mt-2 w-52 rounded-box bg-base-100 p-2 shadow">
                {loggedIn && !offline && (
                  <>
                    <li>
                      <a href="/profile">Profile</a>
                    </li>
                    <li>
                      <a href="#" onClick={signOut}>
                        Sign out
                      </a>
                    </li>
                  </>
                )}
                {!loggedIn && !offline && (
                  <li>
                    <a href={`/auth/login`}>Sign in</a>
                  </li>
                )}
                {offline && (
                  //   tailwind css class to make it look like a message
                  <li className="p-2 text-xs italic text-base-content/50">
                    You are offline. Your changes will be synchronised as soon
                    as you connect to the internet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-0">
            <li>
              <ThemeSwitcher className="hidden px-0 lg:block" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
