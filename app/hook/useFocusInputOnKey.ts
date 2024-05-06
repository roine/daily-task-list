import { MutableRefObject, useCallback, useEffect } from "react";

// This hook will focus the input element when the key is pressed
export const useFocusInputOnKey = (
  inputEl: MutableRefObject<HTMLInputElement | null>,
  key: KeyboardEvent["key"] | Array<KeyboardEvent["key"]>,
) => {
  const handleCreateHotkeys = (e: KeyboardEvent) => {
    const isBodyFocused = document.activeElement === document.body;
    if (!isBodyFocused) {
      return;
    }

    if ((key instanceof Array && key.includes(e.key)) || key === e.key) {
      e.preventDefault();
      if (inputEl.current != null) {
        inputEl.current.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleCreateHotkeys, true);

    return () => {
      document.removeEventListener("keydown", handleCreateHotkeys, true);
    };
  }, []);
};
