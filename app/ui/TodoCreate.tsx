"use client";

import React, {
  KeyboardEventHandler,
  useRef,
  useState,
  useTransition,
} from "react";
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

  const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    // add an item when press enter
    if (e.key === "Enter") {
      actions.addTodo({
        id: uuidv4(),
        text: e.currentTarget.value,
        completedDate: null,
        frequency: state.todoLists[0].frequencySelected,
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

  const handleClickFrequency = (e) => {
    actions.setNextFrequency();
  };

  const handleFrequencyInfoActive = (e) => {
    e.stopPropagation();
    // opens a drawer with information about the frequency
  };

  const nextFrequency = findNextInArray(
    frequency,
    state.todoLists[0].frequencySelected,
    {
      cycle: true,
    },
  );

  const previousFrequency = findPreviousInArray(
    frequency,
    state.todoLists[0].frequencySelected,
    {
      cycle: true,
    },
  );

  return (
    <span className="flex print:hidden">
      <input
        onKeyDown={handleInputKeydown}
        ref={inputEl}
        type="text"
        placeholder="Press / to focus"
        className={classNames(
          "flex-grow rounded-none w-full mb-3 lg:mb-12 p-2 lg:p-4 outline-none border-b-2 border-b-solid border-b-accent",
          "transition-all duration-150 ease-in px-4",
          state.todoLists[0].frequencySelected === "Daily" &&
            "bg-emerald-400/5 border-b-emerald-400 focus:border-b-emerald-800",
          state.todoLists[0].frequencySelected === "Weekly" &&
            "bg-red-400/5 border-b-red-400 focus:border-b-red-800",
          state.todoLists[0].frequencySelected === "Monthly" &&
            "bg-amber-400/5 border-b-amber-400 focus:border-b-amber-800",
          state.todoLists[0].frequencySelected === "Yearly" &&
            "bg-blue-400/5 border-b-blue-400 focus:border-b-blue-800",
          state.todoLists[0].frequencySelected === "Once" &&
            "bg-stone-400/5 border-b-stone-400 focus:border-b-stone-800",
        )}
      />
      <span className="relative">
        <span
          key="next-frequency"
          className={classNames(
            "absolute top-2 lg:top-4 right-4 -translate-y-4 opacity-0",
            nextFrequency === "Daily" && "text-emerald-400",
            nextFrequency === "Weekly" && "text-red-400",
            nextFrequency === "Monthly" && "text-amber-400",
            nextFrequency === "Yearly" && "text-blue-400",
            nextFrequency === "Once" && "text-stone-400",
            isPending &&
              direction.current === "Down" &&
              "translate-y-0 opacity-100 transition-all duration-150 ease-out",
          )}
        >
          <div className="flex items-center gap-2">
            {nextFrequency}
            {nextFrequency !== "Once" && nextFrequency !== "Daily" && (
              <InfoIcon />
            )}
          </div>
        </span>
        <span
          key="current-frequency"
          className={classNames(
            "absolute top-2 lg:top-4 right-4 opacity-100 cursor-pointer",

            state.todoLists[0].frequencySelected === "Daily" &&
              "text-emerald-400",
            state.todoLists[0].frequencySelected === "Weekly" && "text-red-400",
            state.todoLists[0].frequencySelected === "Monthly" &&
              "text-amber-400",
            state.todoLists[0].frequencySelected === "Yearly" &&
              "text-blue-400",
            state.todoLists[0].frequencySelected === "Once" && "text-stone-400",
            direction.current === "Up" &&
              isPending &&
              "-translate-y-2 lg:-translate-y-4 opacity-0 transition-all duration-150 ease-in",
            direction.current === "Down" &&
              isPending &&
              "translate-y-2 lg:translate-y-4 opacity-0 transition-all  duration-150 ease-in",
          )}
        >
          <div className="flex items-center gap-2">
            <button onClick={handleClickFrequency}>
              {state.todoLists[0].frequencySelected}
            </button>

            {state.todoLists[0].frequencySelected !== "Once" &&
              state.todoLists[0].frequencySelected !== "Daily" && (
                <button
                  className="text-xs"
                  aria-label="info"
                  onClick={handleFrequencyInfoActive}
                >
                  <InfoIcon />
                </button>
              )}
          </div>
        </span>
        <span
          key="prev-frequency"
          className={classNames(
            "absolute top-2 lg:top-4 right-4 translate-y-4 opacity-0",
            previousFrequency === "Daily" && "text-emerald-400",
            previousFrequency === "Weekly" && "text-red-400",
            previousFrequency === "Monthly" && "text-amber-400",
            previousFrequency === "Yearly" && "text-blue-400",
            previousFrequency === "Once" && "text-stone-400",
            isPending &&
              direction.current === "Up" &&
              "translate-y-1 opacity-100 transition-all duration-150 ease-out",
          )}
        >
          <div className="flex items-center gap-2">
            {previousFrequency}
            {previousFrequency !== "Once" && previousFrequency !== "Daily" && (
              <InfoIcon />
            )}
          </div>
        </span>
      </span>
    </span>
  );
};

// a component of an icon representing an info icon
const InfoIcon = () => {
  return (
    // an invisible button to represent an info icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="stroke-current shrink-0 w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
};
