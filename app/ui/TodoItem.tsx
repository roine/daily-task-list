import { Frequency, frequency, Todo } from "../state/state";
import { getTodoActions } from "@/state/reducer/todoReducer";
import classNames from "classnames";
import { isTouchScreen } from "@/helper/device";
import SwipeableViews from "react-swipeable-views";
import React, { useState } from "react";
import { useFilter } from "@/state/AppStateProvider";
import { TrashCanIcon } from "@/icons/TrashCan";
import { getAllHashTagText, hashRegexp } from "@/helper/string";
import { PencilIcon } from "@/icons/Pencil";
import { CheckIcon } from "@/icons/Check";
import { CloseIcon } from "@/icons/Close";

type TodoItemProps = {
  editMode: boolean;
  requestEditMode: (editMode: boolean) => void;
  selected: boolean;
  tagProps: Record<string, { color: string }> | null;
} & Todo &
  ReturnType<typeof getTodoActions>;

export const TodoItem = (todo: TodoItemProps) => {
  return todo.editMode ? (
    <TodoItemEditMode
      todo={todo}
      setReadMode={() => todo.requestEditMode(false)}
    />
  ) : (
    <TodoItemReadMode
      todo={todo}
      setEditMode={() => todo.requestEditMode(true)}
    />
  );
};

const TodoItemEditMode = ({
  todo,
  setReadMode,
}: {
  todo: TodoItemProps;
  setReadMode: () => void;
}) => {
  const [newFrequency, setNewFrequency] = useState<Frequency>(todo.frequency);
  const [newText, setNewText] = useState(todo.text);

  return (
    <form
      onSubmit={() => {
        const hashTags = getAllHashTagText(newText);
        todo.updateTagDictionary(hashTags);

        const newTodo: Todo = {
          id: todo.id,
          text: newText,
          completedDate: todo.completedDate,
          frequency: newFrequency,
          position: todo.position,
          children: todo.children,
          tags: hashTags,
        };
        // need to remove old tags and add new tags
        todo.editTodo(newTodo);
        setReadMode();
      }}
      className={classNames(
        "flex gap-3 px-2 py-3 items-center shadow-inner border-l-2 border-solid",
        { "border-transparent": isTouchScreen() || !todo.selected },
        {
          "border-accent shadow-inner print:shadow-none print:border-transparent":
            todo.selected && !isTouchScreen(),
        },
      )}
    >
      <input
        aria-label="Edit task text."
        type="text"
        defaultValue={todo.text}
        className={classNames(
          "input input-bordered input-sm flex items-center flex-grow",
        )}
        autoFocus
        onChange={(e) => setNewText(e.target.value)}
      />
      <select
        className="select select-bordered select-sm"
        aria-label="Select repeat frequency for task."
        defaultValue={todo.frequency}
        onChange={(e) => setNewFrequency(e.target.value as Frequency)}
      >
        <option disabled>Frequency</option>
        {frequency.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <div className="lg:tooltip" data-tip="Cancel task changes">
        <button
          type="button"
          onClick={() => setReadMode()}
          className="btn btn-sm btn-outline btn-circle"
          aria-label="Cancel task changes"
        >
          <CloseIcon className="h-4 w-4" strokeWidth="2" />
        </button>
      </div>
      <div className="lg:tooltip" data-tip="Save task changes">
        <button
          type="submit"
          className="btn btn-sm btn-outline btn-circle"
          aria-label="Save task changes"
        >
          <CheckIcon className="h-4 w-4" strokeWidth="2" />
        </button>
      </div>
    </form>
  );
};

const TodoItemReadMode = ({
  todo,
  setEditMode,
}: {
  todo: TodoItemProps;
  setEditMode: () => void;
}) => {
  const isCompleted = todo.completedDate != null;
  let [distance, setDistance] = useState(0);
  const { setFilter, getFilter } = useFilter();

  return (
    <div
      className={classNames(
        "relative text border-l-2 border-solid group",
        "hover:shadow-inner",
        { "border-transparent": isTouchScreen() || !todo.selected },
        {
          "border-accent shadow-inner print:shadow-none print:border-transparent":
            todo.selected && !isTouchScreen(),
        },
        { "active:bg-accent/5": isTouchScreen() && distance < 0.2 },
        { "bg-red-600 text-black": isTouchScreen() && distance >= 0.2 },
      )}
    >
      <SwipeableViews
        style={!isTouchScreen() ? { overflowX: "visible" } : undefined} // make sure the tooltip can show on desktop
        disabled={!isTouchScreen()}
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
        <span className="flex gap-3 items-start py-2 print:py-1 lg:py-3 px-0 lg:px-2 print:px-0 print:text-black">
          <input
            tabIndex={-1}
            type="checkbox"
            className="checkbox"
            checked={isCompleted}
            onChange={() => todo.toggleCompleted(todo.id)}
          />
          <span className="text-base flex-grow">
            {todo.text.split(hashRegexp).map((part, index) => {
              // Check if the part starts with #
              if (part.startsWith("#")) {
                const tagColor = todo.tagProps?.[part]?.color;
                return (
                  <button
                    tabIndex={-1}
                    aria-label={`Filter by ${part}`}
                    onClick={() => setFilter(part)}
                    disabled={getFilter() === part}
                    key={index}
                    className={classNames(
                      `bg-gradient-to-br from-${tagColor}-300 to-${tagColor}-500 inline-block text-transparent bg-clip-text px-1 font-semibold text-xs`,
                    )}
                  >
                    {part}
                  </button>
                );
              }
              // there's a flaw in the regexp and white space appear as part
              if (part === " ") {
                return <></>;
              }
              return (
                <span key={index} className="mx-0.5">
                  {part}
                </span>
              );
            })}
          </span>
          <div className="absolute z-50 right-1 flex gap-x-1.5 top-1/2 -translate-y-1/2 md:group-hover:visible invisible">
            <div className="lg:tooltip" data-tip="Edit task">
              <button
                className="btn btn-ghost btn-sm btn-circle btn-outline"
                onClick={() => setEditMode()}
              >
                <PencilIcon className="h-4 w-4" strokeWidth="2" />
              </button>
            </div>

            <div className="lg:tooltip" data-tip="Delete task">
              <button
                className="btn btn-ghost btn-sm btn-circle btn-outline btn-error"
                onClick={() => {
                  todo.deleteTodo(todo.id);
                }}
              >
                <TrashCanIcon className="h-4 w-4" strokeWidth="2" />
              </button>
            </div>
          </div>

          <span className="text-sm print:hidden block md:group-hover:invisible">
            {todo.frequency}
          </span>
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
    </div>
  );
};
