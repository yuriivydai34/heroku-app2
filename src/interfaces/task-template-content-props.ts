interface TaskTemplateContentProps {
  template: TaskTemplateData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleUpdateTemplate: (e: React.FormEvent) => void;
  editForm: TaskTemplateData;
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
  }>>
  handleDeleteTemplate: () => void;
}