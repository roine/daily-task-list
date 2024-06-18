import { v4 as uuidv4 } from "uuid";

export const frequency = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Once",
] as const;

export type Frequency = (typeof frequency)[number];

export type Tag = {
  text: string;
  color: string;
};

export type Todo = {
  id: string;
  text: string;
  completedDate: Date | null;
  frequency: Frequency;
  position: number;
  children: Todo[];
  tags: string[];
};

export type TodoListState = {
  id: string;
  title: string;
  position: number;
  globalError: string | null;
  frequencySelected: Frequency;
  todos: Todo[];
  tags: Record<string, { color: string }> | null;
  // Used for tag filtering
  filterBy: string | null;
};

export type State = {
  todoLists: TodoListState[];
  lastReset: Date | null;
};

export const initialState: State = {
  lastReset: null,
  todoLists: [
    {
      tags: null,
      id: uuidv4(),
      frequencySelected: "Daily",
      position: 0,
      title: "",
      globalError: null,
      todos: [],
      filterBy: null,
    },
  ],
};
