import { Todo } from "@/state/state";

const themeKey = "theme";
const todoStateKey = "todos";

export const addTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const stored = localStorage.getItem(todoStateKey);
    let todos = stored ? JSON.parse(stored).todos : [];
    const updatedTodos = [todo, ...todos];
    localStorage.setItem(todoStateKey, JSON.stringify({ todos: updatedTodos }));
    return todo;
  } catch (error) {
    throw error;
  }
};

export const getTodos = async (): Promise<Todo[]> => {
  const stored = localStorage.getItem(todoStateKey);
  try {
    if (stored) {
      const result = JSON.parse(stored);
      return result.todos;
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

const markTodoAsCompleted = (todo: Todo) => {};

const updateTodolistTitle = (todolistId: string) => {};
