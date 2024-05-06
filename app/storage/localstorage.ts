import { Todo } from "@/state/state";
import { v4 as uuidv4 } from "uuid";

const todoStateKey = "todos";

type TodoList = { todos: Todo[]; title: string };

type DataStructure = {
  todoLists: TodoList[];
};

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

export const addTodo = async (todo: Todo): Promise<Todo> => {
  const [stored, updateData] = getData();
  const todoLists: TodoList[] = stored?.todoLists ?? [];
  const updatedTodos = [...todoLists[0].todos, todo];
  updateData({
    todoLists: todoLists.map((tl) => ({ ...tl, todos: updatedTodos })),
  });
  return todo;
};

export const deleteTodo = async (
  todoId: Todo["id"],
): Promise<{ deleted: boolean }> => {
  const [stored, updateData] = getData();
  const todoLists: TodoList[] = stored?.todoLists ?? [];
  const updatedTodos = todoLists[0].todos.filter((todo) => todo.id !== todoId);
  updateData({
    todoLists: todoLists.map((tl) => ({ ...tl, todos: updatedTodos })),
  });
  return { deleted: true };
};

const todosForPresentation: Todo[] = [
  {
    id: uuidv4(),
    text: "Press `/` to focus the input",
    completedDate: null,
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Add a todo item with `Enter`",
    completedDate: null,
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Add another todo item with `Enter`",
    completedDate: null,
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Press `ESC` to unfocus (and access global shortcuts)",
    completedDate: null,
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Navigate the list with arrow up and down",
    completedDate: null,
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Press `Enter` to complete a todo item",
    completedDate: new Date(),
    frequency: "Daily",
    children: [],
  },
  {
    id: uuidv4(),
    text: "Create a new todo",
    completedDate: null,
    frequency: "Weekly",
    children: [],
  },
];

const todoListForPresentation: DataStructure = {
  todoLists: [{ title: "Untitled", todos: todosForPresentation }],
};

export const getTodos = async (): Promise<DataStructure> => {
  const [stored, updateData] = getData();
  const todoLists: TodoList[] =
    stored?.todoLists ?? todoListForPresentation.todoLists;
  if (!stored?.todoLists) {
    updateData({ todoLists: todoLists });
  }

  return { todoLists };
};

export const toggleCompletedTodo = async (
  id: Todo["id"],
): Promise<Todo["id"]> => {
  const [stored, updateData] = getData();
  const todoLists: TodoList[] = stored ? stored.todoLists : [];

  const updatedTodos = todoLists[0].todos.map((t) =>
    t.id === id
      ? { ...t, completedDate: t.completedDate == null ? new Date() : null }
      : t,
  );

  updateData({
    todoLists: todoLists.map((tl) => ({ ...tl, todos: updatedTodos })),
  });
  return id;
};

export const updateTodolistTitle = async (title: string): Promise<string> => {
  const [stored, updateData] = getData();
  const todoLists: TodoList[] = stored ? stored.todoLists : [];

  updateData({
    todoLists: todoLists.map((tl) => ({ ...tl, title })),
  });
  return title;
};
