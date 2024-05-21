import { Todo } from "../state/state";
import { getTodoActions } from "@/state/reducer/todoReducer";
import classNames from "classnames";
import { isTouchScreen } from "@/helper/device";
import SwipeableViews from "react-swipeable-views";
import React, { useState } from "react";
import { useFilter } from "@/state/AppStateProvider";
import { TrashCanIcon } from "@/icons/TrashCan";

type TodoItemProps = {
  selected: boolean;
  tagProps: Record<string, { color: string }> | null;
} & Todo &
  ReturnType<typeof getTodoActions>;

export const TodoItem = (todo: TodoItemProps) => {
  const isCompleted = todo.completedDate != null;
  let [distance, setDistance] = useState(0);
  const { setFilter, getFilter } = useFilter();

  return (
    <li
      className={classNames(
        "list-none relative text border-l-2 border-solid",
        {
          "border-accent shadow-inner print:shadow-none print:border-transparent":
            todo.selected && !isTouchScreen(),
        },
        { "active:bg-accent/5": isTouchScreen() && distance < 0.2 },
        { "bg-red-600 text-black": isTouchScreen() && distance >= 0.2 },
        {
          "border-transparent": !todo.selected,
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
          <label className="flex-grow">
            <span className="text-base">
              {todo.text.split(" ").map((part, index) => {
                // Check if the part starts with #
                if (part.startsWith("#")) {
                  const tagColor = todo.tagProps?.[part]?.color;
                  return (
                    <button
                      aria-label={`Filter by ${part}`}
                      onClick={() => setFilter(part)}
                      disabled={getFilter() === part}
                      key={index}
                      className={classNames(
                        `bg-gradient-to-br from-${tagColor}-300 to-${tagColor}-500 inline-block text-transparent bg-clip-text px-1 font-semibold mx-1.5 text-xs`,
                      )}
                    >
                      {part}
                    </button>
                  );
                }
                return (
                  <span key={index} className="mx-0.5">
                    {part}
                  </span>
                );
              })}
            </span>
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
        <TrashCanIcon />
      </div>
    </li>
  );
};
