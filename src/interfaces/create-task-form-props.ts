interface CreateTaskFormProps {
  handleCreateTask: (e: React.FormEvent) => void;
  newTask: TaskData;
  setNewTask: React.Dispatch<React.SetStateAction<TaskData>>;
  users: UserData[];
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  templates: TaskTemplateData[];
}