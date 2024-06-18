"use client";

import { useAppState } from "@/state/AppStateProvider";

type TodoListTitleProps = {};

export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();
  return (
    <h1
      contentEditable={true}
      className="my-7 px-3 text-5xl tracking-tight  outline-none lg:px-0 lg:text-6xl print:mb-6 print:font-extrabold print:text-black"
      defaultValue={state.todoLists[0].title}
      onBlur={(e) =>
        actions.changeTodoTitle({
          todoListId: state.todoLists[0].id,
          title: e.currentTarget.textContent ?? "",
        })
      }
      suppressContentEditableWarning={true}
    >
      {state.todoLists[0].title}
    </h1>
  );
};
