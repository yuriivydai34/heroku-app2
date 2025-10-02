import React from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

export const EmptyChatState: React.FC = () => {
  const t = useTranslations("ChatArea");

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-default-400">
      <Icon icon="lucide:message-square" size={64} className="mb-4" />
      <h3 className="text-xl font-medium mb-2">{t("noConversationSelected")}</h3>
      <p className="text-center max-w-md">
        {t("selectOrCreateChatToStart")}
      </p>
    </div>
  );
};