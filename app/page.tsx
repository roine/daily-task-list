"use client";
import { TodolistTitle } from "@/ui/TodolistTitle";
import Todolist from "@/ui/Todolist";
import React, { useEffect, useState } from "react";
import { TodoCreate } from "@/ui/TodoCreate";
import { TodoFilter } from "@/ui/TodoFilter";

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
      <TodoFilter />
      <Todolist />
    </>
  );
}
