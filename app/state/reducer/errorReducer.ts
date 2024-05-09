import { State } from "@/state/state";

type UpdateGlobalErrorAction = {
  type: "UPDATE_GLOBAL_ERROR";
  payload: string | null;
};

export type ErrorAction = UpdateGlobalErrorAction;
export const errorReducer = (state: State, action: ErrorAction): State => {
  switch (action.type) {
    case "UPDATE_GLOBAL_ERROR":
      return {
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          globalError: action.payload,
        })),
      };
  }
};

export const getErrorActions = (
  dispatch: (action: ErrorAction) => void,
  _loggedIn: boolean,
) => ({
  updateGlobalError: (error: string | null) => {
    dispatch({ type: "UPDATE_GLOBAL_ERROR", payload: error });
    setTimeout(() => {
      dispatch({ type: "UPDATE_GLOBAL_ERROR", payload: null });
    }, 10000);
  },
});
