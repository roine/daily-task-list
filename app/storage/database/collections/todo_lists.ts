import { DailyTaskListDB } from "@/storage/database/database";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { Subject } from "rxjs";
import { RxCollection, RxJsonSchema, RxReplicationPullStreamItem } from "rxdb";
import { Frequency } from "@/state/state";
import { v4 as uuidv4 } from "uuid";

export const remoteListsStream$ = new Subject<
  RxReplicationPullStreamItem<string, { updatedAt: number; id: string }>
>();

export const createAndPopulateTodoListsCollection = async (
  db: DailyTaskListDB,
) => {
  await db.addCollections({
    todo_lists: {
      schema: todoListSchema,
    },
  });

  const replicationState = replicateRxCollection<
    string,
    { updatedAt: number; id: string }
  >({
    collection: db.todo_lists,
    replicationIdentifier: "http-replication",
    retryTime: 1000 * 30,
    autoStart: false,
    push: {
      async handler(changeRows) {
        console.log("pushing", changeRows);
        const rawResponse = await fetch("/api/lists/push", {
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
        console.log("calling pull");
        const updatedAt = lastPulledCheckpoint
          ? lastPulledCheckpoint.updatedAt
          : 0;

        const id = lastPulledCheckpoint ? lastPulledCheckpoint.id : "";
        const response = await fetch(
          `/api/lists/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`,
          { credentials: "include", method: "GET" },
        );

        const data = await response.json();

        console.log("pull done");

        return {
          documents: data.documents,
          checkpoint: data.checkpoint,
        };
      },
      stream$: remoteListsStream$.asObservable(),
    },
  });

  replicationState.received$.subscribe((change) => {
    console.log({ change });
  });

  await replicationState.start();
  await replicationState.awaitInitialReplication();
  const collectionIsEmpty = (await db.todo_lists.count().exec()) === 0;
  if (collectionIsEmpty) {
    await addDummyTodoLists(db);
  }

  return replicationState;
};

/**
 * All omitted properties dont need to be stored
 */
export type TodoListDB = {
  id: string;
  title: string;
  frequency_selected: Frequency;
  position: number;
  created_at: string;
  updated_at: string;
};

export type TodoListCollection = RxCollection<TodoListDB>;

export const todoListSchema: RxJsonSchema<TodoListDB> = {
  title: "todo lists",
  description: "Each page has a todolist",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    title: { type: "string", maxLength: 100 },
    frequency_selected: {
      type: "string",
      enum: ["Daily", "Weekly", "Monthly", "Yearly", "Once"],
    },
    position: { type: "number", minimum: 0 },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "title", "frequency_selected", "position", "updated_at"],
};

export const initialTodoLists: ReadonlyArray<TodoListDB> = [
  {
    id: uuidv4(),
    frequency_selected: "Daily",
    position: 0,
    title: "Untitled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const addDummyTodoLists = async (db: DailyTaskListDB) => {
  for (const initialTodoList of initialTodoLists) {
    await db.todo_lists.insert(initialTodoList);
  }
};
