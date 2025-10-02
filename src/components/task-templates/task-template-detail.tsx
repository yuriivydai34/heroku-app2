import React from "react";
import { TaskTemplateData } from "@/types";
import { useTranslations } from "next-intl";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

interface TaskTemplateDetailProps {
  taskTemplate: TaskTemplateData;
}

export const TaskTemplateDetail: React.FC<TaskTemplateDetailProps> = ({ taskTemplate }) => {
  const t = useTranslations('TaskTemplates');

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-default-500">{t('titleLabel')}</label>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{taskTemplate.title}</h2>
        </div>

        <label className="text-sm font-medium text-default-500 mt-4 block">{t('descriptionLabel')}</label>
        {taskTemplate.description && (
          <p className="mt-2 text-default-600">{taskTemplate.description}</p>
        )}
      </div>
    </div>
  );
}