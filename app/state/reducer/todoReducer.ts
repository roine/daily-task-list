import { State, Todo, TodoListState } from "@/state/state";
import { getColor, Zip } from "@/helper/zip";
import { TodoAction } from "@/state/actions/todoActions";
import { reducer as RXDBReducer } from "@/state/RXDBReducer/todoReducer";
import { DailyTaskListDB } from "@/storage/database/database";
import { DBStatus } from "@/storage/database/DatabaseProvider";
import { BrowserStorage } from "@/storage/localstorage";

export const reducer = (state: State, action: TodoAction): State => {
  console.log(action);
  switch (action.type) {
    case "ADD_TODOS":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => {
          if (todoList.id === action.payload.listId) {
            return {
              ...todoList,
              todos: action.payload.todos,
            };
          }
          return todoList;
        }),
      };

    case "ADD_TODO":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => {
          if (todoList.id === action.payload.listId) {
            return {
              ...todoList,
              todos: [...todoList.todos, action.payload.todo],
            };
          }
          return todoList;
        }),
      };
    case "EDIT_TODO":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          todos: todoList.todos.map((todo) =>
            todo.id === action.payload.todo.id ? action.payload.todo : todo,
          ),
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
                  completedDate:
                    todo.completedDate == null
                      ? new Date().toISOString()
                      : null,
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
          todos:
            todoList.id === action.payload.listId
              ? todoList.todos.filter(
                  (todo) => todo.id !== action.payload.todoId,
                )
              : todoList.todos,
        })),
      };

    case "CHANGE_TODOLIST_TITLE":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => {
          if (todoList.id === action.payload.todoListId) {
            return {
              ...todoList,
              title: action.payload.title,
            };
          }
          return todoList;
        }),
      };

    case "SET_LIST":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          id: action.payload.data.id,
          title: action.payload.data.title,
          position: action.payload.data.position,
        })),
      };

    case "UPDATE_TAGS":
      if (action.payload.tags.length === 0) {
        return state;
      }
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => {
          if (todoList.id !== action.payload.listId) {
            return todoList;
          }
          const existingTagDict = todoList.tags;
          let newOrExistingTags = action.payload.tags;

          if (existingTagDict) {
            newOrExistingTags = action.payload.tags.filter(
              (tag) => !existingTagDict[tag],
            );
          }

          const newTagsDict = newOrExistingTags.reduce(
            (acc, tag) => {
              acc[tag] = {
                color: getColor(),
              };
              return acc;
            },
            {} as Record<string, { color: string }>,
          );
          return {
            ...todoList,
            tags: { ...existingTagDict, ...newTagsDict },
          };
        }),
      };

    case "SET_FILTER":
      return {
        ...state,
        todoLists: state.todoLists.map((todoList) => ({
          ...todoList,
          filterBy: action.payload.filter,
        })),
      };

    case "RESET_STATE":
      return action.payload.state;
  }
};

/**
 * After the reducing the state if we are logged in we will sync the state with the remote db
 * Otherwise we save the data in the local storage
 */
export const todoReducer =
  (db: DBStatus) =>
  (state: State, action: TodoAction): State => {
    const newState = reducer(state, action);

    try {
      if (db !== "initial" && db != "loggedOut") {
        void RXDBReducer(db)({ oldState: state, newState }, action);
      } else if (db === "loggedOut") {
        BrowserStorage.setState({ useSandbox: true }, newState);
      }
    } catch (e) {
      console.error("synchronisation with RXDB failed", e);
    }

    return newState;
  };
