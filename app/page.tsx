"use client";
import { TodolistTitle } from "@/TodolistTile";
import { AppStateProvider } from "@/state/AppStateProvider";
import Todolist from "@/Todolist";
import React from "react";
import { TodoCreate } from "@/TodoCreate";

export default function Home() {
  return (
    <>
      <TodolistTitle />
      <TodoCreate />
      <Todolist />
    </>
  );
}
