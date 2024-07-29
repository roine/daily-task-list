"use client";
import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { isDarkMode, isLightMode } from "@/helper/device";
import { Theme } from "daisyui";
import { SunIcon } from "@/icons/Sun";
import { MoonIcon } from "@/icons/Moon";

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
    let newTheme = theme;
    if (userSetPreference !== null) {
      newTheme = userSetPreference;
    } else {
      newTheme = getMediaQueryPreference();
    }
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return <></>;
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem(themeKey, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeSwitcher = (props: HTMLAttributes<HTMLDivElement>) => {
  const { theme, changeTheme } = useTheme();

  useEffect(() => {
    // set to intermediate if the theme is not set
    const userSetPreference = localStorage.getItem(themeKey) as Theme;
    if (userSetPreference === null) {
      // @ts-ignore
      document.getElementById("theme-toggle")!.indeterminate = true;
    }
  }, []);

  useEffect(() => {
    // When localstorage change theme value, set the theme accordingly
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

  useEffect(() => {
    // When system change preferred color, set the theme accordingly
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
      <label className="flex  gap-1">
        <SunIcon />
        <input
          type="checkbox"
          id="theme-toggle"
          className="theme-controller toggle toggle-xs"
          onChange={(e) => changeTheme(e.target.checked ? "dark" : "light")}
          checked={darkThemes.includes(theme)}
        />
        <MoonIcon />
      </label>
    </div>
  );
};
