import { State, Todo, TodoListState } from "@/state/state";
import { v4 as uuidv4 } from "uuid";
import { initialTodoLists } from "@/storage/database/collections/todo_lists";
import { dbToStateMapper } from "@/storage/database/DBToStateMapper";
import { initialTodosTags } from "@/storage/database/collections/todos_tags";
import { initialTags } from "@/storage/database/collections/tags";
import { initialTodos } from "@/storage/database/collections/todos";

const todoStateKey = "dtl-state";

const sandboxKey = "dtl-sandbox";

type DataStructure = State;

export namespace BrowserStorage {
  /**
   * Internal - get and update data in local storage.
   */
  const getData = (
    key: string,
  ): [DataStructure | null, (dataPatch: Partial<DataStructure>) => void] => {
    // Get the stored data from local storage
    const stored = localStorage.getItem(key);
    // Parse the stored data if it exists
    const parsedStored = stored ? JSON.parse(stored) : null;

    /**
     * A function to update the stored data.
     *
     * @param dataPatch - The data to be merged with the stored data.
     */
    const updateData = (dataPatch: Partial<DataStructure>) => {
      // Merge the data patch with the stored data and update the local storage
      localStorage.setItem(
        key,
        JSON.stringify({ ...parsedStored, ...dataPatch }),
      );
    };

    // Return the parsed stored data and the update function
    return [parsedStored, updateData];
  };

  /**
   * Always returns a state object, if it doesn't exist create it, otherwise return it
   */
  export const getState = ({
    useSandbox,
  }: {
    useSandbox: boolean;
  }): DataStructure => {
    const [stored, updateData] = getData(
      useSandbox ? sandboxKey : todoStateKey,
    );

    let defaultTodoLists = (() => {
      if (useSandbox) {
        return todoListForPresentation.todoLists;
      } else {
        return dbToStateMapper({
          todoLists: initialTodoLists,
          todos: initialTodos,
          todosTags: initialTodosTags,
          tags: initialTags,
        }).todoLists;
      }
    })();

    const todoLists: TodoListState[] = stored?.todoLists ?? defaultTodoLists;

    if (!stored?.todoLists) {
      updateData({ todoLists: todoLists });
    }

    return { todoLists, lastReset: stored?.lastReset ?? null };
  };

  export const setState = (
    {
      useSandbox,
    }: {
      useSandbox: boolean;
    },
    state: DataStructure,
  ): void => {
    const [_, updateData] = getData(useSandbox ? sandboxKey : todoStateKey);
    updateData(state);
  };
}

const initialTodosForPresentation: Todo[] = [
  {
    id: uuidv4(),
    text: "Press `/` to focus the input #tutorial",
    completedDate: null,
    frequency: "Daily",
    position: 0,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Add a todo item with `Enter` #tutorial",
    completedDate: null,
    frequency: "Daily",
    position: 1,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Add another todo item with `Enter` #tutorial",
    completedDate: null,
    frequency: "Daily",
    position: 2,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Press `ESC` to unfocus (and access global shortcuts) #tutorial",
    completedDate: null,
    frequency: "Daily",
    position: 3,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Navigate the list with arrow up and down #tutorial",
    completedDate: null,
    frequency: "Daily",
    position: 4,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Press `Enter` to complete a todo item #tutorial",
    completedDate: new Date().toISOString(),
    frequency: "Daily",
    position: 5,
    children: [],
    tags: ["#tutorial"],
  },
  {
    id: uuidv4(),
    text: "Create a new todo #tutorial",
    completedDate: null,
    frequency: "Weekly",
    position: 6,
    children: [],
    tags: ["#tutorial"],
  },
];

const todoListForPresentation: DataStructure = {
  lastReset: null,
  todoLists: [
    {
      title: "Untitled",
      frequencySelected: "Daily",
      id: uuidv4(),
      position: 0,
      todos: initialTodosForPresentation,
      tags: null,
      globalError: null,
      filterBy: null,
    },
  ],
};
