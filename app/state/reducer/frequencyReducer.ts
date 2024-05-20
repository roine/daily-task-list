import { frequency, State } from "@/state/state";
import { findNextInArray, findPreviousInArray } from "@/helper/array";
import { BrowserStorage } from "@/storage/localstorage";

type NextFrequencyAction = {
  type: "SET_NEXT_FREQUENCY";
};

type PrevFrequencyAction = {
  type: "SET_PREV_FREQUENCY";
};

export type FrequencyAction = NextFrequencyAction | PrevFrequencyAction;

export const frequencyReducer = (
  state: State,
  action: FrequencyAction,
): State => {
  switch (action.type) {
    case "SET_NEXT_FREQUENCY":
      const nextFrequency = findNextInArray(
        frequency,
        state.todoLists[0].frequencySelected,
        { cycle: true },
      );
      if (nextFrequency != null) {
        return {
          ...state,
          todoLists: state.todoLists.map((todoList) => ({
            ...todoList,
            frequencySelected: nextFrequency,
          })),
        };
      }

      return state;

    case "SET_PREV_FREQUENCY":
      const prevFrequency = findPreviousInArray(
        frequency,
        state.todoLists[0].frequencySelected,
        { cycle: true },
      );
      if (prevFrequency != null) {
        return {
          ...state,
          todoLists: state.todoLists.map((todoList) => ({
            ...todoList,
            frequencySelected: prevFrequency,
          })),
        };
      }
      return state;
  }
};

export const getFrequencyActions = (
  dispatch: (props: FrequencyAction) => void,
  _loggedIn: boolean,
) => {
  return {
    setNextFrequency: () => dispatch({ type: "SET_NEXT_FREQUENCY" }),
    setPrevFrequency: () => dispatch({ type: "SET_PREV_FREQUENCY" }),
  };
};
