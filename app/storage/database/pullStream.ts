import { remoteListsStream$ } from "@/storage/database/collections/todo_lists";
import { remoteTodosStream$ } from "@/storage/database/collections/todos";
import { remoteTagsStream$ } from "@/storage/database/collections/tags";
import { remoteTodosTagsStream$ } from "@/storage/database/collections/todos_tags";

let timer: number;
let eventSource: EventSource;
let keepAliveTimeout = 20_000;

const resetKeepAliveTimer = () => {
  timer && clearTimeout(timer);
  timer = window.setTimeout(() => {
    console.log(
      "Connection lost (keep alive wasn't received on time). Reconnecting...",
    );
    start();
  }, keepAliveTimeout);
};

const handleError = (e: EventSourceEventMap["error"]) => {
  console.log("Error occurred. Reconnecting...");
  console.error("error", e);
  start();
};

const handleMessageReceived = (event: EventSourceEventMap["message"]) => {
  resetKeepAliveTimer();
  console.log(event.data);
  if (event.data === "keep-alive") {
    return;
  }

  try {
    var eventPayload = JSON.parse(event.data);
  } catch (e) {
    console.log("BAD JSON:" + event.data + "\n" + e);
    return;
  }

  console.log(new Date(), "message received", eventPayload);

  const eventData = eventPayload.event;
  switch (eventPayload.entity) {
    case "lists":
      remoteListsStream$.next({
        documents: eventData.documents,
        checkpoint: eventData.checkpoint,
      });
      break;
    case "todos":
      remoteTodosStream$.next({
        documents: eventData.documents,
        checkpoint: eventData.checkpoint,
      });
      break;
    case "tags":
      remoteTagsStream$.next({
        documents: eventData.documents,
        checkpoint: eventData.checkpoint,
      });
      break;
    case "todos_tags":
      remoteTodosTagsStream$.next({
        documents: eventData.documents,
        checkpoint: eventData.checkpoint,
      });
      break;
  }
};

/**
 * Distribute the changes to each collection
 */
export const start = () => {
  console.count("start a session");
  eventSource && eventSource.close();
  eventSource = new EventSource("/api/pullStream", {
    withCredentials: true,
  });

  resetKeepAliveTimer();

  eventSource.addEventListener("error", handleError, false);
  eventSource.addEventListener("message", handleMessageReceived, false);
};
