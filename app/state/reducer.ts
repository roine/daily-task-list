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

type Action =
  | { _tag: "Todo"; action: TodoAction }
  | { _tag: "Error"; action: ErrorAction };

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action._tag) {
    case "Todo":
      return todoReducer(state, action.action);
    case "Error":
      return errorReducer(state, action.action);
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
  };
};
