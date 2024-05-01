import { darkThemes, lightThemes, useTheme } from "@/ThemeProvider";
import { useEffect, useState } from "react";
import { findNextInArray, findPreviousInArray } from "@/helper/array";
import { Theme } from "daisyui";

export const useThemeSwitcherShortcut = () => {
  const { changeTheme, theme } = useTheme();
  const [lastDarkTheme, setLastDarkTheme] = useState<Theme>("dark");
  const [lastLightTheme, setLastLightTheme] = useState<Theme>("light");

  useEffect(() => {
    if (darkThemes.includes(theme)) {
      setLastDarkTheme(theme);
    } else if (lightThemes.includes(theme)) {
      setLastLightTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleThemeSwitch = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) {
        return;
      }
      if (e.altKey) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          const themes = darkThemes.includes(theme) ? darkThemes : lightThemes;
          const findFunction =
            e.key === "ArrowDown" ? findNextInArray : findPreviousInArray;
          const nextTheme = findFunction(themes, theme, { cycle: true });
          // @ts-ignore
          changeTheme(nextTheme);
        } else if (e.key === "ArrowLeft") {
          // @ts-ignore
          changeTheme(lastLightTheme);
        } else if (e.key === "ArrowRight") {
          // @ts-ignore
          changeTheme(lastDarkTheme);
        }
      }
    };

    document.addEventListener("keydown", handleThemeSwitch);

    return () => {
      document.removeEventListener("keydown", handleThemeSwitch);
    };
  }, [changeTheme, lastDarkTheme, lastLightTheme]);
};
