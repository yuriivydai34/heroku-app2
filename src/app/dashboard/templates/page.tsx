'use client';

import React from "react";
import { TaskTemplateList } from "@/components/task-templates/task-template-list";
import { TaskTemplateProvider } from "@/context/task-template-context";
import { UserProvider } from "@/context/user-context";
import { NotificationProvider } from "@/context/notification-context";

export default function TemplatesPage() {
  return (
    <UserProvider>
      <NotificationProvider>
        <TaskTemplateProvider>
          <div className="p-4">
            <TaskTemplateList />
          </div>
        </TaskTemplateProvider>
      </NotificationProvider>
    </UserProvider>
  );
}