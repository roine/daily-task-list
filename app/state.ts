export type Todo = {
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
  todos: Todo[];
};

export const initialState: State = {
  todoTitle: "Untitled",
  todos: [
    {
      completedDate: null,
      text: "read up to 5 job emails",
      recurrence: "daily",
      children: [],
    },
    {
      completedDate: null,
      text: "build a multi agent chain",
      recurrence: "daily",
      children: [],
    },
    {
      completedDate: null,
      text: "Add tests to IAG",
      recurrence: "daily",
      children: [],
    },
    {
      completedDate: new Date(),
      text: "Work on daily tasklist",
      recurrence: "daily",
      children: [],
    },
  ],
};
