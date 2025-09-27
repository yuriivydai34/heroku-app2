import React from "react";
import { Icon } from "@iconify/react";

export const EmptyChatState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-default-400">
      <Icon icon="lucide:message-square" size={64} className="mb-4" />
      <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
      <p className="text-center max-w-md">
        Select a room or user from the sidebar to start chatting, or create a new room to invite team members.
      </p>
    </div>
  );
};