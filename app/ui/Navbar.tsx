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
    <div className="bg-base-100 print:hidden drop-shadow-sm">
      <div className="navbar max-w-4xl mx-auto px-0 py-0">
        <div className="flex-1">
          <span
            title={offline ? "Offline" : "Online"}
            className={classNames(
              "badge badge-primary badge-xs -ml-8 mr-2 hidden lg:block",
              offline ? "badge-error" : "badge-success",
            )}
          />
          <div className="navbar-start">
            {process.env.NEXT_PUBLIC_AUTH_SERVER_URL && (
              <div className="dropdown -ml-1 drop">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
                >
                  <HamburgerIcon />
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {loggedIn && !offline && (
                    <li>
                      <a href="#" onClick={signOut}>
                        Sign out
                      </a>
                    </li>
                  )}
                  {!loggedIn && !offline && (
                    <li>
                      <a href={`${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}`}>
                        Sign in
                      </a>
                    </li>
                  )}
                  {offline && (
                    //   tailwind css class to make it look like a message
                    <li className="text-xs italic text-base-content/50 p-2">
                      You are offline. Your changes will be synchronised as soon
                      as you connect to the internet.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-0">
            <li>
              <ThemeSwitcher className="px-0 hidden lg:block" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
