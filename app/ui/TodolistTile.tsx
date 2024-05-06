"use client";

import { useAppState } from "@/state/AppStateProvider";

type TodoListTitleProps = {};
export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();
  return (
    <h1
      contentEditable={true}
      className="text-4xl tracking-tight outline-none my-2 lg:my-6"
      defaultValue={state.todoLists[0].todoTitle}
      onBlur={(e) => actions.changeTodoTitle(e.currentTarget.innerText)}
      suppressContentEditableWarning={true}
    >
      {state.todoLists[0].todoTitle}
    </h1>
  );
};
