import { Frequency, frequency, Todo, TodoListState } from "../state/state";
import classNames from "classnames";
import { isTouchScreen } from "@/helper/device";
import React, { useState } from "react";
import { TrashCanIcon } from "@/icons/TrashCan";
import { getAllHashTagsInText, getAllLinkText } from "@/helper/string";
import { PencilIcon } from "@/icons/Pencil";
import { CheckIcon } from "@/icons/Check";
import { CloseIcon } from "@/icons/Close";
import { SelfPositioningTooltip } from "@/ui/SelfPositioningTooltip";
import { getMetaSymbolForOS } from "@/helper/window";
import { useOnTap } from "@/hook/useTap";
import { useFilter } from "@/hook/useFilter";
import { getTodoActions } from "@/state/actions/todoActions";

type TodoItemProps = {
  editMode: boolean;
  requestEditMode: (editMode: boolean) => void;
  selected: boolean;
  tagProps: Record<string, { color: string }> | null;
  listId: TodoListState["id"];
} & Todo &
  ReturnType<typeof getTodoActions>;

export const TodoItem = (todo: TodoItemProps) => {
  return todo.editMode ? (
    <TodoItemEditMode
      todo={todo}
      listId={todo.listId}
      setReadMode={() => todo.requestEditMode(false)}
    />
  ) : (
    <TodoItemReadMode
      todo={todo}
      listId={todo.listId}
      setEditMode={() => todo.requestEditMode(true)}
    />
  );
};

const TodoItemEditMode = ({
  todo,
  listId,
  setReadMode,
}: {
  todo: TodoItemProps;
  listId: TodoListState["id"];
  setReadMode: () => void;
}) => {
  const [newFrequency, setNewFrequency] = useState<Frequency>(todo.frequency);
  const [newText, setNewText] = useState(todo.text);

  const submitEditedTodo = (newText: string) => {
    /**
     * First we submit a new tag to the dictionary if any.
     *
     * Ideally we would also remove tags that are no longer used.
     */
    const hashTags = getAllHashTagsInText(newText);

    todo.updateTagDictionary(listId, hashTags);

    const newTodo: Todo = {
      id: todo.id,
      text: newText,
      completedDate: todo.completedDate,
      frequency: newFrequency,
      position: todo.position,
      children: todo.children,
      tags: hashTags,
    };
    todo.editTodo(newTodo, listId);
    setReadMode();
  };

  return (
    <form
      onSubmit={() => submitEditedTodo(newText)}
      className={classNames(
        "flex flex-col items-stretch gap-3 border-l-0 border-solid p-3 shadow-inner lg:flex-row lg:border-l-2 lg:p-4",
        { "border-transparent": isTouchScreen() || !todo.selected },
        {
          "border-accent shadow-inner print:border-transparent print:shadow-none":
            todo.selected && !isTouchScreen(),
        },
      )}
    >
      <div className="flex flex-grow gap-3">
        <input
          aria-label="Edit task text."
          type="text"
          defaultValue={todo.text}
          className={classNames(
            "input input-sm input-bordered flex flex-grow items-center lg:input-md",
          )}
          autoFocus
          onChange={(e) => setNewText(e.target.value)}
        />
        <select
          className="select select-bordered select-sm lg:select-md"
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
      </div>

      <div className="flex gap-3 lg:hidden">
        <span className="grow">
          <button
            type="button"
            className="btn btn-outline btn-error btn-sm"
            aria-label="Delete task"
            onClick={() => todo.deleteTodo(todo.id, listId)}
          >
            <TrashCanIcon className="h-4 w-4" strokeWidth="2" />
            Delete
          </button>
        </span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setReadMode()}
          aria-label="Cancel task changes"
        >
          <CloseIcon className="h-4 w-4" strokeWidth="2" />
          Cancel
        </button>
        <button
          className="btn btn-outline btn-sm"
          aria-label="Save task changes"
        >
          <CheckIcon className="h-4 w-4" strokeWidth="2" />
          Save
        </button>
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <SelfPositioningTooltip data-tip="Cancel task changes">
          <button
            type="button"
            onClick={() => setReadMode()}
            className="btn btn-circle btn-outline btn-sm"
            aria-label="Cancel task changes"
          >
            <CloseIcon className="h-4 w-4" strokeWidth="2" />
          </button>
        </SelfPositioningTooltip>
        <SelfPositioningTooltip data-tip="Save task changes">
          <button
            type="submit"
            className="btn btn-circle btn-outline btn-sm"
            aria-label="Save task changes"
          >
            <CheckIcon className="h-4 w-4" strokeWidth="2" />
          </button>
        </SelfPositioningTooltip>
      </div>
    </form>
  );
};

