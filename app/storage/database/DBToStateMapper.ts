import { DailyTaskListDB } from "@/storage/database/database";
import { State, TodoListState } from "@/state/state";
import { TodoDB } from "@/storage/database/collections/todos";
import { TagDB } from "@/storage/database/collections/tags";
import { TodosTagsDB } from "@/storage/database/collections/todos_tags";
import { TodoListDB } from "@/storage/database/collections/todo_lists";
import { RxDocument } from "rxdb";

/**
 * Get all the data from the indexedDB and return the app state: State
 */
export const dbToStateMapper = ({
  todoLists,
  tags,
  todos,
  todosTags,
}: {
  todoLists: ReadonlyArray<TodoListDB>;
  tags: ReadonlyArray<TagDB>;
  todos: ReadonlyArray<TodoDB>;
  todosTags: ReadonlyArray<Omit<TodosTagsDB, "id">>;
}) => {
  let state: State = { todoLists: [], lastReset: null };

  for (const todolist of todoLists) {
    const listTags = tags.filter((tag) => tag.list_id === todolist.id);
    const listTodos = todos.filter((todo) => todo.list_id === todolist.id);

    let stateTodolist: TodoListState = {
      filterBy: null,
      frequencySelected: "Daily",
      globalError: null,
      id: todolist.id,
      position: todolist.position,
      tags: listTags.reduce(
        (acc, tag) => ({ ...acc, [tag.title]: { color: tag.color } }),
        {},
      ),
      title: todolist.title,
      todos: listTodos.map((todo) => todoDBToTodoState(todo, todosTags, tags)),
    };

    state.todoLists.push(stateTodolist);
  }

  return state;
};

const todoDBToTodoState = (
  todo: TodoDB,
  todosTags: ReadonlyArray<Omit<TodosTagsDB, "id">>,
  allTags: ReadonlyArray<TagDB>,
) => {
  const todoTagIds = todosTags
    .filter((tt) => tt.todo_id === todo.id)
    .map((tt) => tt.tag_id);

  const todoTagNames = allTags
    .filter((tt) => todoTagIds.includes(tt.id))
    .map((tt) => tt.title);

  return {
    id: todo.id,
    text: todo.content,
    children: [],
    completedDate: todo.completed_date,
    frequency: todo.frequency,
    position: todo.position,
    tags: todoTagNames,
  };
};
