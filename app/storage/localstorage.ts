import { State, Todo, TodoListState } from "@/state/state";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import { getColor } from "@/state/reducer/todoReducer";

const todoStateKey = "todos";

type DataStructure = State;

export namespace BrowserStorage {
  /**
   * Internal - get and update data in local storage.
   */
  const getData = (): [
    DataStructure | null,
    (dataPatch: Partial<DataStructure>) => void,
  ] => {
    // Get the stored data from local storage
    const stored = localStorage.getItem(todoStateKey);
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
        todoStateKey,
        JSON.stringify({ ...parsedStored, ...dataPatch }),
      );
    };

    // Return the parsed stored data and the update function
    return [parsedStored, updateData];
  };

  export const getState = (): DataStructure => {
    const [stored, updateData] = getData();
    const todoLists: TodoListState[] =
      stored?.todoLists ?? todoListForPresentation.todoLists;
    if (!stored?.todoLists) {
      updateData({ todoLists: todoLists });
    }

    return { todoLists, lastReset: stored?.lastReset ?? null };
  };

  export const setState = (state: DataStructure): void => {
    const [_, updateData] = getData();
    updateData(state);
  };
}

const todosForPresentation: Todo[] = [
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
    completedDate: new Date(),
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
      id: uuidv4(),
      frequencySelected: "Daily",
      position: 0,
      todoTitle: "Untitled",
      globalError: null,
      todos: todosForPresentation,
      tags: { "#tutorial": { color: getColor() } },
      filterBy: null,
    },
  ],
};

// Add in-memory state in local store on change and vice-versa
export const useLocalStorageSync = (
  state: State,
  { onStorageChange }: { onStorageChange: (state: State) => void },
) => {
  useEffect(() => {
    BrowserStorage.setState(state);
  }, [state]);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === "todos") {
        void onStorageChange(BrowserStorage.getState());
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);
};
