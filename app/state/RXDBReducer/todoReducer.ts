import { DailyTaskListDB } from "@/storage/database/database";
import { State } from "@/state/state";
import { TodoAction } from "@/state/actions/todoActions";
import { v4 as uuidv4 } from "uuid";

/**
 * We react to action and state change, this is the best place to put side effects
 * as it has the latest state change and the action executed
 */
export const reducer =
  (db: DailyTaskListDB) =>
  async (
    { oldState, newState }: { oldState: State; newState: State },
    action: TodoAction,
  ): Promise<void> => {
    console.log("RXDB reducer", action);
    switch (action.type) {
      case "CHANGE_TODOLIST_TITLE": {
        const { todoListId, title } = action.payload;
        console.log(todoListId, title);
        db.todo_lists
          .findOne()
          .where("id")
          .eq(todoListId)
          .patch({ title, updated_at: new Date().toISOString() })
          .then(console.log)
          .catch(console.error);
        break;
      }

      case "ADD_TODO": {
        const { todo, listId } = action.payload;
        await db.todos.insert({
          id: todo.id,
          parent_id: null,
          content: todo.text,
          completed_date: todo.completedDate,
          position: todo.position,
          frequency: todo.frequency,
          list_id: listId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        const tags = await db.tags.find().where("title").in(todo.tags).exec();

        for (const tag of tags) {
          // @ts-ignore ID is generated from the composition of todo id and tag id
          await db.todos_tags.insert({
            todo_id: todo.id,
            tag_id: tag.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        break;
      }

      case "UPDATE_TAGS": {
        const { tags, listId } = action.payload;
        if (tags.length > 0) {
          // we look into the updated state to find the tag metadata (color)
          for (const list of newState.todoLists) {
            if (list.id === listId) {
              for (const tag of tags) {
                const tagRecordState = list.tags?.[tag];
                const tagRecordDB = await db.tags
                  .findOne()
                  .where("title")
                  .eq(tag)
                  .exec();

                if (tagRecordState && !tagRecordDB) {
                  await db.tags.insert({
                    id: uuidv4(),
                    title: tag,
                    list_id: listId,
                    color: tagRecordState.color,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                }
              }
            }
          }
        }
        break;
      }

      case "EDIT_TODO": {
        const { todo, listId } = action.payload;
        await db.todos
          .findOne()
          .where("id")
          .eq(todo.id)
          .patch({ content: todo.text });

        const tags = await db.tags.find().where("title").in(todo.tags).exec();

        await db.todos_tags.find().where("todo_id").eq(todo.id).remove();

        for (const tag of tags) {
          await db.todos_tags.insert({
            id: [todo.id, tag.id].join("|"),
            todo_id: todo.id,
            tag_id: tag.id,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
        break;
      }

      case "TOGGLE_COMPLETED": {
        const { id } = action.payload;
        void db.todos
          .findOne()
          .where("id")
          .eq(id)
          .modify((docData) => {
            docData.completed_date = docData.completed_date
              ? null
              : new Date().toISOString();
            docData.updated_at = new Date().toISOString();
            return docData;
          });
        break;
      }
      case "DELETE_TODO": {
        const { todoId } = action.payload;
        console.log("calling delete", todoId);
        void db.todos.findOne().where("id").eq(todoId).remove();
        break;
      }
    }
  };
