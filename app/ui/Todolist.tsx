"use client";
import { useAppState, useFilter } from "../state/AppStateProvider";
import { TodoItem } from "@/ui/TodoItem";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useListNavigation } from "@/hook/useListNavigation";
import { useAuth } from "@/auth/AuthProvider";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { Todo, TodoListState } from "@/state/state";
import { RemoteStorage } from "@/storage/remoteStorage";

export default function Todolist() {
  const [editModeTodos, setEditModeTodos] = useState<Todo["id"][]>([]);

  const [state, actions] = useAppState();
  const { loggedIn } = useAuth();
  const { getFilteredTodos } = useFilter({
    onFilterChange: () => {
      setSelectedItemId(filteredTodos[0].id);
    },
  });

  const filteredTodos = getFilteredTodos();

  const turnOffEditMode = (selectedTodoId: string) =>
    setEditModeTodos(editModeTodos.filter((id) => id !== selectedTodoId));

  const turnOnEditMode = (selectedTodoId: string) =>
    setEditModeTodos([...editModeTodos, selectedTodoId]);

  const { selectedItemId, setSelectedItemId } = useListNavigation(
    filteredTodos,
    {
      onPressEnter: actions.toggleCompleted,
      onPressBackspace: actions.deleteTodo,
      onPressEsc: turnOffEditMode,
      customs: [
        {
          on: "e",
          handler: turnOnEditMode,
        },
      ],
    },
  );

  // Synchronise with storage
  useEffect(() => {
    if (!loggedIn) return;

    const doSynchronise = async () => {
      console.log("called");

      const todoLists: RemoteStorage.TodoListState[] = state.todoLists.map(
        (tl) => ({
          id: tl.id,
          todos: tl.todos,
          title: tl.title,
          position: tl.position,
          tags: tl.tags,
        }),
      );

      console.log("before", state.todoLists, "after", todoLists);

      const remoteData = await RemoteStorage.synchroniseWithStorage(todoLists);
      const newTodoList = await remoteData.json();

      console.log(newTodoList);
      actions.resetState({
        lastReset: state.lastReset,
        todoLists: newTodoList.map((tl: TodoListState) => {
          const existingTodoList = state.todoLists.find((t) => t.id === tl.id);
          return {
            ...tl,
            frequencySelected: existingTodoList?.frequencySelected ?? "Daily",
            globalError: existingTodoList?.globalError ?? null,
            filterBy: existingTodoList?.filterBy ?? null,
          };
        }),
      });
    };
    void doSynchronise();
  }, []);

  const requestEditModeFor = (todoId: string) => (editMode: boolean) => {
    if (editMode) {
      turnOnEditMode(todoId);
    } else {
      turnOffEditMode(todoId);
    }
  };

  console.log(filteredTodos, state.todoLists);

  return state.todoLists[0].todos.length > 0 ? (
    <AnimatedTodoTransition todos={filteredTodos}>
      {(todo) => {
        return (
          <TodoItem
            key={todo.id}
            tagProps={state.todoLists[0].tags}
            {...actions}
            {...todo}
            selected={todo.id === selectedItemId}
            editMode={editModeTodos.includes(todo.id)}
            requestEditMode={requestEditModeFor(todo.id)}
          />
        );
      }}
    </AnimatedTodoTransition>
  ) : (
    <p>Congratulations, you can rest now.</p>
  );
}

const AnimatedTodoTransition = ({
  todos,
  children,
}: {
  todos: Todo[];
  children: (todo: Todo) => ReactNode;
}) => {
  const [state] = useAppState();

  const onAppear = (el: HTMLElement, index: number) => {
    spring({
      onUpdate: (val) => {
        // @ts-ignore
        el.style.opacity = val;
      },
      delay: index * 50,
    });
  };

  const onExit = (
    el: HTMLElement,
    index: number,
    removeElement: () => void,
  ) => {
    spring({
      onUpdate: (val) => {
        // @ts-ignore
        el.style.opacity = 1 - val;
      },
      // invert delay to make the exit animation overlap with the enter animation
      onComplete: removeElement,
    });

    return () => {
      el.style.opacity = "";
      removeElement();
    };
  };

  return (
    <Flipper
      flipKey={todos.length}
      decisionData={{ todoListSize: state.todoLists[0].todos.length }}
      className="flex-grow"
      spring="noWobble"
    >
      <div>
        {todos.map((todo, index) => (
          <Flipped
            key={todo.id}
            flipId={todo.id}
            onAppear={onAppear}
            onExit={onExit}
          >
            {/* Use to hold animation style - DO NOT REMOVE */}
            <div>{children(todo)}</div>
          </Flipped>
        ))}
      </div>
    </Flipper>
  );
};
