import { Todo } from "../state/state";
import { getTodoActions } from "@/state/reducer/todoReducer";
import classNames from "classnames";
import { isTouchScreen } from "@/helper/device";
import SwipeableViews from "react-swipeable-views";
import React, { useState } from "react";

type TodoItemProps = {
  selected: boolean;
} & Todo &
  ReturnType<typeof getTodoActions>;

export const TodoItem = (todo: TodoItemProps) => {
  const isCompleted = todo.completedDate != null;
  let [distance, setDistance] = useState(0);

  return (
    <li
      className={classNames(
        "list-none relative text",
        {
          "border-l-2 border-accent border-solid shadow-inner print:shadow-none print:border-none":
            todo.selected && !isTouchScreen(),
        },
        { "active:bg-accent/5": isTouchScreen() && distance < 0.2 },
        { "bg-red-600 text-black": isTouchScreen() && distance >= 0.2 },
        {
          "border-l-2 border-transparent border-solid": !todo.selected,
        },
      )}
    >
      <SwipeableViews
        resistance
        onSwitching={(index, type) => {
          if (type === "move") {
            setDistance(index);
          } else {
            setDistance(0);
          }
          if (type === "end" && distance > 0.2) {
            void todo.deleteTodo(todo.id);
          }
        }}
      >
        <span className="flex gap-3 align-items-center py-4 lg:py-3 px-3 print:py-1 print:px-0 print:text-black">
          <input
            tabIndex={-1}
            type="checkbox"
            className="checkbox"
            checked={isCompleted}
            onChange={() => todo.toggleCompleted(todo.id)}
          />
          <label className="cursor-pointer flex-grow">
            <span className="text-base">{todo.text}</span>
          </label>
          <span className="text-sm print:hidden block">{todo.frequency}</span>
        </span>
      </SwipeableViews>
      <div
        className={classNames(
          "absolute right-4 top-0 bottom-0 flex items-center justify-center",
        )}
        style={{
          opacity: distance < 0.2 ? distance : 1,
        }}
      >
        <TrashCan />
      </div>
    </li>
  );
};

/*a trash can with a lid svg icon with only the outlines and being dark red as a component*/
const TrashCan = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6l2-2h14l2 2M6 6V21a2 2 0 002 2h8a2 2 0 002-2V6M10 11v6M14 11v6"></path>
    </svg>
  );
};
