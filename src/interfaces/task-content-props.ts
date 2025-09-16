interface TaskContentProps {
  task: TaskData;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleUpdateTask: (e: React.FormEvent) => void;
  editForm: TaskData;
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    deadline: string;
    userIdCreator: number;
    usersIdAssociate: number[];
    userIdSupervisor: number;
  }>>
  users: UserData[];
  handleToggleActive: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilesClick: () => void;
  handleDeleteTask: () => void;
}