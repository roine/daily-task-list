import { Todo } from "@/state/state";

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

export const getTodos = async (): Promise<DataStructure> => {
  try {
    const [stored] = getData();
    let todos: Todo[] = stored ? stored.todos : [];
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
    console.log("called");
    updateData({ title });
    return title;
  } catch (error) {
    throw error;
  }
};
