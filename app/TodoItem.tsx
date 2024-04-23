import { Todo } from "./state";
import { getActions } from "@/reducer";

export const TodoItem = (todo: Todo & ReturnType<typeof getActions>) => {
  return (
    <li className="list-none">
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox"
            checked={todo.completedDate != null}
            onChange={() => todo.toggleTodo(todo.id)}
          />
          <span className="label-text text-base">{todo.text}</span>
        </label>
      </div>
    </li>
  );
};

// const TodoItemWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
// `;
