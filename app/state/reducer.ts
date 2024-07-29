import { State } from "@/state/state";
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
import { DailyTaskListDB } from "@/storage/database/database";
import { getTodoActions, TodoAction } from "@/state/actions/todoActions";
import { todoReducer } from "@/state/reducer/todoReducer";
import { DBStatus } from "@/storage/database/DatabaseProvider";

const Frequency = Symbol();
const Todo = Symbol();
const Err = Symbol();

export type Action =
  | { _tag: typeof Todo; action: TodoAction }
  | { _tag: typeof Err; action: ErrorAction }
  | { _tag: typeof Frequency; action: FrequencyAction };

export const getReducer =
  (db: DBStatus) =>
  (state: State, action: Action): State => {
    switch (action._tag) {
      case Todo:
        return todoReducer(db)(state, action.action);
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
    ...getTodoActions((action: TodoAction) => dispatch({ action, _tag: Todo })),
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
