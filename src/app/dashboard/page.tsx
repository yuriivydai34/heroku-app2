'use client';

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { TaskList } from "@/components/tasks/task-list";
import { FileManager } from "@/components/file-manager";
import { TaskProvider } from "@/context/task-context";
import { FileProvider } from "@/context/file-context";
import { CommentProvider } from "@/context/comment-context";
import { ChatProvider } from "@/context/chat-context";
import { ChatPage } from "@/components/chat/chat-page";
import { NavbarComponent } from "@/components/navbar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ChecklistProvider } from "@/context/checklist-context";
import { UserProvider } from "@/context/user-context";

export default function App() {
  const router = useRouter();

  const [selected, setSelected] = React.useState("tasks");

  const t = useTranslations('DashboardPage');

  const handleLogout = async () => {
    // Clear any authentication tokens or session data here
    await authService.logout();

    // Redirect to login page
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Navbar */}
      <NavbarComponent onLogout={handleLogout} />

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>

        <UserProvider>
          <ChecklistProvider>
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
          </ChecklistProvider>
        </UserProvider>
      </div>
    </div>
  );
}