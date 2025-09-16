interface TaskTemplatesListProps {
  setShowCreateForm: (value: boolean) => void;
  showCreateForm: boolean;
  templates: TaskTemplateData[];
  loadTemplates: () => void;
  handleDeleteTemplate: (taskId: string) => void;
}