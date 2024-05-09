"use client";
import { useAppState } from "../state/AppStateProvider";
import { TodoItem } from "@/ui/TodoItem";
import { useEffect, useState } from "react";
import { useListNavigation } from "@/hook/useListNavigation";
import { Todo } from "@/state/state";
import { useAuth } from "@/auth/AuthProvider";

export default function Todolist() {
  const [state, actions] = useAppState();
  const { loggedIn } = useAuth();
  const handlePressEnter = (selectedTodoId: string) => {
    actions.toggleCompletedTodo(selectedTodoId);
  };

  const [loadedFromLocalStorage, setLoadedFromLocalStorage] = useState(false);

  const handlePressBackspace = (selectedTodoId: string) => {
    actions.deleteTodo(selectedTodoId);
  };

  const { selectedTodoId } = useListNavigation(state.todoLists[0].todos, {
    onPressEnter: handlePressEnter,
    onPressBackspace: handlePressBackspace,
  });

  // Load the todos
  useEffect(() => {
    void actions.loadLocallyStoredTodos().then(() => {
      setLoadedFromLocalStorage(true);
    });
  }, []);

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
      console.log(process.env.API_SERVER_URL);
      await fetch(`/api/lists/synchronise`, {
        credentials: "include",
        body: JSON.stringify({ todoLists }),
        method: "POST",
      });
    };
    if (loadedFromLocalStorage) void synchroniseWithStorage();
  }, [loadedFromLocalStorage]);

  // listen to localstorage change on todo and update accordingly
  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === "todos") {
        void actions.loadLocallyStoredTodos();
      }
    });
    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, [selectedTodoId]);

  return state.todoLists[0].todos.length > 0 ? (
    <ul className="overflow-auto h-full flex-grow">
      {state.todoLists[0].todos.map((todo) => (
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
