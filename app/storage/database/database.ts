import { addRxPlugin, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import {
  createAndPopulateTodoListsCollection,
  TodoListCollection,
} from "@/storage/database/collections/todo_lists";
import {
  createAndPopulateTagsCollection,
  TagCollection,
} from "@/storage/database/collections/tags";
import {
  createAndPopulateTodosCollection,
  TodoCollection,
} from "@/storage/database/collections/todos";
import {
  createAndPopulateTodosTagsCollection,
  TodosTagsCollection,
} from "@/storage/database/collections/todos_tags";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { dbToStateMapper } from "@/storage/database/DBToStateMapper";
import { RxDBCleanupPlugin } from "rxdb/plugins/cleanup";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { BrowserStorage } from "@/storage/localstorage";
import * as pullStream from "@/storage/database/pullStream";

export type DatabaseCollections = {
  todo_lists: TodoListCollection;
  tags: TagCollection;
  todos: TodoCollection;
  todos_tags: TodosTagsCollection;
};

export type DailyTaskListDB = Awaited<ReturnType<typeof get>>;

let dbPromise: Promise<DailyTaskListDB> | null = null;

/**
 * The database always is returned with full collections which defers
 * the db access slightly but ensures db and collection availability later on
 * in the executions.
 */
const _create = async () => {
  addRxPlugin(RxDBCleanupPlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);

  console.log("DatabaseService: creating database..");
  const db = await createRxDatabase<DatabaseCollections>({
    name: "daily_task_list", // <- name
    storage: getRxStorageDexie(), // <- RxStorage
  });
  console.log("DatabaseService: created database");

  console.log("DatabaseService: creating collections");
  await createAndPopulateTodoListsCollection(db);
  await createAndPopulateTagsCollection(db);
  await createAndPopulateTodosCollection(db);
  await createAndPopulateTodosTagsCollection(db);
  console.log("DatabaseService: created collections");

  /**
   * On boot, always assign the changes to the localStorage
   */
  const newState = await getLatestStateFromDB(db);
  BrowserStorage.setState({ useSandbox: false }, newState);
  /**
   * Also always send the changes to the application state.
   */

  /**
   * If any change is pulled then update the localStorage state
   * The app State change is subscribed to the database change
   */
  db.$.subscribe(async () => {
    const newState = await getLatestStateFromDB(db);
    BrowserStorage.setState({ useSandbox: false }, newState);
  });

  pullStream.start();

  return db;
};

export const get = (): ReturnType<typeof _create> => {
  console.log("called db get");
  if (!dbPromise) dbPromise = _create();
  return dbPromise;
};

export const getLatestStateFromDB = async (db: DailyTaskListDB) => {
  const todoLists = await db.todo_lists.find().exec();
  const tags = await db.tags.find().exec();
  const todos = await db.todos.find().exec();
  const todosTags = await db.todos_tags.find().exec();

  return dbToStateMapper({
    todoLists,
    tags,
    todos,
    todosTags,
  });
};
