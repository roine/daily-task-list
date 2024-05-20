import { State, Todo, TodoListState } from "@/state/state";
import { BrowserStorage } from "@/storage/localstorage";
import { RemoteStorage } from "@/storage/remoteStorage";

type AddTodosAction = {
  type: "ADD_TODOS";
  payload: { todos: Todo[] };
};

type AddTodoAction = {
  type: "ADD_TODO";
  payload: { todo: Todo };
};

type ToggleCompleted = {
  type: "TOGGLE_COMPLETED";
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

type setListAction = {
  type: "SET_LIST";
  payload: { data: Pick<TodoListState, "id" | "todoTitle" | "position"> };
};

// takes a state and apply it to our app state
type resetStateAction = {
  type: "RESET_STATE";
  payload: { state: State };
};

export type TodoAction =
  | AddTodosAction
  | AddTodoAction
  | ToggleCompleted
  | DeleteTodoAction
  | ChangeTodoTitleAction
  | setListAction
  | resetStateAction;

export const todoReducer = (state: State, action: TodoAction): State => {
  console.log(action);
  switch (action.type) {
    case "ADD_TODOS":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: action.payload.todos,
        })),
      };

    case "ADD_TODO":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: [...todoList.todos, action.payload.todo],
        })),
      };

    case "TOGGLE_COMPLETED":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: todoList.todos.map((todo) =>
            todo.id === action.payload.id
              ? {
                  ...todo,
                  completedDate: todo.completedDate == null ? new Date() : null,
                }
              : todo,
          ),
        })),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: todoList.todos.filter((todo) => todo.id !== action.payload.id),
        })),
      };

    case "CHANGE_TODO_TITLE":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todoTitle: action.payload.title,
        })),
      };

    case "SET_LIST":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          id: action.payload.data.id,
          todoTitle: action.payload.data.todoTitle,
          position: action.payload.data.position,
        })),
      };

    case "RESET_STATE":
      return action.payload.state;
  }
};

export const getTodoActions = (
  dispatch: (action: TodoAction) => void,
  loggedIn: boolean,
) => ({
  resetState: (state: State) => {
    dispatch({ type: "RESET_STATE", payload: { state } });
  },

  addTodo: (todo: Todo, listId: string) => {
    dispatch({ type: "ADD_TODO", payload: { todo } });
    loggedIn && RemoteStorage.addTodo(todo, listId).then(console.log);
  },

  toggleCompleted: (id: Todo["id"]) => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: { id } });
  },

  deleteTodo: (id: Todo["id"]) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  },

  changeTodoTitle: (title: string) => {
    dispatch({ type: "CHANGE_TODO_TITLE", payload: { title } });
  },
});
