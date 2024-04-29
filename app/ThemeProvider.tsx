"use client";
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { isDarkMode } from "@/helper/device";

const light = "light";
const dark = "dim";

type Theme = typeof light | typeof dark;

const ThemeContext = createContext<{
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}>({
  theme: light,
  changeTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(dark);
  const [isMounted, setIsMounted] = useState(false);

  const getMediaQueryPreference = (): Theme => {
    return isDarkMode() ? dark : light;
  };

  // Load the theme either from localStorage or from the media query
  useEffect(() => {
    setIsMounted(true);
    const userSetPreference = localStorage.getItem("theme") as Theme;
    if (userSetPreference !== null) {
      setTheme(userSetPreference);
    } else {
      const mediaQueryPreference = getMediaQueryPreference();
      setTheme(mediaQueryPreference);
    }

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return <></>;
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

export const ThemeSwitcher = (props: HTMLAttributes<HTMLDivElement>) => {
  const { theme, changeTheme } = useTheme();
  return (
    <div {...props}>
      <label className="flex cursor-pointer gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v1M8 14v1M2.6 2.6l1 1M12.4 12.4l1 1M1 8h1M14 8h1M2.6 13.4l1-1M12.4 3.6l1-1" />
        </svg>
        <input
          type="checkbox"
          value="synthwave"
          className="toggle theme-controller toggle-xs"
          onChange={(e) => changeTheme(e.target.checked ? dark : light)}
          checked={theme !== light}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
    </div>
  );
};
