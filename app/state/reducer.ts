import { initialState, State, Todo } from "@/state/state";
import { addTodo, getTodos } from "@/storage/localstorage";

type AddTodosAction = {
  type: "ADD_TODOS";
  payload: { todos: Todo[] };
};

type AddTodoAction = {
  type: "ADD_TODO";
  payload: { todo: Todo };
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

type UpdateGlobalErrorAction = {
  type: "UPDATE_GLOBAL_ERROR";
  payload: string | null;
};

type Action =
  | AddTodosAction
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | ChangeTodoTitleAction
  | UpdateGlobalErrorAction;

export const todoReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "ADD_TODOS":
      return {
        ...state,
        todos: action.payload.todos,
      };

    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload.todo, ...state.todos],
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

    case "UPDATE_GLOBAL_ERROR":
      return {
        ...state,
        globalError: action.payload,
      };

    default:
      return state;
  }
};

export const getActions = (dispatch: (action: Action) => void) => ({
  getTodos: () => {
    getTodos()
      .then((todos) => {
        dispatch({ type: "ADD_TODOS", payload: { todos } });
      })
      .catch(() => {
        // nothing for now
      });
  },

  addTodo: (todo: Todo) => {
    dispatch({ type: "ADD_TODO", payload: { todo } });

    addTodo(todo).catch(() => {
      dispatch({ type: "DELETE_TODO", payload: { id: todo.id } });
      getActions(dispatch).updateGlobalError(
        "Something went wrong. Could not add todo",
      );
    });
  },

  toggleTodo: (id: Todo["id"]) =>
    dispatch({ type: "TOGGLE_TODO", payload: { id } }),

  deleteTodo: (id: Todo["id"]) =>
    dispatch({ type: "DELETE_TODO", payload: { id } }),

  changeTodoTitle: (title: string) =>
    dispatch({ type: "CHANGE_TODO_TITLE", payload: title }),

  updateGlobalError: (error: string | null) => {
    dispatch({ type: "UPDATE_GLOBAL_ERROR", payload: error });
    setTimeout(() => {
      dispatch({ type: "UPDATE_GLOBAL_ERROR", payload: null });
    }, 10000);
  },
});
