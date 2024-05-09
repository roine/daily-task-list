"use client";
import { TodolistTitle } from "@/ui/TodolistTile";
import Todolist from "@/ui/Todolist";
import React, { useEffect } from "react";
import { TodoCreate } from "@/ui/TodoCreate";

export default function Page() {
  useEffect(() => {
    // if code exist in query param remove it
    if (window.location.search.includes("code")) {
      window.history.replaceState({}, document.title, "/");
    }
  }, []);
  return (
    <>
      <TodolistTitle />
      <TodoCreate />
      <Todolist />
    </>
  );
}
