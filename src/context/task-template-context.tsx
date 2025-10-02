import React from "react";
import { TaskTemplateData } from "@/types";
import { taskTemplateService } from "@/services/task-template.service";

interface TaskTemplateContextType {
  templates: TaskTemplateData[];
  loading: boolean;
  error: string | null;
  selectedTemplate: TaskTemplateData | null;
  fetchTaskTemplates: () => Promise<void>;
  fetchTaskTemplate: (templateId: number) => Promise<TaskTemplateData>;
  createTaskTemplate: (template: TaskTemplateData) => Promise<TaskTemplateData>;
  updateTaskTemplate: (template: TaskTemplateData) => Promise<TaskTemplateData>;
  deleteTaskTemplate: (id: number) => Promise<boolean>;
  selectTaskTemplate: (template: TaskTemplateData | null) => void;
}

const TaskTemplateContext = React.createContext<TaskTemplateContextType>({
  templates: [],
  loading: false,
  error: null,
  selectedTemplate: null,
  fetchTaskTemplates: async () => {[] as TaskTemplateData[]},
  fetchTaskTemplate: async (templateId: number) => ({} as TaskTemplateData),
  createTaskTemplate: async () => ({} as TaskTemplateData),
  updateTaskTemplate: async () => ({} as TaskTemplateData),
  deleteTaskTemplate: async () => false,
  selectTaskTemplate: () => { }
});

export const useTaskTemplateContext = () => React.useContext(TaskTemplateContext);

export const TaskTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = React.useState<TaskTemplateData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TaskTemplateData | null>(null);

  const fetchTaskTemplates = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await taskTemplateService.fetchTaskTemplates();
      setTemplates(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load task templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTaskTemplate = React.useCallback(async (templateId: number) => {
    setLoading(true);
    setError(null);

    try {
      if (!templateId) throw new Error('Template ID is required');
      const data = await taskTemplateService.fetchTaskTemplate(templateId);
      setSelectedTemplate(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load task template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTaskTemplate = React.useCallback(async (template: TaskTemplateData) => {
    setLoading(true);
    setError(null);

    try {
      const newTemplate = await taskTemplateService.createTaskTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create task template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskTemplate = React.useCallback(async (template: TaskTemplateData) => {
    setLoading(true);
    setError(null);

    try {
      if (!template.id) throw new Error('Template ID is required');
      const updatedTemplate = await taskTemplateService.updateTaskTemplate(template.id, template);
      setTemplates(prev => prev.map(t => t.id === template.id ? updatedTemplate : t));
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(updatedTemplate);
      }
      return updatedTemplate;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  const deleteTaskTemplate = React.useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      if (!id) throw new Error('Template ID is required');
      await taskTemplateService.deleteTaskTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  const selectTaskTemplate = React.useCallback((template: TaskTemplateData | null) => {
    setSelectedTemplate(template);
  }, []);

  React.useEffect(() => {
    fetchTaskTemplates();
  }, [fetchTaskTemplates]);

  const contextValue = {
    templates,
    loading,
    error,
    selectedTemplate,
    fetchTaskTemplates,
    fetchTaskTemplate,
    createTaskTemplate,
    updateTaskTemplate,
    deleteTaskTemplate,
    selectTaskTemplate
  };

  return (
    <TaskTemplateContext.Provider
      value={contextValue}
    >
      {children}
    </TaskTemplateContext.Provider>
  );
};

