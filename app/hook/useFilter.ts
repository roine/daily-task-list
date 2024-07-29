import { Todo } from "@/state/state";
import { noop } from "@/helper/function";
import { useEffect, useRef } from "react";
import { useAppState } from "@/state/AppStateProvider";

export const useFilter = (
  {
    onFilterChange,
  }:
    | {
        onFilterChange: (filter: string | null, filteredTodos: Todo[]) => void;
      }
    | undefined = { onFilterChange: noop },
) => {
  const [state, actions] = useAppState();

  const oldFilter = useRef(state.todoLists[0].filterBy);

  // Notify parent that the filter changed, make sure to run only on filter change
  useEffect(() => {
    if (oldFilter.current !== state.todoLists[0].filterBy) {
      onFilterChange(
        state.todoLists[0].filterBy,
        hookValues.getFilteredTodos(),
      );
      oldFilter.current = state.todoLists[0].filterBy;
    }
  }, [state.todoLists[0].filterBy]);

  const hookValues = {
    setFilter: (filter: string) => {
      actions.setFilter(filter);
    },
    clearFilter: () => {
      actions.clearFilter();
    },
    getFilter: () => {
      return state.todoLists[0].filterBy;
    },
    getFilteredTodos: () => {
      const { filterBy } = state.todoLists[0];
      if (filterBy === null) {
        return state.todoLists[0].todos;
      }

      return state.todoLists[0].todos.filter((todo) => {
        return todo.tags.includes(filterBy);
      });
    },
  };

  return hookValues;
};
