import { MutableRefObject, useCallback, useEffect } from "react";

export const useFocusInputOnKey = (
  inputEl: MutableRefObject<HTMLInputElement | null>,
  key: KeyboardEvent["key"],
) => {
  const handleCreateHotkeys = useCallback(
    (e: KeyboardEvent) => {
      const isBodyFocused = document.activeElement === document.body;
      if (!isBodyFocused) {
        return;
      }

      if (e.key === key) {
        e.preventDefault();
        if (inputEl.current != null) {
          inputEl.current.focus();
        }
      }
    },
    [inputEl],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleCreateHotkeys, true);

    return () => {
      document.removeEventListener("keydown", handleCreateHotkeys, true);
    };
  }, []);
};
