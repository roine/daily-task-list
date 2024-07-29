"use client";

import { useAppState } from "@/state/AppStateProvider";
import { KeyboardEventHandler } from "react";

type TodoListTitleProps = {};

export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();

  const blurFieldOnEnter: KeyboardEventHandler<HTMLHeadingElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <h1
      contentEditable={true}
      className="my-7 px-3 text-5xl tracking-tight  outline-none lg:px-0 lg:text-6xl print:mb-6 print:font-extrabold print:text-black"
      defaultValue={state.todoLists[0].title}
      onBlur={(e) =>
        void actions.changeTodoTitle(
          state.todoLists[0].id,
          e.currentTarget.textContent ?? "",
        )
      }
      onKeyDown={blurFieldOnEnter}
      suppressContentEditableWarning={true}
    >
      {state.todoLists[0].title}
    </h1>
  );
};
