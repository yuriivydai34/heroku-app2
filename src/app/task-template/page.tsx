'use client';

import taskTemplateService from "@/services/taskTemplate.service";
import { useEffect, useState } from "react";

// Define TaskTemplateData type or import it from the correct location
type TaskTemplateData = {
  id?: string;
  title: string;
  description: string;
};

export default function TaskTemplatePage() {
    const [templates, setTemplates] = useState<TaskTemplateData[]>([]);
    useEffect(() => {
        const fetchTemplate = async () => {
            const response = await taskTemplateService.fetchTaskTemplates();
            if (response.success) {
                // Handle successful response
                if (Array.isArray(response.data)) {
                    setTemplates(response.data);
                } else if (response.data) {
                    setTemplates([response.data]);
                } else {
                    setTemplates([]);
                }
                console.log("Task templates fetched successfully:", response.data);
            } else {
                // Handle error
                console.error("Failed to fetch task templates:", response.message);
            }
        };
        fetchTemplate();
    }, []);

  return (
    <div>
      <h1>Task Templates</h1>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <h2>{template.title}</h2>
            <p>{template.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