const TodoItemReadMode = ({
  todo,
  listId,
  setEditMode,
}: {
  todo: TodoItemProps;
  listId: TodoListState["id"];
  setEditMode: () => void;
}) => {
  const isCompleted = todo.completedDate != null;
  const { setFilter, getFilter } = useFilter();
  const tapProps = useOnTap({
    onTap: () => {
      setEditMode();
    },
  });

  const textParts = todo.text
    .split(" ")
    .map((part) => {
      if (getAllLinkText(part).length > 0) {
        return { value: part, type: "url" as const };
      }
      if (getAllHashTagsInText(part).length > 0) {
        return { value: part, type: "hash" as const };
      }
      return { value: part, type: "plain" as const };
    })
    // merge plain parts to improve rendering performance and visual
    .reduce<{ value: string; type: "url" | "hash" | "plain" }[]>(
      (acc, part) => {
        const prevEntry = acc[acc.length - 1];
        if (part.type === "plain" && prevEntry && prevEntry.type === "plain") {
          return [
            ...acc.slice(0, acc.length - 1),
            {
              type: "plain",
              value: [prevEntry.value, part.value].join(" "),
            },
          ];
        }
        return [...acc, part];
      },
      [],
    );

  return (
    <div
      className={classNames(
        "text group relative hover:z-10 ",
        "px-3",
        "group-over",
        "border-l-0 border-solid lg:border-l-2",
        "hover:shadow-inner",
        { "border-transparent": isTouchScreen() || !todo.selected },
        {
          "border-accent shadow-inner print:border-transparent print:shadow-none":
            todo.selected && !isTouchScreen(),
        },
      )}
    >
      <div className="flex items-start gap-3 px-0 py-3 lg:px-2 lg:py-4 print:px-0 print:py-1 print:text-black">
        <input
          tabIndex={-1}
          type="checkbox"
          className="checkbox checkbox-lg lg:checkbox-md"
          checked={isCompleted}
          onChange={() => todo.toggleCompleted(todo.id)}
        />
        <div
          {...tapProps}
          className="mt-1 min-w-0 flex-grow break-inside-avoid-page space-x-1 hyphens-auto break-words pr-8 text-base lg:mt-0"
        >
          {textParts.map((part, index) => {
            if (part.type === "hash") {
              const tagColor = todo.tagProps?.[part.value]?.color ?? "pink";
              return (
                <button
                  aria-label={`Filter by ${part.value}`}
                  onClick={() => setFilter(part.value)}
                  disabled={getFilter() === part.value}
                  key={index}
                  onTouchEnd={(e) => {
                    // required for the tap event to work
                    e.stopPropagation();
                  }}
                  className={classNames(
                    `bg-gradient-to-br from-${tagColor}-300 to-${tagColor}-500 inline-block bg-clip-text px-0.5 text-xs font-semibold text-transparent`,
                  )}
                >
                  {part.value}
                </button>
              );
            }
            // backlog
            // create a hook to find if an element is near the top or bottom, so that tooltip can be positioned
            // detect keyboard to tell what is ctrl key and what is meta key
            if (part.type === "url") {
              return (
                <SelfPositioningTooltip
                  key={index}
                  data-tip={`Press ${getMetaSymbolForOS()} to follow`}
                >
                  <a
                    onTouchEnd={(e) => {
                      // required for the tap event to work
                      e.stopPropagation();
                    }}
                    href={part.value}
                    className="link"
                    onClick={(e) => {
                      if (!e.metaKey) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {part.value}
                  </a>
                </SelfPositioningTooltip>
              );
            }

            return <span key={index}>{part.value}</span>;
          })}
        </div>

        <div className="invisible absolute right-2 top-1/2 z-50 flex -translate-y-1/2  gap-x-3 md:group-hover:visible">
          <SelfPositioningTooltip data-tip="Edit task">
            <button
              className="btn btn-circle btn-ghost btn-outline btn-sm"
              onClick={() => setEditMode()}
            >
              <PencilIcon className="h-4 w-4" strokeWidth="2" />
            </button>
          </SelfPositioningTooltip>

          <SelfPositioningTooltip data-tip="Delete task">
            <button
              className="btn btn-circle btn-ghost btn-outline btn-error btn-sm"
              onClick={() => {
                todo.deleteTodo(todo.id, listId);
              }}
            >
              <TrashCanIcon className="h-4 w-4" strokeWidth="2" />
            </button>
          </SelfPositioningTooltip>
        </div>

        <span className="block text-sm md:group-hover:invisible print:hidden">
          {todo.frequency}
        </span>
      </div>
    </div>
  );
};
