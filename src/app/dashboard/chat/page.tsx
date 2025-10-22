'use client';

import React from "react";
import { ChatPage } from "@/components/chat/chat-page";
import { ChatProvider } from "@/context/chat-context";
import { FileProvider } from "@/context/file-context";
import { UserProvider } from "@/context/user-context";
import { NotificationProvider } from "@/context/notification-context";

export default function ChatPageRoute() {
  return (
    <UserProvider>
      <NotificationProvider>
        <FileProvider>
          <ChatProvider>
            <div className="p-0">
              <ChatPage />
            </div>
          </ChatProvider>
        </FileProvider>
      </NotificationProvider>
    </UserProvider>
  );
}