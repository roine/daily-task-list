"use client";

import { useAppState } from "@/state/AppStateProvider";

type TodoListTitleProps = {};

export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();
  return (
    <h1
      contentEditable={true}
      className="text-4xl tracking-tight outline-none my-3 lg:my-7 print:mb-6 print:text-black print:font-extrabold"
      defaultValue={state.todoLists[0].todoTitle}
      onBlur={(e) => actions.changeTodoTitle(e.currentTarget.innerText)}
      suppressContentEditableWarning={true}
    >
      {state.todoLists[0].todoTitle}
    </h1>
  );
};
