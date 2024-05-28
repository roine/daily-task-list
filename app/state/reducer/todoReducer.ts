import { initialState, State, Todo } from "@/state/state";
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleCompletedTodo,
  updateTodolistTitle,
} from "@/storage/localstorage";

type AddTodosAction = {
  type: "ADD_TODOS";
  payload: { todos: Todo[] };
};

type AddTodoAction = {
  type: "ADD_TODO";
  payload: { todo: Todo };
};

type ToggleTodoAction = {
  type: "TOGGLE_COMPLETED_TODO";
  payload: { id: Todo["id"] };
};

type DeleteTodoAction = {
  type: "DELETE_TODO";
  payload: { id: Todo["id"] };
};

type ChangeTodoTitleAction = {
  type: "CHANGE_TODO_TITLE";
  payload: { title: string };
};

export type TodoAction =
  | AddTodosAction
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | ChangeTodoTitleAction;

export const todoReducer = (state: State, action: TodoAction) => {
  switch (action.type) {
    case "ADD_TODOS":
      return {
        ...state,
        todos: action.payload.todos,
      };

    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload.todo],
      };

    case "TOGGLE_COMPLETED_TODO":
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
        todoTitle: action.payload.title,
      };
  }
};

export const getTodoActions = (dispatch: (action: TodoAction) => void) => ({
  getTodos: async () => {
    return getTodos()
      .then(({ todos, title }) => {
        dispatch({ type: "ADD_TODOS", payload: { todos } });
        dispatch({ type: "CHANGE_TODO_TITLE", payload: { title } });
      })
      .catch(() => {
        // nothing for now
      });
  },

  addTodo: (todo: Todo) => {
    dispatch({ type: "ADD_TODO", payload: { todo } });

    addTodo(todo).catch(() => {
      dispatch({ type: "DELETE_TODO", payload: { id: todo.id } });
      // getErrorActions(dispatch).updateGlobalError(
      //   "Something went wrong. Could not add todo",
      // );
    });
  },

  toggleCompletedTodo: (id: Todo["id"]) => {
    dispatch({ type: "TOGGLE_COMPLETED_TODO", payload: { id } });
    toggleCompletedTodo(id).catch(() => {
      dispatch({ type: "TOGGLE_COMPLETED_TODO", payload: { id: id } });
      // getErrorActions(dispatch).updateGlobalError(
      //   "Something went wrong. Could not add todo",
      // );
    });
  },

  deleteTodo: (id: Todo["id"]): ReturnType<typeof deleteTodo> => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
    return deleteTodo(id);
  },

  changeTodoTitle: (title: string) => {
    dispatch({ type: "CHANGE_TODO_TITLE", payload: { title } });
    updateTodolistTitle(title).catch(() => {
      // @todo
      dispatch({ type: "CHANGE_TODO_TITLE", payload: { title: "Untitled" } });
    });
  },
});
