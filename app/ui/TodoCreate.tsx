"use client";

import React, { KeyboardEventHandler, useRef, useState } from "react";
import { useAppState } from "@/state/AppStateProvider";
import { v4 as uuidv4 } from "uuid";
import { useFocusInputOnKey } from "@/hook/useFocusInputOnKey";
import { frequency, Frequency } from "@/state/state";
import classNames from "classnames";
import { findNextInArray, findPreviousInArray } from "@/helper/array";
import { getAllHashTagsInText } from "@/helper/string";
import { InfoIcon } from "@/icons/InfoIcon";
import { isTouchScreen } from "@/helper/device";

export const TodoCreate = () => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [state, actions] = useAppState();
  useFocusInputOnKey(inputEl, "/");
  const direction = useRef<"Up" | "Down">("Down");
  const [transitioning, setTransitioning] = useState(false);
  const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    // We dont want any modifier pressed, if any just ignore any other key
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    if (e.key === "Enter") {
      // add an item when press enter
      const text = e.currentTarget.value;

      const hashTags = getAllHashTagsInText(text);
      actions.updateTagDictionary(state.todoLists[0].id, hashTags);

      actions.addTodo(
        {
          tags: hashTags,
          id: uuidv4(),
          position: 100,
          text,
          completedDate: null,
          frequency: state.todoLists[0].frequencySelected,
          children: [],
        },
        state.todoLists[0].id,
      );

      if (inputEl.current != null) {
        inputEl.current.value = "";
      }
    }
    // navigate the frequency on up and down
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      direction.current = "Down";
      setTransitioning(true);
      await new Promise((resolve) => {
        setTimeout(() => resolve(1), 200);
      });

      void actions.setNextFrequency();
      setTransitioning(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      direction.current = "Up";
      setTransitioning(true);
      await new Promise((resolve) => {
        setTimeout(() => resolve(1), 200);
      });
      actions.setPrevFrequency();
      setTransitioning(false);
    }
  };

  return (
    <span className="relative mx-3 lg:mx-0 print:hidden">
      <span
        className={classNames(
          "border-b-solid flex max-h-14 items-center gap-2 border-b-2 border-b-accent px-2",
          state.todoLists[0].frequencySelected === "Daily" &&
            "border-b-emerald-400 bg-emerald-400/5 focus:border-b-emerald-800",
          state.todoLists[0].frequencySelected === "Weekly" &&
            "border-b-red-400 bg-red-400/5 focus:border-b-red-800",
          state.todoLists[0].frequencySelected === "Monthly" &&
            "border-b-amber-400 bg-amber-400/5 focus:border-b-amber-800",
          state.todoLists[0].frequencySelected === "Yearly" &&
            "border-b-blue-400 bg-blue-400/5 focus:border-b-blue-800",
          state.todoLists[0].frequencySelected === "Once" &&
            "border-b-stone-400 bg-stone-400/5 focus:border-b-stone-800",
        )}
      >
        <input
          onKeyDown={handleInputKeydown}
          ref={inputEl}
          type="text"
          placeholder={
            isTouchScreen() ? "Write a task and tap Enter" : "Press / to focus"
          }
          className={classNames(
            " h-14 flex-grow rounded-none bg-transparent outline-none",
          )}
        />
        <FrequencyButton
          onSetNextFrequency={actions.setNextFrequency}
          inputEl={inputEl.current}
          frequencySelected={state.todoLists[0].frequencySelected}
          direction={direction.current}
          isPending={transitioning}
        />
      </span>
    </span>
  );
};

type FrequencyButtonProps = {
  onSetNextFrequency: () => void;
  direction: "Up" | "Down";
  inputEl: HTMLInputElement | null;
  isPending: boolean;
  frequencySelected: Frequency;
};

const FrequencyButton = ({
  direction,
  isPending,
  frequencySelected,
  onSetNextFrequency,
}: FrequencyButtonProps) => {
  const nextFrequency = findNextInArray(frequency, frequencySelected, {
    cycle: true,
  });

  const previousFrequency = findPreviousInArray(frequency, frequencySelected, {
    cycle: true,
  });

  const handleClickFrequency: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    onSetNextFrequency();
  };

  const handleFrequencyInfoActive: React.MouseEventHandler<
    HTMLButtonElement
  > = (e) => {
    e.stopPropagation();
    // opens a drawer with information about the frequency
  };

  return (
    <span className="flex flex-col items-end">
      <span
        key="next-frequency"
        className={classNames(
          "opacity-0",
          nextFrequency === "Daily" && "text-emerald-400",
          nextFrequency === "Weekly" && "text-red-400",
          nextFrequency === "Monthly" && "text-amber-400",
          nextFrequency === "Yearly" && "text-blue-400",
          nextFrequency === "Once" && "text-stone-400",
          isPending &&
            direction === "Down" &&
            "translate-y-full opacity-100 transition-all duration-200 ease-out",
        )}
      >
        <div className="flex items-center gap-1 lg:gap-2">
          {nextFrequency}
          <InfoIcon />
        </div>
      </span>

      <span
        key="current-frequency"
        className={classNames(
          frequencySelected === "Daily" && "text-emerald-400",
          frequencySelected === "Weekly" && "text-red-400",
          frequencySelected === "Monthly" && "text-amber-400",
          frequencySelected === "Yearly" && "text-blue-400",
          frequencySelected === "Once" && "text-stone-400",
          !isPending && "opacity-100",
          direction === "Up" &&
            isPending &&
            "-translate-y-full rotate-6 scale-75 opacity-0 transition-all duration-200 ease-in",
          direction === "Down" &&
            isPending &&
            "translate-y-full -rotate-6 scale-75 opacity-0 transition-all duration-200 ease-in",
        )}
      >
        <div className="flex items-center gap-1 lg:gap-2">
          <button onClick={handleClickFrequency} aria-label="Frequency">
            {frequencySelected}
          </button>

          <button
            className="text-xs"
            aria-label="Info"
            onClick={handleFrequencyInfoActive}
          >
            <InfoIcon />
          </button>
        </div>
      </span>

      <span
        key="prev-frequency"
        className={classNames(
          "opacity-0",
          previousFrequency === "Daily" && "text-emerald-400",
          previousFrequency === "Weekly" && "text-red-400",
          previousFrequency === "Monthly" && "text-amber-400",
          previousFrequency === "Yearly" && "text-blue-400",
          previousFrequency === "Once" && "text-stone-400",
          isPending &&
            direction === "Up" &&
            "-translate-y-full opacity-100 transition-all duration-200 ease-out",
        )}
      >
        <div className="flex items-center gap-1 lg:gap-2">
          {previousFrequency}
          <InfoIcon />
        </div>
      </span>
    </span>
  );
};
