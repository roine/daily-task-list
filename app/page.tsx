"use client";
import { TodolistTitle } from "@/ui/TodolistTile";
import Todolist from "@/ui/Todolist";
import React, { useEffect } from "react";
import { TodoCreate } from "@/ui/TodoCreate";
import { useAppState } from "@/state/AppStateProvider";

export default function Page() {
  return (
    <>
      <TodolistTitle />
      <TodoCreate />
      <Todolist />
    </>
  );
}
