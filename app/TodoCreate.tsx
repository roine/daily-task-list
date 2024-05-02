import { KeyboardEventHandler, useRef, useState, useTransition } from "react";
import { useAppState } from "@/state/AppStateProvider";
import { v4 as uuidv4 } from "uuid";
import { useFocusInputOnKey } from "@/hook/useFocusInputOnKey";
import { frequency, Frequency } from "@/state/state";
import classNames from "classnames";
import { findNextInArray, findPreviousInArray } from "@/helper/array";

export const TodoCreate = () => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [state, actions] = useAppState();
  useFocusInputOnKey(inputEl, "/");
  const direction = useRef<"Up" | "Down">("Down");
  const [isPending, startTransition] = useTransition();

  const addTodoOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    // add an item when press enter
    if (e.key === "Enter") {
      actions.addTodo({
        id: uuidv4(),
        text: e.currentTarget.value,
        completedDate: null,
        frequency: state.frequencySelected,
        children: [],
      });
      if (inputEl.current != null) {
        inputEl.current.value = "";
      }
    }
    // navigate the frequency on up and down
    else if (e.key === "ArrowDown") {
      e.preventDefault();

      startTransition(async () => {
        await new Promise((resolve) => {
          setTimeout(() => resolve(1), 150);
        });
        actions.setNextFrequency();
      });

      direction.current = "Down";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      startTransition(async () => {
        await new Promise((resolve) => {
          setTimeout(() => resolve(1), 150);
        });
        actions.setPrevFrequency();
      });

      direction.current = "Up";
    }
  };

  const handleClickFrequency = () => {
    actions.setNextFrequency();
  };

  return (
    <span className="flex print:hidden">
      <input
        onKeyDown={addTodoOnEnter}
        ref={inputEl}
        type="text"
        placeholder="Press / to focus"
        className={classNames(
          "flex-grow rounded-none w-full mb-3 lg:mb-12 p-2 lg:p-4 outline-none border-b-2 border-b-solid border-b-accent",
          "transition-all duration-150 ease-in px-4",
          state.frequencySelected === "Daily" &&
            "bg-emerald-400/5 border-b-emerald-400 focus:border-b-emerald-800",
          state.frequencySelected === "Weekly" &&
            "bg-red-400/5 border-b-red-400 focus:border-b-red-800",
          state.frequencySelected === "Monthly" &&
            "bg-amber-400/5 border-b-amber-400 focus:border-b-amber-800",
          state.frequencySelected === "Yearly" &&
            "bg-blue-400/5 border-b-blue-400 focus:border-b-blue-800",
          state.frequencySelected === "Once" &&
            "bg-stone-400/5 border-b-stone-400 focus:border-b-stone-800",
        )}
      />
      <span className="relative">
        <span
          key="next-frequency"
          className={classNames(
            "absolute top-2 lg:top-4 right-4 -translate-y-4 opacity-0",
            state.frequencySelected === "Daily" && "text-emerald-400",
            state.frequencySelected === "Weekly" && "text-red-400",
            state.frequencySelected === "Monthly" && "text-amber-400",
            state.frequencySelected === "Yearly" && "text-blue-400",
            state.frequencySelected === "Once" && "text-stone-400",
            isPending &&
              direction.current === "Down" &&
              "translate-y-0 opacity-100 transition-all duration-150 ease-out",
          )}
        >
          {findNextInArray(frequency, state.frequencySelected, { cycle: true })}
        </span>
        <span
          key="current-frequency"
          onClick={handleClickFrequency}
          className={classNames(
            "absolute top-2 lg:top-4 right-4 opacity-100 cursor-pointer",

            state.frequencySelected === "Daily" && "text-emerald-400",
            state.frequencySelected === "Weekly" && "text-red-400",
            state.frequencySelected === "Monthly" && "text-amber-400",
            state.frequencySelected === "Yearly" && "text-blue-400",
            state.frequencySelected === "Once" && "text-stone-400",
            direction.current === "Up" &&
              isPending &&
              "-translate-y-2 lg:-translate-y-4 opacity-0 transition-all duration-150 ease-in",
            direction.current === "Down" &&
              isPending &&
              "translate-y-2 lg:translate-y-4 opacity-0 transition-all  duration-150 ease-in",
          )}
        >
          {state.frequencySelected}
        </span>
        <span
          key="prev-frequency"
          className={classNames(
            "absolute top-2 lg:top-4 right-4 translate-y-4 opacity-0",
            state.frequencySelected === "Daily" && "text-emerald-400",
            state.frequencySelected === "Weekly" && "text-red-400",
            state.frequencySelected === "Monthly" && "text-amber-400",
            state.frequencySelected === "Yearly" && "text-blue-400",
            state.frequencySelected === "Once" && "text-stone-400",
            isPending &&
              direction.current === "Up" &&
              "translate-y-0 opacity-100 transition-all duration-150 ease-out",
          )}
        >
          {findPreviousInArray(frequency, state.frequencySelected, {
            cycle: true,
          })}
        </span>
      </span>
    </span>
  );
};
