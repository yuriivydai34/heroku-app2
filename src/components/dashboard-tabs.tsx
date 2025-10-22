'use client';

import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

interface DashboardTabsProps {
  currentPath: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ currentPath }) => {
  const router = useRouter();
  const t = useTranslations('DashboardPage');

  // Determine the selected tab based on the current path
  const getSelectedTab = () => {
    if (currentPath.includes('/dashboard/tasks')) return 'tasks';
    if (currentPath.includes('/dashboard/templates')) return 'templates';
    if (currentPath.includes('/dashboard/files')) return 'files';
    if (currentPath.includes('/dashboard/chat')) return 'chat';
    return 'tasks'; // default
  };

  const handleTabChange = (key: string | number) => {
    const tabKey = key as string;
    router.push(`/dashboard/${tabKey}`);
  };

  return (
    <Tabs
      selectedKey={getSelectedTab()}
      onSelectionChange={handleTabChange}
      classNames={{
        base: "w-full",
        tabList: "w-full bg-content2 p-0",
        tab: "h-14",
        tabContent: "group-data-[selected=true]:text-primary group-data-[selected=true]:font-bold group-data-[selected=true]:!text-black",
        cursor: "bg-primary",
      }}
    >
      <Tab key="tasks" title={t("tasks")} />
      <Tab key="templates" title={t("templates")} />
      <Tab key="files" title={t("files")} />
      <Tab key="chat" title={t("chat")} />
    </Tabs>
  );
};

export default DashboardTabs;