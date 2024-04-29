import { Todo } from "./state/state";
import { getTodoActions } from "@/state/reducer/todoReducer";
import classNames from "classnames";
import { isTouchScreen } from "@/helper/device";

type TodoItemProps = {
  selected: boolean;
} & Todo &
  ReturnType<typeof getTodoActions>;
export const TodoItem = (todo: TodoItemProps) => {
  const isCompleted = todo.completedDate != null;
  return (
    <li
      className={classNames(
        "list-none",
        {
          "border-l-2 border-accent border-solid shadow-inner":
            todo.selected && !isTouchScreen(),
        },
        {
          "border-l-2 border-transparent border-solid": !todo.selected,
        },
      )}
    >
      <div className="flex gap-3 align-items-center py-3 px-3">
        <input
          type="checkbox"
          className="checkbox"
          checked={isCompleted}
          onChange={() => todo.toggleCompletedTodo(todo.id)}
        />
        <label className="cursor-pointer">
          <span className="text-base">{todo.text}</span>
        </label>
      </div>
    </li>
  );
};
