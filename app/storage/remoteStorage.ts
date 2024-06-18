import { Todo, TodoListState } from "@/state/state";

export namespace RemoteStorage {
  export type TodoListState = {
    id: string;
    todos: Todo[];
    title: string;
    position: number;
  };
  export const addTodo = async (todo: Todo, listId: string) => {
    return fetch(`/api/lists/${listId}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
    }).then((res) => res.json());
  };

  export const synchroniseWithStorage = async (todoLists: TodoListState[]) => {
    return fetch(`/api/lists/synchronise`, {
      credentials: "include",
      body: JSON.stringify({ todoLists }),
      method: "POST",
    });
  };
}
