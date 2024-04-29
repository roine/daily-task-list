import { useAppState } from "./state/AppStateProvider";
import { TodoItem } from "@/TodoItem";
import { useEffect } from "react";

export default function Todolist() {
  const [state, actions] = useAppState();

  const ongoingTodos = state.todos.filter((todo) => todo.completedDate == null);
  const completedTodos = state.todos.filter(
    (todo) => todo.completedDate !== null,
  );

  useEffect(() => {
    void actions.getTodos();
  }, []);

  return (
    <div>
      <ul>
        {ongoingTodos.map((todo) => (
          <TodoItem key={todo.id} {...actions} {...todo} />
        ))}
      </ul>
      {completedTodos.length > 0 && ongoingTodos.length > 0 && (
        <div className="divider" />
      )}
      <ul>
        {completedTodos.map((todo) => (
          <TodoItem key={todo.id} {...actions} {...todo} />
        ))}
      </ul>
    </div>
  );
}

// const TodolistWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
