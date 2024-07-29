/**
 * At a given time, periodically the state is processed and the todos are reset if necessary
 */

import { State } from "@/state/state";
import {
  isBeforeThisMonth,
  isBeforeThisWeek,
  isBeforeThisYear,
  isBeforeToday,
} from "@/helper/date";
import { useVisibility } from "@/VisibilityProvider";
import { useEffect } from "react";

/**
 * Check the todo completed date and reset them if necessary
 */
export const resetTodos = (state: State): State => {
  if (state.lastReset && !isBeforeToday(state.lastReset)) {
    return state;
  }

  return cleanupUnusedTags(resetTodoCompleteness(removeNonce(state)));
};

/**
 * cleanup orphan tags
 */
const cleanupUnusedTags = (state: State): State => {
  // list all used tags
  const usedTags = new Set<string>();
  state.todoLists[0].todos.forEach((todo) => {
    todo.tags.forEach((tag) => usedTags.add(tag));
  });

  return {
    lastReset: new Date(),
    todoLists: state.todoLists.map((todoList) => {
      // go through our tag dict and remove the unused ones
      const todoListTagDict = todoList.tags;

      if (todoListTagDict == null) {
        return todoList;
      }

      return {
        ...todoList,
        tags: Object.keys(todoListTagDict).reduce((acc, tag) => {
          if (usedTags.has(tag)) {
            return { ...acc, [tag]: todoListTagDict[tag] };
          }
          return acc;
        }, {}),
      };
    }),
  };
};

// Mark completed todo as incomplete if the period restarts
const resetTodoCompleteness = (state: State): State => ({
  todoLists: state.todoLists.map((todoListState) => {
    const newTodos = todoListState.todos.map((todo) => {
      if (todo.completedDate == null) {
        return todo;
      }

      const completedDate = new Date(todo.completedDate);

      if (todo.frequency === "Daily" && isBeforeToday(completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Weekly" && isBeforeThisWeek(completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Monthly" && isBeforeThisMonth(completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Yearly" && isBeforeThisYear(completedDate)) {
        return { ...todo, completedDate: null };
      }

      if (todo.frequency === "Once" && isBeforeToday(completedDate)) {
        return { ...todo, completedDate: null };
      }

      return todo;
    });

    return { ...todoListState, todos: newTodos };
  }),
  lastReset: new Date(),
});

/**
 * Remove all the todo that have a frequency of once and are marked as completed
 */
const removeNonce = (state: State): State => {
  return {
    lastReset: new Date(),
    todoLists: state.todoLists.map((todoList) => {
      return {
        ...todoList,
        todos: todoList.todos.filter(
          (todo) => !(todo.frequency === "Once" && todo.completedDate !== null),
        ),
      };
    }),
  };
};

/**
 * Reset todo at the beginning of the day
 */
export const useResetTodoRoutines = (
  state: State,
  { onNeedStateChange }: { onNeedStateChange: (state: State) => void },
) => {
  const { visible } = useVisibility();

  // call resetTodos when window becomes visible
  useEffect(() => {
    if (visible) {
      const newState = resetTodos(state);
      if (newState !== state) {
        onNeedStateChange(newState);
      }
    }
  }, [visible]);
};
