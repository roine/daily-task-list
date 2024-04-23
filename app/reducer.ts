import { initialState, State, Todo } from "@/state";

type AddTodoAction = {
  type: "ADD_TODO";
  payload: Todo;
};

type ToggleTodoAction = {
  type: "TOGGLE_TODO";
  payload: { id: Todo["id"] };
};

type DeleteTodoAction = {
  type: "DELETE_TODO";
  payload: { id: Todo["id"] };
};

type ChangeTodoTitleAction = {
  type: "CHANGE_TODO_TITLE";
  payload: string;
};

type Action =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | ChangeTodoTitleAction;

export const todoReducer = (state: State = initialState, action: Action) => {
  console.log(state, action.type);
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                completedDate: todo.completedDate == null ? new Date() : null,
              }
            : todo,
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };

    case "CHANGE_TODO_TITLE":
      return {
        ...state,
        todoTitle: action.payload,
      };
    default:
      return state;
  }
};

export const getActions = (dispatch: (action: Action) => void) => ({
  addTodo: (todo: Todo) => dispatch({ type: "ADD_TODO", payload: todo }),
  toggleTodo: (id: Todo["id"]) =>
    dispatch({ type: "TOGGLE_TODO", payload: { id } }),
  deleteTodo: (id: Todo["id"]) =>
    dispatch({ type: "DELETE_TODO", payload: { id } }),
  changeTodoTitle: (title: string) =>
    dispatch({ type: "CHANGE_TODO_TITLE", payload: title }),
});
