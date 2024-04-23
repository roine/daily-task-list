"use client";
import { TodolistTitle } from "@/TodolistTile";
import { AppStateProvider } from "@/AppStateProvider";
import Todolist from "@/Todolist";
import React from "react";
import { TodoCreate } from "@/TodoCreate";

export default function Home() {
  console.count("rendered");
  return (
    <AppStateProvider>
      <TodolistTitle />
      <TodoCreate />
      <Todolist />
    </AppStateProvider>
  );
}
