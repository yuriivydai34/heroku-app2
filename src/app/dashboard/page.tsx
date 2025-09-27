'use client';

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TaskList } from "@/components/task-list";
import { FileManager } from "@/components/file-manager";
import { TaskProvider } from "@/context/task-context";
import { FileProvider } from "@/context/file-context";
import { CommentProvider } from "@/context/comment-context";
import { ChatProvider } from "@/context/chat-context";
import { ChatPage } from "@/components/chat/chat-page";
import NavHeader from "@/components/NavHeader";

export default function App() {
  const [selected, setSelected] = React.useState("tasks");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Navigation Header */}
      <NavHeader />
      {/* Main Content */}
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold mb-6">Task Management System</h1>

        <FileProvider>
          <TaskProvider>
            <CommentProvider>
              <ChatProvider>
                <Card className="mb-8">
                  <CardBody className="p-0">
                    <Tabs
                      selectedKey={selected}
                      onSelectionChange={setSelected as any}
                      classNames={{
                        base: "w-full",
                        tabList: "w-full bg-content2 p-0",
                        tab: "h-14",
                        tabContent: "group-data-[selected=true]:text-primary",
                        cursor: "bg-primary",
                      }}
                    >
                      <Tab key="tasks" title="Tasks">
                        <div className="p-4">
                          <TaskList />
                        </div>
                      </Tab>
                      <Tab key="files" title="File Manager">
                        <div className="p-4">
                          <FileManager />
                        </div>
                      </Tab>
                      <Tab key="chat" title="Chat">
                        <div className="p-0">
                          <ChatPage />
                        </div>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </ChatProvider>
            </CommentProvider>
          </TaskProvider>
        </FileProvider>
      </div>
    </div>
  );
}