"use client";
import { TodolistTitle } from "@/ui/TodolistTitle";
import Todolist from "@/ui/Todolist";
import React, { useEffect, useState } from "react";
import { TodoCreate } from "@/ui/TodoCreate";
import { TodoFilter } from "@/ui/TodoFilter";

export default function Page() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // if code exist in query param remove it
    if (window.location.search.includes("code")) {
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = function (event) {
      console.log("received");
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Clean up the event source on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <TodolistTitle />
      <TodoCreate />
      <TodoFilter />
      <Todolist />
    </>
  );
}
