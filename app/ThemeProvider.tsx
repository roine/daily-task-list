"use client";
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { isDarkMode, isLightMode } from "@/helper/device";
import { Theme } from "daisyui";

const themeKey = "theme";

export const darkThemes: Theme[] = [
  "dim",
  "dark",
  "dracula",
  "synthwave",
  "halloween",
  "forest",
  "luxury",
  "black",
  "night",
  "business",
  "coffee",
  "sunset",
];

export const lightThemes: Theme[] = [
  "light",
  "valentine",
  "pastel",
  "aqua",
  "retro",
  "cyberpunk",
  "cupcake",
  "emerald",
  "corporate",
  "bumblebee",
  "garden",
  "lofi",
  "fantasy",
  "wireframe",
  "cmyk",
  "autumn",
  "acid",
  "lemonade",
  "winter",
  "nord",
];
// count how many themes and log it

const ThemeContext = createContext<{
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}>({
  theme: "light",
  changeTheme: () => {},
});

const getMediaQueryPreference = (): Theme => {
  if (isDarkMode()) {
    return "dark";
  }
  if (isLightMode()) {
    return "light";
  }
  return "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMounted, setIsMounted] = useState(false);

  // Load the theme either from localStorage or from the media query
  useEffect(() => {
    setIsMounted(true);
    const userSetPreference = localStorage.getItem(themeKey) as Theme;
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
    localStorage.setItem(themeKey, newTheme);
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

  // set to intermediate if the theme is not set
  useEffect(() => {
    const userSetPreference = localStorage.getItem(themeKey) as Theme;
    if (userSetPreference === null) {
      // @ts-ignore
      document.getElementById("my-toggle")!.indeterminate = true;
    }
  }, []);

  // listen to localstorage change of theme value, and set the theme accordingly
  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === themeKey) {
        const newTheme = e.newValue as Theme;
        changeTheme(newTheme);
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // when system change preferred color change the theme
  useEffect(() => {
    const handleThemeChange = () => {
      const mediaQueryPreference = getMediaQueryPreference();
      if (theme !== mediaQueryPreference) {
        changeTheme(mediaQueryPreference);
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", handleThemeChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleThemeChange);
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", handleThemeChange);
    };
  }, [theme, changeTheme]);

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
          id={"my-toggle"}
          value="synthwave"
          className="toggle theme-controller toggle-xs"
          onChange={(e) => changeTheme(e.target.checked ? "dark" : "light")}
          checked={darkThemes.includes(theme)}
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
