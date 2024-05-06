import { ThemeSwitcher } from "@/ThemeProvider";
import React from "react";
import { useAuth } from "@/auth/AuthProvider";

export default function Navbar() {
  const { loggedIn, signOut } = useAuth();

  return (
    <div className="navbar bg-base-100 max-w-4xl mx-auto px-0">
      <div className="flex-1">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {loggedIn && (
                <li>
                  <a href="#" onClick={signOut}>
                    Sign out
                  </a>
                </li>
              )}
            </ul>
          </div>
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
  );
}
