import { DailyTaskListDB } from "@/storage/database/database";
import { replicateRxCollection } from "rxdb/plugins/replication";
import { Subject } from "rxjs";
import { RxCollection, RxJsonSchema, RxReplicationPullStreamItem } from "rxdb";
import {
  initialTodoLists,
  TodoListDB,
} from "@/storage/database/collections/todo_lists";
import { v4 as uuidv4 } from "uuid";

export const remoteTagsStream$ = new Subject<
  RxReplicationPullStreamItem<string, { updatedAt: number; id: string }>
>();

export const createAndPopulateTagsCollection = async (db: DailyTaskListDB) => {
  await db.addCollections({
    tags: {
      schema: tagSchema,
    },
  });

  const replicationState = replicateRxCollection<
    string,
    { updatedAt: number; id: string }
  >({
    collection: db.tags,
    replicationIdentifier: "http-replication",
    retryTime: 1000 * 30,
    autoStart: false,
    push: {
      async handler(changeRows) {
        const rawResponse = await fetch("/api/tags/push", {
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
        const updatedAt = lastPulledCheckpoint
          ? lastPulledCheckpoint.updatedAt
          : 0;

        const id = lastPulledCheckpoint ? lastPulledCheckpoint.id : "";
        const response = await fetch(
          `/api/tags/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`,
          { credentials: "include", method: "GET" },
        );

        const data = await response.json();

        return {
          documents: data.documents,
          checkpoint: data.checkpoint,
        };
      },
      stream$: remoteTagsStream$.asObservable(),
    },
  });

  replicationState.received$.subscribe((change) => {
    console.log({ change });
  });

  // Replication is only for logged-in users
  await replicationState.start();
  await replicationState.awaitInitialReplication();
  const tagCollectionIsEmpty = (await db.tags.count().exec()) === 0;
  if (tagCollectionIsEmpty) {
    await addDummyTodoTags(db);
  }

  return replicationState;
};

// MODEL

export type TagDB = {
  id: string;
  title: string;
  color: string;
  list_id: TodoListDB["id"];
  created_at: string;
  updated_at: string;
};

export type TagCollection = RxCollection<TagDB>;

export const tagSchema: RxJsonSchema<TagDB> = {
  title: "tags",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    title: { type: "string", maxLength: 100 },
    color: { type: "string", maxLength: 100 },
    list_id: { type: "string", maxLength: 100 },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "title", "color", "list_id", "updated_at"],
};

export const initialTags: ReadonlyArray<TagDB> = [
  {
    id: uuidv4(),
    title: "#tutorial",
    color: "rose",
    list_id: initialTodoLists[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const addDummyTodoTags = async (db: DailyTaskListDB) => {
  for (const initialTag of initialTags) {
    await db.tags.insert(initialTag);
  }
};
