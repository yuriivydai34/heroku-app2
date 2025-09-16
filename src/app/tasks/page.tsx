'use client';

import React from "react";
import { TasksManager } from "@/components/tasks/tasks-manager";

export default function TasksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks Management</h1>
      <TasksManager />
    </div>
  );
}