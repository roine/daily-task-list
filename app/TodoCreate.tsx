import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppState } from "@/state/AppStateProvider";
import { v4 as uuidv4 } from "uuid";
import { useFocusInputOnKey } from "@/hook/useFocusInputOnKey";

export const TodoCreate = () => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [_, actions] = useAppState();
  useFocusInputOnKey(inputEl, "/");

  const mouseEnter = () => {
    if (inputEl.current != null) {
      inputEl.current.focus();
    }
  };

  const addTodoOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // add an item when press enter
    if (e.key === "Enter") {
      actions.addTodo({
        id: uuidv4(),
        text: e.currentTarget.value,
        completedDate: null,
        recurrence: "daily",
        children: [],
      });
      if (inputEl.current != null) {
        inputEl.current.value = "";
      }
    }
  };

  return (
    <div onMouseEnter={mouseEnter}>
      <input
        onKeyDown={addTodoOnEnter}
        ref={inputEl}
        type="text"
        placeholder="Type here"
        className="bg-transparent rounded-none w-full p-4 pl-0 outline-none border-b-2 border-b-solid border-b-accent focus:border-b-primary-content transition-all duration-300 linear"
      />
    </div>
  );
};
