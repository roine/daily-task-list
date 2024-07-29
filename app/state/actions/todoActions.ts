import { State, Todo, TodoListState } from "@/state/state";

type AddTodosAction = {
  type: "ADD_TODOS";
  payload: { todos: Todo[]; listId: TodoListState["id"] };
};

type AddTodoAction = {
  type: "ADD_TODO";
  payload: {
    todo: Todo;
    listId: TodoListState["id"];
  };
};

type EditTodoAction = {
  type: "EDIT_TODO";
  payload: { todo: Todo; listId: TodoListState["id"] };
};

type ToggleCompleted = {
  type: "TOGGLE_COMPLETED";
  payload: { id: Todo["id"] };
};

type DeleteTodoAction = {
  type: "DELETE_TODO";
  payload: { todoId: Todo["id"]; listId: TodoListState["id"] };
};

type ChangeTodoTitleAction = {
  type: "CHANGE_TODOLIST_TITLE";
  payload: { todoListId: TodoListState["id"]; title: string };
};

type setListAction = {
  type: "SET_LIST";
  payload: { data: Pick<TodoListState, "id" | "title" | "position"> };
};

type updateTagsAction = {
  type: "UPDATE_TAGS";
  payload: { tags: string[]; listId: string };
};

type setFilterAction = {
  type: "SET_FILTER";
  payload: { filter: string | null };
};

// takes a state and apply it to our app state
type resetStateAction = {
  type: "RESET_STATE";
  payload: { state: State };
};

export type TodoAction =
  | AddTodosAction
  | AddTodoAction
  | EditTodoAction
  | ToggleCompleted
  | DeleteTodoAction
  | ChangeTodoTitleAction
  | setListAction
  | updateTagsAction
  | setFilterAction
  | resetStateAction;

export const getTodoActions = (dispatch: (action: TodoAction) => void) => ({
  resetState: (state: State) => {
    dispatch({ type: "RESET_STATE", payload: { state } });
  },

  addTodo: (todo: Todo, listId: string) => {
    dispatch({ type: "ADD_TODO", payload: { todo, listId } });
  },

  editTodo: (todo: Todo, listId: string) => {
    dispatch({ type: "EDIT_TODO", payload: { todo, listId } });
  },

  toggleCompleted: (id: Todo["id"]) => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: { id } });
  },

  deleteTodo: (todoId: Todo["id"], listId: TodoListState["id"]) => {
    dispatch({ type: "DELETE_TODO", payload: { todoId, listId } });
  },

  changeTodoTitle: (todoListId: string, title: string) => {
    dispatch({ type: "CHANGE_TODOLIST_TITLE", payload: { todoListId, title } });
  },

  updateTagDictionary: (listId: string, tags: string[]) => {
    dispatch({ type: "UPDATE_TAGS", payload: { tags, listId } });
  },

  setFilter: (filter: string) => {
    dispatch({ type: "SET_FILTER", payload: { filter } });
  },

  clearFilter: () => {
    dispatch({ type: "SET_FILTER", payload: { filter: null } });
  },
});
