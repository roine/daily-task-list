import { DailyTaskListDB } from "@/storage/database/database";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { Subject } from "rxjs";
import { RxCollection, RxJsonSchema, RxReplicationPullStreamItem } from "rxdb";
import { Frequency } from "@/state/state";
import {
  initialTodoLists,
  TodoListDB,
} from "@/storage/database/collections/todo_lists";
import { v4 as uuidv4 } from "uuid";

export const remoteTodosStream$ = new Subject<
  RxReplicationPullStreamItem<string, { updatedAt: number; id: string }>
>();

export const createAndPopulateTodosCollection = async (db: DailyTaskListDB) => {
  await db.addCollections({
    todos: {
      schema: todoSchema,
    },
  });

  const replicationState = replicateRxCollection<
    string,
    { updatedAt: number; id: string }
  >({
    collection: db.todos,
    replicationIdentifier: "http-replication",
    retryTime: 1000 * 30,
    autoStart: false,
    push: {
      async handler(changeRows) {
        const rawResponse = await fetch("/api/todos/push", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeRows),
        });
        return await rawResponse.json();
      },
    },
    pull: {
      async handler(lastPulledCheckpoint, batchSize) {
        console.log(lastPulledCheckpoint, batchSize);
        const updatedAt = lastPulledCheckpoint
          ? lastPulledCheckpoint.updatedAt
          : 0;

        const id = lastPulledCheckpoint ? lastPulledCheckpoint.id : "";
        const response = await fetch(
          `/api/todos/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`,
          { credentials: "include", method: "GET" },
        );

        const data = await response.json();

        return {
          documents: data.documents,
          checkpoint: data.checkpoint,
        };
      },
      stream$: remoteTodosStream$.asObservable(),
    },
  });

  replicationState.received$.subscribe((change) => {
    console.log({ change });
  });

  // Replication is only for logged-in users
  await replicationState.start();
  await replicationState.awaitInitialReplication();
  const todoCollectionIsEmpty = (await db.todos.count().exec()) === 0;
  if (todoCollectionIsEmpty) {
    await addDummyTodos(db);
  }

  return replicationState;
};

// MODEL

type ISODateString = string;

export type TodoDB = {
  id: string;
  content: string;
  position: number;
  completed_date: ISODateString | null;
  frequency: Frequency;
  parent_id: TodoDB["id"] | null;
  list_id: TodoListDB["id"];
  created_at: string;
  updated_at: string;
};

export type TodoCollection = RxCollection<TodoDB>;

export const todoSchema: RxJsonSchema<TodoDB> = {
  title: "todos",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    content: { type: "string", maxLength: 100 },
    position: { type: "number", minimum: 0 },
    completed_date: { type: ["null", "string"] },
    frequency: {
      type: "string",
      enum: ["Daily", "Weekly", "Monthly", "Yearly", "Once"],
    },
    parent_id: { type: ["null", "string"] },
    list_id: { type: "string", maxLength: 100 },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: [
    "id",
    "content",
    "position",
    "completed_date",
    "frequency",
    "list_id",
    "updated_at",
  ],
};

export const initialTodos: ReadonlyArray<TodoDB> = [
  {
    id: uuidv4(),
    content: "Press `/` to focus the input #tutorial",
    position: 0,
    completed_date: null,
    frequency: "Daily",
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Add a todo item with `Enter` #tutorial",
    completed_date: null,
    frequency: "Daily",
    position: 1,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Add another todo item with `Enter` #tutorial",
    completed_date: null,
    frequency: "Daily",
    position: 2,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Press `ESC` to unfocus (and access global shortcuts) #tutorial",
    completed_date: null,
    frequency: "Daily",
    position: 3,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Navigate the list with arrow up and down #tutorial",
    completed_date: null,
    frequency: "Daily",
    position: 4,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Press `Enter` to complete a todo item #tutorial",
    completed_date: new Date().toISOString(),
    frequency: "Daily",
    position: 5,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    content: "Create a new todo #tutorial",
    completed_date: null,
    frequency: "Weekly",
    position: 6,
    parent_id: null,
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const addDummyTodos = async (db: DailyTaskListDB) => {
  for (const initialTodo of initialTodos) {
    await db.todos.insert(initialTodo);
  }
};
