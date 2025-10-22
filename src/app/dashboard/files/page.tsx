'use client';

import React from "react";
import { FileManager } from "@/components/file-manager";
import { FileProvider } from "@/context/file-context";
import { UserProvider } from "@/context/user-context";
import { NotificationProvider } from "@/context/notification-context";

export default function FilesPage() {
  return (
    <UserProvider>
      <NotificationProvider>
        <FileProvider>
          <div className="p-4">
            <FileManager />
          </div>
        </FileProvider>
      </NotificationProvider>
    </UserProvider>
  );
}