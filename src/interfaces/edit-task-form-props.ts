interface EditTaskFormProps {
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
  handleUpdateTask: (e: React.FormEvent) => void;
  setIsEditing: (value: boolean) => void;
}