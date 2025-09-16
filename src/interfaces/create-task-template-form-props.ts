interface CreateTaskTemplateFormProps {
  handleCreateTemplate: (e: React.FormEvent) => void;
  newTemplate: TaskTemplateData;
  setNewTemplate: React.Dispatch<React.SetStateAction<TaskTemplateData>>;
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
}