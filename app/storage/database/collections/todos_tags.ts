import { DailyTaskListDB } from "@/storage/database/database";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { Subject } from "rxjs";
import { RxCollection, RxJsonSchema, RxReplicationPullStreamItem } from "rxdb";
import { initialTodos, TodoDB } from "@/storage/database/collections/todos";
import { initialTags, TagDB } from "@/storage/database/collections/tags";

export const remoteTodosTagsStream$ = new Subject<
  RxReplicationPullStreamItem<string, { updatedAt: number; id: string }>
>();

export const createAndPopulateTodosTagsCollection = async (
  db: DailyTaskListDB,
) => {
  await db.addCollections({
    todos_tags: {
      schema: todosTagsSchema,
    },
  });

  const replicationState = replicateRxCollection<
    string,
    { updatedAt: number; id: string }
  >({
    collection: db.todos_tags,
    replicationIdentifier: "http-replication",
    retryTime: 1000 * 30,
    autoStart: false,
    push: {
      async handler(changeRows) {
        const rawResponse = await fetch("/api/todos_tags/push", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeRows),
        });
        return rawResponse.json();
      },
    },
    pull: {
      async handler(lastPulledCheckpoint, batchSize) {
        const updatedAt = lastPulledCheckpoint
          ? lastPulledCheckpoint.updatedAt
          : 0;

        const id = lastPulledCheckpoint ? lastPulledCheckpoint.id : "";
        const response = await fetch(
          `/api/todos_tags/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`,
          { credentials: "include", method: "GET" },
        );

        const data = await response.json();

        // id are generated by RXDB as a composite key of todo_id and tag_id, id doesnt exist in app state or the remote db
        data.documents = data.documents.map((doc: Omit<TodosTagsDB, "id">) => ({
          id: `${doc.todo_id}|${doc.tag_id}`,
          ...doc,
        }));

        return {
          documents: data.documents,
          checkpoint: data.checkpoint,
        };
      },
      stream$: remoteTodosTagsStream$.asObservable(),
    },
  });

  replicationState.received$.subscribe((change) => {
    console.log({ change });
  });

  // Replication is only for logged-in users
  await replicationState.start();
  await replicationState.awaitInitialReplication();
  const todoTagCollectionIsEmpty = (await db.todos_tags.count().exec()) === 0;
  if (todoTagCollectionIsEmpty) {
    await addDummyTodosTags(db);
  }

  return replicationState;
};

// MODEL

export type TodosTagsDB = {
  // composite key
  id: string;
  todo_id: TodoDB["id"];
  tag_id: TagDB["id"];
  created_at: string;
  updated_at: string;
};

export type TodosTagsCollection = RxCollection<TodosTagsDB>;

export const todosTagsSchema: RxJsonSchema<TodosTagsDB> = {
  title: "todos_tags",
  version: 0,
  primaryKey: {
    // where should the composed string be stored
    key: "id",
    // fields that will be used to create the composed key
    fields: ["todo_id", "tag_id"],
    // separator which is used to concat the fields values.
    separator: "|",
  },
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    todo_id: { type: "string", maxLength: 100 },
    tag_id: { type: "string", maxLength: 100 },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "todo_id", "tag_id", "updated_at"],
};

export const initialTodosTags: ReadonlyArray<Omit<TodosTagsDB, "id">> = [
  {
    todo_id: initialTodos[0].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[1].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[2].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[3].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[4].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[5].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    todo_id: initialTodos[6].id,
    tag_id: initialTags[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const addDummyTodosTags = async (db: DailyTaskListDB) => {
  for (const initialTodosTag of initialTodosTags) {
    // @ts-ignore  id is generated from the composition of todo and tag ids
    await db.todos_tags.insert(initialTodosTag);
  }
};
