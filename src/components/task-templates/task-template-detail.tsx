import React from "react";
import { TaskTemplateData } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

interface TaskTemplateDetailProps {
  taskTemplate: TaskTemplateData;
}

export const TaskTemplateDetail: React.FC<TaskTemplateDetailProps> = ({ taskTemplate }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{taskTemplate.title}</h2>
        </div>

        {taskTemplate.description && (
          <p className="mt-2 text-default-600">{taskTemplate.description}</p>
        )}
      </div>
    </div>
  );
}