import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from "react";
import { useAppState } from "@/state/AppStateProvider";
import { v4 as uuidv4 } from "uuid";

export const TodoCreate = () => {
  const inputDiv = useRef<HTMLInputElement | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [state, actions] = useAppState();

  const mouseEnter = () => {
    if (inputDiv.current != null) {
      inputDiv.current.focus();
    }
  };

  const addTodoOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // add todo when press enter
    if (e.key === "Enter") {
      actions.addTodo({
        id: uuidv4(),
        text: e.currentTarget.value,
        completedDate: null,
        recurrence: "daily",
        children: [],
      });
      if (inputDiv.current != null) {
        inputDiv.current.value = "";
      }
    }
  };

  return (
    <div onMouseEnter={mouseEnter}>
      <input
        onKeyDown={addTodoOnEnter}
        ref={inputDiv}
        type="text"
        placeholder="Type here"
        className="bg-transparent rounded-none w-full mb-6 p-4 pl-0 outline-none border-b-2 border-b-solid border-b-accent focus:border-b-primary-content transition-all duration-300 linear"
      />
    </div>
  );
};
