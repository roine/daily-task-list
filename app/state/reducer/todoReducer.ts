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

type setListAction = {
  type: "SET_LIST";
  payload: { data: Pick<TodoListState, "id" | "todoTitle" | "position"> };
};

export type TodoAction =
  | AddTodosAction
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | ChangeTodoTitleAction
  | setListAction;

export const todoReducer = (state: State, action: TodoAction): State => {
  console.log(action);
  switch (action.type) {
    case "ADD_TODOS":
      return {
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: action.payload.todos,
        })),
      };

    case "ADD_TODO":
      return {
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: [...todoList.todos, action.payload.todo],
        })),
      };

    case "TOGGLE_COMPLETED_TODO":
      return {
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
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: todoList.todos.filter((todo) => todo.id !== action.payload.id),
        })),
      };

    case "CHANGE_TODO_TITLE":
      return {
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todoTitle: action.payload.title,
        })),
      };

    case "SET_LIST":
      return {
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          id: action.payload.data.id,
          todoTitle: action.payload.data.todoTitle,
          position: action.payload.data.position,
        })),
      };
  }
};

export const getTodoActions = (
  dispatch: (action: TodoAction) => void,
  loggedIn: boolean,
) => ({
  loadLocallyStoredTodos: async () => {
    const { todoLists } = BrowserStorage.getTodos();
    dispatch({ type: "ADD_TODOS", payload: { todos: todoLists[0].todos } });
    dispatch({
      type: "SET_LIST",
      payload: {
        data: {
          id: todoLists[0].id,
          todoTitle: todoLists[0].title,
          position: todoLists[0].position,
        },
      },
    });
  },

  addTodo: (todo: Todo, listId: string) => {
    dispatch({ type: "ADD_TODO", payload: { todo } });
    BrowserStorage.addTodo(todo);
    loggedIn && RemoteStorage.addTodo(todo, listId).then(console.log);
  },

  toggleCompletedTodo: (id: Todo["id"]) => {
    dispatch({ type: "TOGGLE_COMPLETED_TODO", payload: { id } });
    BrowserStorage.toggleCompletedTodo(id);
  },

  deleteTodo: (
    id: Todo["id"],
  ): ReturnType<typeof BrowserStorage.deleteTodo> => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
    return BrowserStorage.deleteTodo(id);
  },

  changeTodoTitle: (title: string) => {
    dispatch({ type: "CHANGE_TODO_TITLE", payload: { title } });
    BrowserStorage.updateTodolistTitle(title);
  },
});
