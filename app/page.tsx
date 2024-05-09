"use client";
import { TodolistTitle } from "@/ui/TodolistTile";
import Todolist from "@/ui/Todolist";
import React from "react";
import { TodoCreate } from "@/ui/TodoCreate";

export default function Page() {
  return (
    <>
      <TodolistTitle />
      <TodoCreate />
      <Todolist />
    </>
  );
}
