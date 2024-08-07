"use client";

import { useAppState } from "@/state/AppStateProvider";
import { TodoItem } from "@/ui/TodoItem";
import { ReactNode, useState } from "react";
import { useListNavigation } from "@/hook/useListNavigation";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { Todo } from "@/state/state";
import { useFilter } from "@/hook/useFilter";

export default function Todolist() {
  const [editModeTodos, setEditModeTodos] = useState<Todo["id"][]>([]);

  const [state, actions] = useAppState();
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
      onPressBackspace: (todoId) =>
        actions.deleteTodo(todoId, state.todoLists[0].id),
      onPressEsc: turnOffEditMode,
      customs: [
        {
          on: "e",
          handler: turnOnEditMode,
        },
      ],
    },
  );

  const requestEditModeFor = (todoId: string) => (editMode: boolean) => {
    if (editMode) {
      turnOnEditMode(todoId);
    } else {
      turnOffEditMode(todoId);
    }
  };

  return state.todoLists[0].todos.length > 0 ? (
    <AnimatedTodoTransition todos={filteredTodos}>
      {(todo) => {
        return (
          <TodoItem
            key={todo.id}
            listId={state.todoLists[0].id}
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
