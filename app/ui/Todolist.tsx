"use client";
import { useAppState, useFilter } from "../state/AppStateProvider";
import { TodoItem } from "@/ui/TodoItem";
import { ReactNode, useEffect } from "react";
import { useListNavigation } from "@/hook/useListNavigation";
import { useAuth } from "@/auth/AuthProvider";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { Todo } from "@/state/state";

export default function Todolist() {
  const [state, actions] = useAppState();
  const { loggedIn } = useAuth();
  const { getFilteredTodos } = useFilter({
    onFilterChange: () => {
      setSelectedTodoId(null);
    },
  });

  const filteredTodos = getFilteredTodos();

  const handlePressEnter = (selectedTodoId: string) => {
    actions.toggleCompleted(selectedTodoId);
  };

  const handlePressBackspace = (selectedTodoId: string) => {
    actions.deleteTodo(selectedTodoId);
  };

  const { selectedTodoId, setSelectedTodoId } = useListNavigation(
    filteredTodos,
    {
      onPressEnter: handlePressEnter,
      onPressBackspace: handlePressBackspace,
    },
  );

  // Synchronise with storage
  useEffect(() => {
    if (!loggedIn) return;
    const todoLists = state.todoLists.map((tl) => ({
      id: tl.id,
      todos: tl.todos,
      title: tl.todoTitle,
      position: tl.position,
    }));

    const synchroniseWithStorage = async () => {
      await fetch(`/api/lists/synchronise`, {
        credentials: "include",
        body: JSON.stringify({ todoLists }),
        method: "POST",
      });
    };

    void synchroniseWithStorage();
  }, []);

  return state.todoLists[0].todos.length > 0 ? (
    <AnimatedTodoTransition todos={filteredTodos}>
      {(todo) => (
        <TodoItem
          key={todo.id}
          tagProps={state.todoLists[0].tags}
          {...actions}
          {...todo}
          selected={todo.id === selectedTodoId}
        />
      )}
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
      config: { overshootClamping: true },
      onUpdate: (val) => {
        // @ts-ignore
        el.style.opacity = 1 - val;
      },
      onComplete: removeElement,
    });

    return () => {
      el.style.opacity = "";
      removeElement();
    };
  };

  return (
    <Flipper
      flipKey={todos.map((item) => item.id).join("")}
      className="staggered-list-content flex-grow"
      spring="noWobble"
    >
      <div>
        {todos.map((todo) => (
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
