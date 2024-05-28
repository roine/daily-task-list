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

type Action =
  | { _tag: "Todo"; action: TodoAction }
  | { _tag: "Error"; action: ErrorAction }
  | { _tag: "Frequency"; action: FrequencyAction };

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action._tag) {
    case "Todo":
      return todoReducer(state, action.action);
    case "Error":
      return errorReducer(state, action.action);
    case "Frequency":
      return frequencyReducer(state, action.action);
    default:
      return state;
  }
};

export const getActions = (dispatch: (props: Action) => void) => {
  return {
    ...getTodoActions((action: TodoAction) =>
      dispatch({ action, _tag: "Todo" }),
    ),
    ...getErrorActions((action: ErrorAction) =>
      dispatch({ action, _tag: "Error" }),
    ),
    ...getFrequencyActions((action: FrequencyAction) =>
      dispatch({ action, _tag: "Frequency" }),
    ),
  };
};
