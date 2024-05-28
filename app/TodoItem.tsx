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
          "border-l-2 border-accent border-solid shadow-inner print:border-none":
            todo.selected && !isTouchScreen(),
        },
        {
          "border-l-2 border-transparent border-solid": !todo.selected,
        },
      )}
    >
      <span className="flex gap-3 align-items-center py-2 xl:py-3  px-3 print:py-1">
        <input
          tabIndex={-1}
          type="checkbox"
          className="screen:checkbox"
          checked={isCompleted}
          onChange={() => todo.toggleCompletedTodo(todo.id)}
        />
        <label className="cursor-pointer flex-grow">
          <span className="text-base">{todo.text}</span>
        </label>
        <span className={"text-sm "}>{todo.frequency}</span>
      </span>
    </li>
  );
};
