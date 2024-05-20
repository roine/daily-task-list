import { initialState, State } from "@/state/state";
import {
  TodoAction,
  todoReducer,
  getTodoActions,
} from "@/state/reducer/todoReducer";
import {
  ErrorAction,
  errorReducer,
  getErrorActions,
} from "@/state/reducer/errorReducer";
import {
  FrequencyAction,
  frequencyReducer,
  getFrequencyActions,
} from "@/state/reducer/frequencyReducer";

const Frequency = Symbol();
const Todo = Symbol();
const Err = Symbol();

export type Action =
  | { _tag: typeof Todo; action: TodoAction }
  | { _tag: typeof Err; action: ErrorAction }
  | { _tag: typeof Frequency; action: FrequencyAction };

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action._tag) {
    case Todo:
      return todoReducer(state, action.action);
    case Err:
      return errorReducer(state, action.action);
    case Frequency:
      return frequencyReducer(state, action.action);
    default:
      return state;
  }
};

export const getActions = (
  dispatch: (props: Action) => void,
  loggedIn: boolean,
) => {
  return {
    ...getTodoActions(
      (action: TodoAction) => dispatch({ action, _tag: Todo }),
      loggedIn,
    ),
    ...getErrorActions(
      (action: ErrorAction) => dispatch({ action, _tag: Err }),
      loggedIn,
    ),
    ...getFrequencyActions(
      (action: FrequencyAction) => dispatch({ action, _tag: Frequency }),
      loggedIn,
    ),
  };
};

export type Actions = ReturnType<typeof getActions>;
