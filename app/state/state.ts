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
  children: Todo[];
};

export type State = {
  todoTitle: string;
  globalError: string | null;
  frequencySelected: Frequency;
  todos: Todo[];
};

export const initialState: State = {
  frequencySelected: "Daily",
  todoTitle: "Untitled",
  globalError: null,
  todos: [],
};
