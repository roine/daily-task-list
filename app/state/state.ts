import { v4 as uuidv4 } from "uuid";

export type Todo = {
  id: string;
  text: string;
  completedDate: Date | null;
  recurrence: "daily" | "weekly" | "monthly" | "once" | CustomRecurrence;
  children: Todo[];
};

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

export type CustomRecurrence = {
  _tag: "CustomRecurrence";
  frequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  every: number;
} & (
  | { frequency: "Weekly"; days: Day[] }
  | { frequency: "Monthly"; daysOfMonth: number[] }
  | { frequency: "Yearly"; months: Month[] }
);

export type State = {
  todoTitle: string;
  globalError: string | null;
  todos: Todo[];
};

export const initialState: State = {
  todoTitle: "Untitled",
  globalError: null,
  todos: [],
};
