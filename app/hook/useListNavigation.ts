import { useEffect, useRef, useState } from "react";
import { findNextInArray, findPreviousInArray } from "@/helper/array";

type Callbacks = {
  onPressEnter?: (selectedItemId: string) => void;
  onPressBackspace?: (selectedItemId: string) => void;
  onPressEsc?: (selectedItemId: string) => void;
  onNavigateNext?: (selectedItemId: string, nextIndex: number) => void;
  onNavigatePrevious?: (selectedItemId: string, nextIndex: number) => void;
  customs: { on: string; handler: (selectedItemId: string) => void }[];
};

/**
 * Custom hook for handling list navigation with keyboard hotkeys
 */
export const useListNavigation = <T extends { id: string }[]>(
  list: T,
  {
    onPressEnter,
    onPressBackspace,
    onPressEsc,
    onNavigateNext,
    onNavigatePrevious,
    customs,
  }: Callbacks,
) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    list[0]?.id ?? null,
  );

  // force getting a new callback as the callback uses changing state that might become stale if not renewed
  const pressEscCallback = useRef(onPressEsc);
  useEffect(() => {
    pressEscCallback.current = onPressEsc;
  });

  useEffect(() => {
    document.addEventListener("keydown", handleListHotkeys, true);

    return () => {
      document.removeEventListener("keydown", handleListHotkeys, true);
    };
  }, [selectedItemId, list]);

  const handleListHotkeys = (e: KeyboardEvent) => {
    // keys with modifier are to be handled elsewhere
    if (e.metaKey || e.altKey || e.shiftKey) {
      return;
    }

    const isBodyFocused = document.activeElement === document.body;

    const selectedItem = list.find((item) => item.id === selectedItemId);

    // Should not happen, make TS happy
    if (selectedItem == null || selectedItemId == null) {
      return;
    }

    // Remove selection on escape, so that user can press esc and then navigate the item again
    if (e.key === "Escape") {
      e.preventDefault();
      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();
      pressEscCallback.current?.(selectedItemId);
    }

    if (!isBodyFocused) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      onPressBackspace?.(selectedItemId);
      const nextItem = findNextInArray(list, selectedItem, { trackBy: "id" });
      const prevItem = findPreviousInArray(list, selectedItem, {
        trackBy: "id",
      });
      if (nextItem) {
        setSelectedItemId(nextItem.id);
      } else if (prevItem) {
        setSelectedItemId(prevItem.id);
      } else {
        setSelectedItemId(null);
      }
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPressEnter?.(selectedItemId);
    } else if (e.key === "ArrowDown" && list.length > 1) {
      e.preventDefault();
      const nextItem = findNextInArray(list, selectedItem, { trackBy: "id" });
      if (nextItem) {
        const nextIndex = list.indexOf(nextItem);
        onNavigateNext?.(nextItem.id, nextIndex);
        setSelectedItemId(nextItem.id);
      }
    } else if (e.key === "ArrowUp" && list.length > 1) {
      e.preventDefault();
      const prevItem = findPreviousInArray(list, selectedItem, {
        trackBy: "id",
      });
      if (prevItem) {
        const prevIndex = list.indexOf(prevItem);
        onNavigatePrevious?.(prevItem.id, prevIndex);
        setSelectedItemId(prevItem.id);
      }
    } else if (customs) {
      customs.forEach((custom) => {
        if (e.key === custom.on) {
          e.preventDefault();
          custom.handler(selectedItemId);
        }
      });
    }
  };

  return {
    selectedItemId,
    setSelectedItemId,
  };
};
