import { Todo } from "@/state/state";

export namespace RemoteStorage {
  export const addTodo = async (todo: Todo, listId: string) => {
    return fetch(`/api/lists/${listId}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
    }).then((res) => res.json());
  };
}
