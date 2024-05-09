import { v4 as uuidv4 } from "uuid";

export const frequency = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Once",
] as const;

export type Frequency = (typeof frequency)[number];

export type Todo = {
  id: string;
  text: string;
  completedDate: Date | null;
  frequency: Frequency;
  position: number;
  children: Todo[];
};

export type TodoListState = {
  id: string;
  todoTitle: string;
  position: number;
  globalError: string | null;
  frequencySelected: Frequency;
  todos: Todo[];
};

export type State = {
  todoLists: TodoListState[];
};

export const initialState: State = {
  todoLists: [
    {
      id: uuidv4(),
      frequencySelected: "Daily",
      position: 0,
      todoTitle: "",
      globalError: null,
      todos: [],
    },
  ],
};
