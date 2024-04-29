import { Todo } from "@/state/state";
import { v4 as uuidv4 } from "uuid";

const themeKey = "theme";
const todoStateKey = "todos";

type DataStructure = {
  todos: Todo[];
  title: string;
};

/**
 * Internal to help getting and storing
 */
const getData = (): [
  DataStructure | null,
  (dataPatch: Partial<DataStructure>) => void,
] => {
  const stored = localStorage.getItem(todoStateKey);
  const updateData =
    (stored: DataStructure | null) => (dataPatch: Partial<DataStructure>) => {
      localStorage.setItem(
        todoStateKey,
        JSON.stringify({ ...stored, ...dataPatch }),
      );
    };

  const withData = updateData(stored ? JSON.parse(stored) : null);

  if (stored) {
    return [JSON.parse(stored), withData];
  }
  return [null, withData];
};

export const addTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const [stored, updateData] = getData();
    let todos: Todo[] = stored ? stored.todos : [];
    const updatedTodos = [...todos, todo];
    updateData({ todos: updatedTodos });
    return todo;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (
  todoId: Todo["id"],
): Promise<{ deleted: boolean }> => {
  try {
    const [stored, updateData] = getData();
    let todos: Todo[] = stored ? stored.todos : [];
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    updateData({ todos: updatedTodos });
    return { deleted: true };
  } catch (error) {
    throw error;
  }
};

const todosForPresentation: Todo[] = [
  {
    id: uuidv4(),
    text: "Press `/` to focus the input",
    completedDate: null,
    recurrence: "daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Add a todo item with `Enter`",
    completedDate: null,
    recurrence: "daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Add another todo item with `Enter`",
    completedDate: null,
    recurrence: "daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Press `ESC` to unfocus (and access global shortcuts)",
    completedDate: null,
    recurrence: "daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Navigate the list with arrow up and down",
    completedDate: null,
    recurrence: "daily",
    children: [],
  },

  {
    id: uuidv4(),
    text: "Press `Enter` to complete a todo item",
    completedDate: new Date(),
    recurrence: "daily",
    children: [],
  },
];

export const getTodos = async (): Promise<DataStructure> => {
  try {
    const [stored, updateData] = getData();
    // if the store was never set, add default
    if (stored?.todos == null) {
      updateData({ todos: todosForPresentation });
    }
    let todos: Todo[] = stored?.todos ? stored.todos : todosForPresentation;
    let title = stored?.title ?? "Untitled";
    return { todos, title };
  } catch (e) {
    throw e;
  }
};

export const toggleCompletedTodo = async (
  id: Todo["id"],
): Promise<Todo["id"]> => {
  try {
    const [stored, updateData] = getData();
    let todos: Todo[] = stored ? stored.todos : [];

    const updatedTodos = todos.map((t) =>
      t.id === id
        ? { ...t, completedDate: t.completedDate == null ? new Date() : null }
        : t,
    );

    updateData({ todos: updatedTodos });
    return id;
  } catch (error) {
    throw error;
  }
};

export const updateTodolistTitle = async (title: string): Promise<string> => {
  try {
    const [_, updateData] = getData();
    updateData({ title });
    return title;
  } catch (error) {
    throw error;
  }
};
