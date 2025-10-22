'use client';

import React from "react";
import { TaskList } from "@/components/tasks/task-list";
import { TaskProvider } from "@/context/task-context";
import { CommentProvider } from "@/context/comment-context";
import { ChecklistProvider } from "@/context/checklist-context";
import { UserProvider } from "@/context/user-context";
import { NotificationProvider } from "@/context/notification-context";
import { TaskTemplateProvider } from "@/context/task-template-context";
import { FileProvider } from "@/context/file-context";

export default function TasksPage() {
  return (
    <UserProvider>
      <NotificationProvider>
        <ChecklistProvider>
          <TaskTemplateProvider>
            <FileProvider>
              <TaskProvider>
                <CommentProvider>
                  <div className="p-4">
                    <TaskList />
                  </div>
                </CommentProvider>
              </TaskProvider>
            </FileProvider>
          </TaskTemplateProvider>
        </ChecklistProvider>
      </NotificationProvider>
    </UserProvider>
  );
}