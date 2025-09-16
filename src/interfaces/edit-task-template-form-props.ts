interface EditTaskTemplateFormProps {
  editForm: TaskTemplateData;
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
  }>>
  handleUpdateTemplate: (e: React.FormEvent) => void;
  setIsEditing: (value: boolean) => void;
}