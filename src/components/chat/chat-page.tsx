import React from "react";
import { useChatContext } from "@/context/chat-context";
import { ChatSidebar } from "./chat-sidebar";
import { ChatArea } from "./chat-area";
import { EmptyChatState } from "./empty-chat-state";

export const ChatPage: React.FC = () => {
  const { activeRoomId, activeDirectUserId } = useChatContext();
  const hasActiveChat = activeRoomId !== null || activeDirectUserId !== null;

  return (
    <div className="flex h-[calc(100vh-13rem)] min-h-[500px]">
      <ChatSidebar />
      
      <div className="flex-grow border-l border-default-200">
        {hasActiveChat ? (
          <ChatArea />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};