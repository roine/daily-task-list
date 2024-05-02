import { useAppState } from "./state/AppStateProvider";
import { TodoItem } from "@/TodoItem";
import { useEffect } from "react";
import { useListNavigation } from "@/hook/useListNavigation";
import { Todo } from "@/state/state";

export default function Todolist() {
  const [state, actions] = useAppState();

  const handlePressEnter = (selectedTodoId: string) => {
    actions.toggleCompletedTodo(selectedTodoId);
  };

  const handlePressBackspace = (selectedTodoId: string) => {
    return actions.deleteTodo(selectedTodoId);
  };

  const { selectedTodoId } = useListNavigation(state.todos, {
    onPressEnter: handlePressEnter,
    onPressBackspace: handlePressBackspace,
  });

  // Load the todos
  useEffect(() => {
    void actions.getTodos();
  }, []);

  // listen to localstorage change on todo and update accordingly
  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === "todos") {
        void actions.getTodos();
      }
    });
    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, [selectedTodoId]);

  return state.todos.length > 0 ? (
    <ul className="overflow-auto h-full flex-grow">
      {state.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          {...actions}
          {...todo}
          selected={todo.id === selectedTodoId}
        />
      ))}
    </ul>
  ) : (
    <p>Congratulations, you can rest now.</p>
  );
}
