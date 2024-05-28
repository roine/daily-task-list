import { useCallback, useEffect, useState } from "react";
import { findNextInArray, findPreviousInArray } from "@/helper/array";
import { Todo } from "@/state/state";

type Callbacks = {
  onPressEnter?: (selectedTodoId: string) => void;
  onPressBackspace?: (selectedTodoId: string) => Promise<{ deleted?: boolean }>;
};

/**
 * Custom hook for handling list navigation with keyboard hotkeys
 */
export const useListNavigation = <T extends { id: string }[]>(
  list: T,
  { onPressEnter, onPressBackspace }: Callbacks,
) => {
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleListHotkeys, true);

    return () => {
      document.removeEventListener("keydown", handleListHotkeys, true);
    };
  }, [selectedTodoId, list]);

  // set the first todo as selected
  useEffect(() => {
    if (list.length !== 0 && selectedTodoId == null) {
      setSelectedTodoId(list[0].id);
    }
  }, [list]);

  const handleListHotkeys = (e: KeyboardEvent) => {
    // keys with modifier are to be handled elsewhere
    if (e.metaKey || e.altKey || e.shiftKey) {
      return;
    }
    const isBodyFocused = document.activeElement === document.body;
    if (selectedTodoId == null || !isBodyFocused) {
      // Remove selection on escape if body is not the active element, so that user can press esc and then navigate the todo again
      if (e.key === "Escape") {
        const activeElement = document.activeElement as HTMLElement;
        activeElement.blur();
      }
      return;
    }

    const selectedTodo = list.find((todo) => todo.id === selectedTodoId);

    // Should not happen, make TS happy
    if (selectedTodo == null) {
      return;
    }

    if (e.key === "Backspace" && onPressBackspace != null) {
      e.preventDefault();
      onPressBackspace(selectedTodoId).then(({ deleted }) => {
        /**
         * If we are deleting then we need to move to another selected item
         */
        if (!deleted) {
          return;
        }
        const nextTodo = findNextInArray(list, selectedTodo, { trackBy: "id" });
        const prevTodo = findPreviousInArray(list, selectedTodo, {
          trackBy: "id",
        });
        if (nextTodo) {
          setSelectedTodoId(nextTodo.id);
        } else if (prevTodo) {
          setSelectedTodoId(prevTodo.id);
        } else {
          setSelectedTodoId(null);
        }
      });
    }
    if (e.key === "Enter" && onPressEnter != null) {
      e.preventDefault();
      onPressEnter(selectedTodoId);
    } else if (e.key === "ArrowDown" && list.length > 1) {
      e.preventDefault();
      const nextTodo = findNextInArray(list, selectedTodo, { trackBy: "id" });
      if (nextTodo) {
        setSelectedTodoId(nextTodo.id);
      }
    } else if (e.key === "ArrowUp" && list.length > 1) {
      e.preventDefault();
      const prevTodo = findPreviousInArray(list, selectedTodo, {
        trackBy: "id",
      });
      if (prevTodo) {
        setSelectedTodoId(prevTodo.id);
      }
    }
  };

  return { selectedTodoId };
};
