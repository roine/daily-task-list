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
import { getAllHashTagText } from "@/helper/string";
import { InfoIcon } from "@/icons/InfoIcon";

export const TodoCreate = () => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [state, actions] = useAppState();
  useFocusInputOnKey(inputEl, "/");
  const direction = useRef<"Up" | "Down">("Down");
  const [transitioning, setTransitioning] = useState(false);
  const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    // add an item when press enter
    if (e.key === "Enter") {
      const text = e.currentTarget.value;

      // preprocess the text
      const hashTags = getAllHashTagText(text);
      actions.updateTagDictionary(hashTags);

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
      actions.setNextFrequency();
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
    <span className="print:hidden relative">
      <input
        onKeyDown={handleInputKeydown}
        ref={inputEl}
        type="text"
        placeholder="Press / to focus"
        className={classNames(
          "flex-grow rounded-none w-full p-2 lg:p-4 outline-none border-b-2 border-b-solid border-b-accent",
          "px-4",
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
      <FrequencyButton
        onSetNextFrequency={actions.setNextFrequency}
        inputEl={inputEl.current}
        frequencySelected={state.todoLists[0].frequencySelected}
        direction={direction.current}
        isPending={transitioning}
      ></FrequencyButton>
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
    <span className="absolute flex flex-col top-2/4 right-2 lg:right-4 -translate-y-1/2 items-end">
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
        <div className="flex items-center gap-2">
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
            "-translate-y-full opacity-0 transition-all duration-200 ease-in rotate-6 scale-75",
          direction === "Down" &&
            isPending &&
            "translate-y-full opacity-0 transition-all duration-200 ease-in -rotate-6 scale-75",
        )}
      >
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          {previousFrequency}
          <InfoIcon />
        </div>
      </span>
    </span>
  );
};
